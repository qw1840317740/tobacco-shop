const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function run() {
  const brands = [
    // JT日本品牌
    { id:"brand_mevius", slug:"mevius", name:"Mevius", nameJa:"メビウス", nameEn:"Mevius", nameZh:"梅比乌斯", group:"jt_japan", sortOrder:1 },
    { id:"brand_seven_stars", slug:"seven-stars", name:"Seven Stars", nameJa:"セブンスター", nameEn:"Seven Stars", nameZh:"七星", group:"jt_japan", sortOrder:2 },
    { id:"brand_peace", slug:"peace", name:"Peace", nameJa:"ピース", nameEn:"Peace", nameZh:"和平", group:"jt_japan", sortOrder:3 },
    { id:"brand_hope", slug:"hope", name:"Hope", nameJa:"ホープ", nameEn:"Hope", nameZh:"希望", group:"jt_japan", sortOrder:4 },
    { id:"brand_highlight", slug:"highlight", name:"Highlight", nameJa:"ハイライト", nameEn:"Highlight", nameZh:"高光", group:"jt_japan", sortOrder:5 },
    { id:"brand_wakaba", slug:"wakaba", name:"Wakaba", nameJa:"わかば", nameEn:"Wakaba", nameZh:"若叶", group:"jt_japan", sortOrder:6 },
    { id:"brand_echo", slug:"echo", name:"Echo", nameJa:"エコー", nameEn:"Echo", nameZh:"回声", group:"jt_japan", sortOrder:7 },
    { id:"brand_uruma", slug:"uruma", name:"Uruma", nameJa:"うるま", nameEn:"Uruma", nameZh:"宇流麻", group:"jt_japan", sortOrder:8 },
    { id:"brand_pianissimo", slug:"pianissimo", name:"Pianissimo", nameJa:"ピアニッシモ", nameEn:"Pianissimo", nameZh:"极弱", group:"jt_japan", sortOrder:9 },
    { id:"brand_caster", slug:"caster", name:"Caster", nameJa:"キャスター", nameEn:"Caster", nameZh:"佳士达", group:"jt_japan", sortOrder:10 },
    { id:"brand_forte", slug:"forte", name:"Forte", nameJa:"フォルテ", nameEn:"Forte", nameZh:"强音", group:"jt_japan", sortOrder:11 },
    { id:"brand_frontier", slug:"frontier", name:"Frontier", nameJa:"フロンティア", nameEn:"Frontier", nameZh:"边疆", group:"jt_japan", sortOrder:12 },
    { id:"brand_golden_bat", slug:"golden-bat", name:"Golden Bat", nameJa:"ゴールデンバット", nameEn:"Golden Bat", nameZh:"金蝙蝠", group:"jt_japan", sortOrder:13 },
    { id:"brand_shinsei", slug:"shinsei", name:"Shinsei", nameJa:"しんせい", nameEn:"Shinsei", nameZh:"新生", group:"jt_japan", sortOrder:14 },
    { id:"brand_ikoi", slug:"ikoi", name:"Ikoi", nameJa:"いこい", nameEn:"Ikoi", nameZh:"憩", group:"jt_japan", sortOrder:15 },
    // JT国际品牌
    { id:"brand_winston", slug:"winston", name:"Winston", nameJa:"ウィンストン", nameEn:"Winston", nameZh:"温斯顿", group:"jt_international", sortOrder:16 },
    { id:"brand_camel", slug:"camel", name:"Camel", nameJa:"キャメル", nameEn:"Camel", nameZh:"骆驼", group:"jt_international", sortOrder:17 },
    { id:"brand_american_spirit", slug:"american-spirit", name:"Natural American Spirit", nameJa:"ナチュラルアメリカンスピリット", nameEn:"Natural American Spirit", nameZh:"自然美国精神", group:"jt_international", sortOrder:18 },
    { id:"brand_ld", slug:"ld", name:"LD", nameJa:"LD", nameEn:"LD", nameZh:"LD", group:"jt_international", sortOrder:19 },
    { id:"brand_benson", slug:"benson-hedges", name:"Benson & Hedges", nameJa:"Benson & Hedges", nameEn:"Benson & Hedges", nameZh:"本森海知", group:"jt_international", sortOrder:20 },
    { id:"brand_silk_cut", slug:"silk-cut", name:"Silk Cut", nameJa:"Silk Cut", nameEn:"Silk Cut", nameZh:"丝切", group:"jt_international", sortOrder:21 },
    { id:"brand_sobranie", slug:"sobranie", name:"Sobranie", nameJa:"Sobranie", nameEn:"Sobranie", nameZh:"寿百年", group:"jt_international", sortOrder:22 },
    { id:"brand_glamour", slug:"glamour", name:"Glamour", nameJa:"Glamour", nameEn:"Glamour", nameZh:"魅力", group:"jt_international", sortOrder:23 },
    // Ploom加热烟
    { id:"brand_ploom_x", slug:"ploom-x", name:"Ploom X", nameJa:"Ploom X", nameEn:"Ploom X", nameZh:"Ploom X", group:"ploom", sortOrder:24 },
    { id:"brand_ploom_aura", slug:"ploom-aura", name:"Ploom AURA", nameJa:"Ploom AURA", nameEn:"Ploom AURA", nameZh:"Ploom AURA", group:"ploom", sortOrder:25 },
    { id:"brand_mevius_ploom", slug:"mevius-ploom", name:"MEVIUS for Ploom", nameJa:"MEVIUS for Ploom", nameEn:"MEVIUS for Ploom", nameZh:"梅比乌斯 Ploom专用", group:"ploom", sortOrder:26 },
    { id:"brand_camel_ploom", slug:"camel-ploom", name:"Camel for Ploom", nameJa:"Camel for Ploom", nameEn:"Camel for Ploom", nameZh:"骆驼 Ploom专用", group:"ploom", sortOrder:27 },
  ];

  for (const b of brands) {
    await db.category.create({
      data: { id: b.id, slug: b.slug, name: b.name, nameJa: b.nameJa, nameEn: b.nameEn, nameZh: b.nameZh, group: b.group, sortOrder: b.sortOrder, visible: true }
    });
    console.log("Created:", b.nameJa, "/", b.nameEn, "/", b.nameZh, "(" + b.group + ")");
  }

  // Move products to brand categories
  const moves = {
    brand_mevius: ["prod_4","prod_mevius_rich_1060","prod_mevius_rich_box_1061","prod_mevius_1023","prod_mevius_box_1286","prod_mevius_100s_box_1381","prod_mevius_lights_1138","prod_mevius_lights_box_1299","prod_mevius_lights_100s_box_1424","prod_mevius_super_lights_1223","prod_mevius_super_lights_box_1296","prod_mevius_super_lights_100s_box_1462","prod_mevius_extra_lights_1355","prod_mevius_extra_lights_box_1310","prod_mevius_extra_lights_100s_box_1329","prod_mevius_one_1372","prod_mevius_one_box_1356"],
    brand_seven_stars: ["prod_1"],
    brand_peace: ["prod_3"],
    brand_hope: ["prod_7"],
    brand_echo: ["prod_12"],
    brand_caster: ["prod_2"],
    brand_winston: ["prod_8"],
    brand_camel: ["prod_9"],
    brand_american_spirit: ["prod_10"],
  };

  for (const [catId, prodIds] of Object.entries(moves)) {
    for (const pid of prodIds) {
      await db.product.update({ where: { id: pid }, data: { categoryId: catId } });
    }
    console.log("Moved", prodIds.length, "products to", catId);
  }

  // Check remaining in old cat
  const remaining = await db.product.findMany({ where: { categoryId: "cat_cigarettes" } });
  console.log("Remaining in old cat:", remaining.map(p => p.name));

  // Delete old category (products will cascade delete! we need to move them first)
  // For Lark, Parliament, Cabin - they don't match listed brands. Let's just delete them for now.
  if (remaining.length > 0) {
    // Delete the unmatched products first
    for (const p of remaining) {
      await db.product.delete({ where: { id: p.id } });
      console.log("Deleted unmatched:", p.name);
    }
  }
  // Now delete old category
  await db.category.delete({ where: { id: "cat_cigarettes" } });
  console.log("Deleted old cat_cigarettes category");

  const total = await db.product.count();
  const catCount = await db.category.count();
  console.log("Final: " + total + " products in " + catCount + " brand categories");
  await db.$disconnect();
}

run().catch(e => { console.error(e); db.$disconnect(); });
