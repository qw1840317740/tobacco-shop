/**
 * One-off data cleanup for the live Neon DB.
 * Run: npx tsx scripts/cleanup-data.ts
 *
 * Fixes:
 *  1. Duplicate products (same slug OR same name) — keep the oldest, delete the rest.
 *  2. Placeholder prices (price <= 100, e.g. ¥1 / $1) — set to a sane default (¥500).
 *  3. Reports a summary; safe to re-run (idempotent).
 */
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";
config();

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const PLACEHOLDER_MAX = 100; // prices <= this are treated as placeholders
const DEFAULT_PRICE = 500;

async function main() {
  const products = await db.product.findMany({ orderBy: { createdAt: "asc" } });
  console.log(`Total products: ${products.length}`);

  // --- 1. Dedupe by slug (keep oldest) ---
  const seenSlug = new Map<string, string>(); // slug -> kept id
  const seenName = new Map<string, string>(); // lowercased name -> kept id
  const toDelete: string[] = [];

  for (const p of products) {
    const slugKey = (p.slug || "").trim().toLowerCase();
    const nameKey = (p.name || "").trim().toLowerCase();
    const slugDup = slugKey && seenSlug.has(slugKey);
    const nameDup = nameKey && seenName.has(nameKey);
    if (slugDup || nameDup) {
      toDelete.push(p.id);
      console.log(`  DUP delete: ${p.id}  slug=${p.slug}  name=${p.name}`);
    } else {
      if (slugKey) seenSlug.set(slugKey, p.id);
      if (nameKey) seenName.set(nameKey, p.id);
    }
  }
  if (toDelete.length) {
    await db.product.deleteMany({ where: { id: { in: toDelete } } });
    console.log(`Deleted ${toDelete.length} duplicate product(s).`);
  } else {
    console.log("No duplicates found.");
  }

  // --- 2. Fix placeholder prices ---
  const cheap = await db.product.findMany({ where: { price: { lte: PLACEHOLDER_MAX } } });
  if (cheap.length) {
    console.log(`Placeholder prices (<= ${PLACEHOLDER_MAX}):`);
    for (const p of cheap) console.log(`   ${p.slug}: ${p.price}`);
    await db.product.updateMany({
      where: { price: { lte: PLACEHOLDER_MAX } },
      data: { price: DEFAULT_PRICE },
    });
    console.log(`Reset ${cheap.length} placeholder price(s) to ${DEFAULT_PRICE}.`);
  } else {
    console.log("No placeholder prices found.");
  }

  // --- Summary ---
  const final = await db.product.findMany();
  console.log(`\nFinal product count: ${final.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
