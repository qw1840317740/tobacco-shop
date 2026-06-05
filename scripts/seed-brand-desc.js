const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function run() {
  const descs = {
    brand_mevius: "JTの代表的ブランド。豊かな風味と滑らかな吸い心地で、幅広いラインナップを展開。リッチからワンまで濃さが選べます。",
    brand_seven_stars: "1969年誕生のJT長売ブランド。コクのある味わいと芳醇な香りが特徴の日本を代表するたばこ。",
    brand_peace: "1946年誕生のJT誇るプレミアムブランド。上品な香りと深いコクが特徴。",
    brand_hope: "1958年誕生のロングセラーブランド。マイルドで飲みやすい味わいが幅広い層に支持されています。",
    brand_echo: "JTの超人気マイルドブランド。軽やかな吸い心地とすっきりした味わいが特徴。",
    brand_caster: "独自のフレーバー技術で作られたJTブランド。なめらかな味わいと芳香が特徴。",
    brand_winston: "世界的大人気ブランド。力強い味わいとアメリカンブレンドの王道を行く一本。",
    brand_camel: "1913年誕生の世界的ブランド。独自のブレンド技術による豊かな風味が特徴。",
    brand_american_spirit: "100%オーガニックタバコ葉を使用。添加物不使用のナチュラルな味わい。",
  };

  for (const [id, desc] of Object.entries(descs)) {
    await db.category.update({ where: { id }, data: { description: desc } });
    const cat = await db.category.findUnique({ where: { id }, select: { nameJa: true } });
    console.log("Updated:", cat.nameJa);
  }

  console.log("Done!");
  await db.$disconnect();
}
run().catch(e => { console.error(e); db.$disconnect(); });
