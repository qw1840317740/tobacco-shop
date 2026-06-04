import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });

const HERO_IMAGES = {
  main: "https://images.unsplash.com/photo-1502389872488-08725e638945?w=1920&q=80",
  leaves: "https://images.unsplash.com/photo-1553433342-956cde1d7646?w=1920&q=80",
  barn: "https://images.unsplash.com/photo-1634922951968-11ca107aa6e3?w=1920&q=80",
};

async function main() {
  console.log("Seeding database...");

  // Create category
  const category = await db.category.upsert({
    where: { slug: "cigarettes" },
    update: {},
    create: {
      id: "cat_cigarettes",
      slug: "cigarettes",
      name: "Cigarettes",
      nameJa: "日本製たばこ",
      nameZh: "日本制香烟",
      description: "日本製の高品質たばこ",
      image: "https://upload.wikimedia.org/wikipedia/en/6/69/Sevenstars.jpg",
      count: 500,
      sortOrder: 1,
      visible: true,
    },
  });

  console.log(`Created category: ${category.name}`);

  // Create products
  const products = [
    {
      id: "prod_1", slug: "seven-stars", name: "Seven Stars", price: 520, comparePrice: 580,
      image: "https://upload.wikimedia.org/wikipedia/en/6/69/Sevenstars.jpg",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 4, featured: true,
      desc: "JT人気ブランド。1969年発売の日本を代表するプレミアムたばこ。豊かで深い味わい。",
      categoryId: category.id,
    },
    {
      id: "prod_2", slug: "caster", name: "Caster", price: 480, comparePrice: 540,
      image: "https://upload.wikimedia.org/wikipedia/en/f/fa/Caster.jpg",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 3, featured: true,
      desc: "JTの人気ブランド。やさしい香りとマイルドな味わいが特徴。",
      categoryId: category.id,
    },
    {
      id: "prod_3", slug: "peace", name: "Peace", price: 500,
      image: "https://upload.wikimedia.org/wikipedia/commons/5/54/The_Peace.jpg",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 3, featured: true,
      desc: "1946年発売の日本のロングセラーブランド。歴史ある上品な味わい。",
      categoryId: category.id,
    },
    {
      id: "prod_4", slug: "mevius", name: "Mevius", price: 480,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Mevius_Sky_Blue.png/800px-Mevius_Sky_Blue.png",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 2, featured: true,
      desc: "旧マイルドセブン。JTの代表作。穏やかでマイルドな味わい。国内最畅销ブランド。",
      categoryId: category.id,
    },
    {
      id: "prod_5", slug: "lark", name: "Lark", price: 530, comparePrice: 590,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/LARK_Black_Label.JPG/800px-LARK_Black_Label.JPG",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 4, featured: true,
      desc: "日本での知名度が高いプレミアムブランド。深みのある豊かな味わい。",
      categoryId: category.id,
    },
    {
      id: "prod_6", slug: "parliament", name: "Parliament", price: 620,
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/97/Parliament_%28cigarette%29_pack.jpg/120px-Parliament_%28cigarette%29_pack.jpg",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 3, featured: true,
      desc: "フィルター付きたばこの先駆者。洗練された品質と優雅な喫煙体験。",
      categoryId: category.id,
    },
    {
      id: "prod_7", slug: "hope", name: "Hope", price: 460,
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Hope_cigarette_02.JPG",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 2, featured: true,
      desc: "1957年発売の定番ブランド。クリーンで爽やかな喫い心地。",
      categoryId: category.id,
    },
    {
      id: "prod_8", slug: "winston", name: "Winston", price: 490, comparePrice: 550,
      image: "https://images.unsplash.com/photo-1572113564617-7230ee196d9a?w=600&q=80",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 3, featured: false,
      desc: "JTが国内製造・販売する世界的ブランド。バランスの良い味わい。",
      categoryId: category.id,
    },
    {
      id: "prod_9", slug: "camel", name: "Camel", price: 520, comparePrice: 580,
      image: "https://images.unsplash.com/photo-1649779117064-107e63b88758?w=600&q=80",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 3, featured: false,
      desc: "JTが日本国内で製造するキャメル。トルコ・バージニア葉のブレンド。",
      categoryId: category.id,
    },
    {
      id: "prod_10", slug: "natural-american-spirit", name: "Natural American Spirit", price: 780, comparePrice: 850,
      image: "https://upload.wikimedia.org/wikipedia/en/7/7a/NASlogo.png",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 4, featured: false,
      desc: "100%オーガニックタバコ葉を使用。添加物不使用の自然派ブランド。",
      categoryId: category.id,
    },
    {
      id: "prod_11", slug: "cabin", name: "Cabin", price: 450,
      image: "https://images.unsplash.com/photo-1627449543657-ab677b2105e4?w=600&q=80",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 2, featured: false,
      desc: "JTの超人気ブランド。マイルドで飲みやすく、初心者にもおすすめ。",
      categoryId: category.id,
    },
    {
      id: "prod_12", slug: "echo", name: "Echo", price: 440,
      image: "https://images.unsplash.com/photo-1513053508821-1c2e73e3ecc7?w=600&q=80",
      type: "CIGARETTE", region: "Japan", inStock: true, strength: 2, featured: false,
      desc: "JTのロングセラー経済銘柄。コストパフォーマンスに優れた定番。",
      categoryId: category.id,
    },
  ];

  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Created ${products.length} products`);

  // Create default admin
  const { createHash } = await import("crypto");
  const passwordHash = createHash("sha256").update("admin123").digest("hex");

  await db.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      id: "admin_default",
      username: "admin",
      passwordHash,
      role: "superadmin",
    },
  });

  console.log("Created default admin (username: admin, password: admin123)");

  // Create test customer user
  const userPasswordHash = createHash("sha256").update("test123").digest("hex");
  await db.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      id: "user_test",
      email: "test@example.com",
      passwordHash: userPasswordHash,
      name: "テスト太郎",
      phone: "090-1234-5678",
      birthdate: new Date("1990-01-15"),
      ageVerified: true,
      ageDocStatus: "approved",
      ageDocType: "drivers_license",
      ageDocUrl: "/uploads/test-doc.jpg",
      role: "customer",
    },
  });
  console.log("Created test user (email: test@example.com, password: test123)");

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
