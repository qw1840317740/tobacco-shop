import { Card } from "@/components/ui/card";

const GUIDES = [
  { title: "吸い方ガイド", desc: "たばこの基本的な吸い方をイラスト付きで解説。正しい火の付け方から、味わいを楽しむコツまで。", icon: "🚬", img: "https://images.unsplash.com/photo-1589279003513-467d320f47eb?w=600&q=80" },
  { title: "たばこの種類", desc: "日本製たばこの種類と特徴。紙巻・細巻・メンソールなど、自分に合った一本を見つけよう。", icon: "📚", img: "https://images.unsplash.com/photo-1598346764658-b5d9d56e1e28?w=600&q=80" },
  { title: "濃さガイド", desc: "たばこの濃さ（タール・ニコチン）の選び方。ライトからフルフレーバーまで、自分に合った強さを見つけよう。", icon: "💪", img: "https://images.unsplash.com/photo-1528458876861-544fd1b4e455?w=600&q=80" },
  { title: "味わいガイド", desc: "フレーバーと香りの種類。メンソール・フルーツ・定番など、多彩な味わいを楽しもう。", icon: "🌸", img: "https://images.unsplash.com/photo-1566312922674-7e4c4b5f2c6a?w=600&q=80" },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-stone-800">初心者ガイド</h1>
      <p className="mt-2 text-stone-500">イラスト付きでわかりやすく解説。</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {GUIDES.map((guide) => (
          <Card key={guide.title} className="group overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-[3/2] overflow-hidden">
              <img src={guide.img} alt={guide.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-6">
              <div className="text-2xl mb-2">{guide.icon}</div>
              <h2 className="font-heading text-lg font-semibold text-stone-800 group-hover:text-primary">{guide.title}</h2>
              <p className="mt-2 text-sm text-stone-500">{guide.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
