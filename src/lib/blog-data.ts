export interface BlogPost {
  slug: string;
  title: string;
  titleEn: string;
  titleZh: string;
  excerpt: string;
  excerptEn: string;
  excerptZh: string;
  content: string;
  contentEn: string;
  contentZh: string;
  coverImage: string;
  author: string;
  category: string;
  publishedAt: string;
}

const SEVEN_STARS_HISTORY: BlogPost = {
  slug: "seven-stars-history",
  title: "セブンスターの半世紀 ― 日本たばこを代表するブランドの歩み",
  titleEn: "The Half-Century Legacy of Seven Stars — Japan's Iconic Cigarette Brand",
  titleZh: "Seven Stars半世纪传奇 — 日本标志性香烟品牌的历程",
  excerpt:
    "1969年、世界初のチャコールフィルター搭載たばことして誕生したセブンスター。日本の喫煙文化を牽引し続けてきた伝説的ブランドの、50年以上にわたる歴史を紐解きます。",
  excerptEn:
    "Born in 1969 as the world's first charcoal-filter cigarette, Seven Stars has shaped Japanese smoking culture for over half a century. Discover the remarkable journey of this legendary brand.",
  excerptZh:
    "1969年诞生的Seven Stars是世界首款活性炭滤嘴香烟，半个多世纪以来一直引领着日本的吸烟文化。探索这个传奇品牌的非凡历程。",
  category: "brand-history",
  author: "TABACOYA編集部",
  publishedAt: "2026-06-11",
  coverImage: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=1200&q=80",
  // ---- Japanese content ----
  content: `
    <section class="mb-12">
      <p class="text-lg leading-relaxed text-stone-600 mb-6">
        日本たばこの歴史を語る上で、セブンスターの存在は欠かせない。1969年の誕生以来、この赤いパッケージは日本の喫煙者にとって「いつもそばにある」存在であり続けた。世界初のチャコールフィルターを搭載し、日本のたばこ産業に革命をもたらしたブランドの、半世紀以上にわたる歩みを辿ってみよう。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">1969年 — チャコールフィルターの革命</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        1969年2月1日、日本専売公社（現・日本たばこ産業）からセブンスターが発売された。このたばこが画期的だったのは、<strong>世界で初めてチャコールフィルターを採用した</strong>ことである。当時の喫煙者からは、味のまろやかさと吸い心地の改善が求められており、チャコールフィルターはこれに応える技術的革新だった。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        国産葉たばこを主体としたブレンドは、日本の気候風土に育まれたたばこ葉の豊かな風味を活かしていた。「七つの星」という名は、当時のたばこ業界に新たな光をもたらすという願いが込められていたと言われている。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">赤いパッケージと「セブンスターの木」</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        セブンスターのパッケージは、深い赤地に一本の木のシルエットという、極めてシンプルかつ印象的なデザインである。このデザインは1969年の発売以来、ほぼ変わっていない。パッケージに描かれた木は、北海道美瑛町の丘に立つ一本のポプラをモチーフにしているとされ、この木は現在「セブンスターの木」として観光名所になっている。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        日本人はパッケージデザインに強い愛着を抱く。セブンスターの赤い箱は、喫煙者にとって単なる容器以上の意味を持ち、一つの時代の象徴として認識されている。愛称の「セッタ」「セスタ」も、親しみの表れである。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">1975年〜1977年 — 日本一の座へ</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        発売から数年を経て、セブンスターは日本人喫煙者の心を掴み始めた。1975年、ついに日本国内売上<strong>第1位</strong>を達成。この地位は1977年まで守り続けられた。当時の日本では、たばこが日常生活の一部として深く根付いており、セブンスターは「お父さんのたばこ」「働く人のたばこ」として広く愛された。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        しかし1977年、マイルドセブン（現メビウス）が登場し、状況は一変する。よりマイルドな味わいを求める消費者のトレンドに対応したマイルドセブンは、瞬く間にセブンスターを抜き去り、新たなトップブランドとなった。セブンスターは第2位に後退するが、この競争こそがブランドをさらに磨き上げることになる。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">絶え間ない進化 — 製品ラインナップの拡大</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        セブンスターは単一製品に甘んじることなく、時代の変化に合わせて製品ラインナップを拡大し続けた。主な展開を年代順に見てみよう。
      </p>
      <ul class="list-disc pl-6 space-y-2 text-stone-600 mb-4">
        <li><strong>1986年</strong> — キングサイズ版「セブンスターEX」を発売。アメリカンブレンドの葉を使用した新しいアプローチだった。（1993年に生産終了）</li>
        <li><strong>1990年</strong> — 「セブンスター10」（元メディアム）を発売。タール10mgのマイルドな選択肢として、新たな層を獲得した。</li>
        <li><strong>1993年</strong> — レギュラーサイズからキングサイズへの移行。時代の標準规格に合わせた決断だった。</li>
        <li><strong>1995年</strong> — ハードボックス版「セブンスターBox」を発売。ソフトパック派とボックス派の両方に対応した。</li>
        <li><strong>2009年</strong> — 40周年記念製品「ブラックインパクト」を限定発売。</li>
        <li><strong>2014年</strong> — 大規模なリニューアル。製品名にタール含有量の数字を冠する「セブンスター1・4・7・10」体系を導入。消費者が直感的に強さを選べるようになった。</li>
        <li><strong>2016年</strong> — 「ロングタイム」シリーズを発売。長尺仕様で、ゆっくりと味わいたい喫煙者に好評を博した。</li>
      </ul>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">文化との交差 — キャンペーンとモータースポーツ</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        セブンスターはたばこの枠を超え、日本のポップカルチャーとも深く関わってきた。1990年代後半から2000年代にかけて、豊川悦司、杉本哲太などの俳優が広告に出演。2007年からは「静かに、高ぶる。」というキャッチコピーのもと、Boom Boom Satellitesらの音楽アーティストを起用した雑誌広告が展開された。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        特筆すべきは<strong>モータースポーツへの参画</strong>である。2003年から2006年にかけて、ホンダワークスチームのスポンサーとして「鈴鹿8時間耐久ロードレース」に参加。2004年と2005年には優勝を飾り、鈴鹿サーキットではホンダカラーのセブンスター特別パッケージが限定販売された。たばこブランドがモータースポーツの世界で輝きを放つ、日本ならではの光景だった。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">2008年〜2016年 — 栄光の復活</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        長い間マイルドセビウスの陰に隠れていたセブンスターだが、2008年第1四半期、ついに<strong>日本売上第1位</strong>の座を奪還。この快挙は2016年まで維持され、8年間にわたって日本で最も売れたたばこブランドとなった。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        復活の背景には、タール数値の明確化や製品ラインナップの再編、そして何よりブランドへの根強い信頼があった。世代を超えて愛される「変わらない味」が、時代の波を乗り越える力となったのである。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">セブンスターの現在</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        半世紀以上の時を経て、セブンスターは今日も日本のコンビニエンスストアやたばこ店の棚に並んでいる。現在の主力製品は、オリジナル（タール14mg）を筆頭に、1・4・7・10のタールバリエーション、メンソールシリーズ（5・8・12）、そしてロングタイムシリーズが揃う。価格は460円〜480円。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        日本たばこ産業が国内市場の約66%を占める中、セブンスターはメビウス、ウィンストン、キャメルと並ぶJTの主力ブランドとして、今後も日本の喫煙文化を牽引し続けるだろう。赤いパッケージに描かれた一本の木のように、このブランドは日本のたばこの風景に深く根付いている。
      </p>
    </section>
  `,
  // ---- English content ----
  contentEn: `
    <section class="mb-12">
      <p class="text-lg leading-relaxed text-stone-600 mb-6">
        No conversation about Japanese tobacco is complete without Seven Stars. Since its debut in 1969, this crimson-packaged cigarette has been a constant companion to Japanese smokers. The brand that introduced the world's first charcoal filter and revolutionized Japan's tobacco industry has a story spanning more than half a century — and it's a remarkable one.
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">1969 — The Charcoal Filter Revolution</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        On February 1, 1969, the Japan Tobacco and Salt Public Corporation (now Japan Tobacco Inc.) launched Seven Stars. What made it groundbreaking was the <strong>world's first charcoal filter</strong>, a technological leap that responded to smokers' demands for smoother taste and improved draw quality. The filter used activated carbon to reduce harshness while preserving flavor — a concept that would influence cigarette design worldwide.
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        The blend itself was distinctly Japanese, built around domestically grown tobacco leaves that captured the terroir of Japan's climate and soil. The name "Seven Stars" was said to represent a wish to bring new light to the tobacco industry — and in hindsight, that wish was fulfilled many times over.
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">The Red Pack and the "Seven Star Tree"</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        Seven Stars' packaging is an exercise in timeless design: a lone tree silhouette against a deep red background. Remarkably, this design has remained virtually unchanged since 1969. The tree depicted on the pack is believed to be inspired by a poplar standing on the rolling hills of Biei, Hokkaido. That tree has since become a celebrated tourist landmark, known to visitors as the "Seven Star Tree" (セブンスターの木).
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        In Japan, cigarette packaging carries deep emotional weight. The red box of Seven Stars transcends mere containment — it serves as a symbol of an era. The affectionate nicknames "Setta" (セッタ) and "Sesta" (セスタ) speak to the intimate bond between brand and smoker.
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">1975–1977 — Reaching the Top</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        Within a few years of its launch, Seven Stars captured the hearts — and wallets — of Japanese smokers. In 1975, it claimed the <strong>number-one sales position</strong> in Japan, a title it held through 1977. In an era when smoking was woven into daily Japanese life, Seven Stars earned a reputation as "the working man's cigarette" and "father's cigarette."
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        But 1977 brought a formidable challenger: Mild Seven (now Mevius). Designed to meet the growing preference for milder taste, Mild Seven rapidly overtook Seven Stars to become the new top-selling brand. Seven Stars fell to second place — though this rivalry would ultimately push both brands to greater heights.
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">Relentless Innovation — Expanding the Lineup</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        Rather than resting on its laurels, Seven Stars continuously evolved its product range to match shifting consumer preferences:
      </p>
      <ul class="list-disc pl-6 space-y-2 text-stone-600 mb-4">
        <li><strong>1986</strong> — King-size "Seven Stars EX" launched with an American-blend tobacco. Discontinued in 1993.</li>
        <li><strong>1990</strong> — "Seven Stars 10" (originally Medium) introduced at 10 mg tar, opening the door to milder preferences.</li>
        <li><strong>1993</strong> — Standard size converted to king size, aligning with market norms.</li>
        <li><strong>1995</strong> — Hard-box "Seven Stars Box" launched, catering to both soft-pack and box loyalists.</li>
        <li><strong>2009</strong> — 40th-anniversary "Black Impact" limited edition released.</li>
        <li><strong>2014</strong> — Major lineup rebrand: products renamed with tar-content numbers (Seven Stars 1, 4, 7, 10), letting consumers choose strength intuitively.</li>
        <li><strong>2016</strong> — "Long Time" series introduced with extended-length sticks for a slower, more leisurely smoking experience.</li>
      </ul>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">Cultural Crossover — Campaigns and Motorsport</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        Seven Stars' influence extended well beyond tobacco. In the late 1990s and early 2000s, actors such as Etsushi Toyokawa and Tetta Sugimoto appeared in its advertising campaigns. From 2007, the slogan "Exalted, Quietly" (静かに、高ぶる。) featured musical acts like Boom Boom Satellites in magazine spreads, positioning the brand as a symbol of understated masculinity.
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        Perhaps the most dramatic chapter was its <strong>motorsport sponsorship</strong>. From 2003 to 2006, Seven Stars backed the Honda factory team in the Suzuka 8 Hours endurance motorcycle race — winning in 2004 and 2005. Special Honda-colored Seven Stars packs were sold at Suzuka Circuit during race weekends, creating a unique intersection of tobacco culture and motorsport fandom.
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">2008–2016 — Return to Glory</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        After decades in Mild Seven's shadow, Seven Stars reclaimed the <strong>number-one sales position</strong> in Q1 2008 — and held it for eight consecutive years through 2016. This comeback was driven by the tar-number rebranding, a broadened product lineup, and above all, an unshakable consumer trust built over generations.
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        The "unchanging taste" that had defined Seven Stars since 1969 proved to be its greatest asset. While competitors chased trends, Seven Stars' consistency became its competitive advantage.
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">Seven Stars Today</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        Over half a century since its birth, Seven Stars remains a staple on convenience store shelves across Japan. The current lineup includes the original (14 mg tar), numbered tar variants (1, 4, 7, 10), a full menthol range (5, 8, 12 mg), and the Long Time series — priced between ¥460 and ¥480.
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        With Japan Tobacco holding roughly 66% of the domestic cigarette market, Seven Stars stands alongside Mevius, Winston, and Camel as a flagship JT brand. Like the solitary tree on its iconic red pack, Seven Stars remains deeply rooted in Japan's tobacco landscape — a living legend that continues to write its story.
      </p>
    </section>
  `,
  // ---- Chinese content ----
  contentZh: `
    <section class="mb-12">
      <p class="text-lg leading-relaxed text-stone-600 mb-6">
        谈论日本香烟，就不能不提Seven Stars。自1969年面世以来，这个红色包装的香烟一直是日本吸烟者的忠实伴侣。作为全球首款活性炭滤嘴香烟，这个彻底改变了日本烟草产业的品牌，拥有超过半个世纪的传奇故事。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">1969年 — 活性炭滤嘴革命</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        1969年2月1日，日本专卖公社（现日本烟草产业）推出了Seven Stars。它的划时代意义在于<strong>全球首次采用了活性炭滤嘴</strong>。这项技术创新利用活性炭减少刺激性，同时保留风味，回应了吸烟者对更顺滑口感和更好吸食体验的渴望。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        其配方以日本国产烟叶为主体，充分展现了日本气候和土壤培育出的烟叶的丰富风味。"七星"这个名字，据说寄托了为烟草行业带来新光芒的期望——回首来看，这个愿望被实现了无数次。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">红色包装与"七星之树"</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        Seven Stars的包装是永恒设计的典范：深红色背景上，一棵孤树的剪影。令人惊叹的是，自1969年问世以来，这个设计几乎未曾改变。包装上描绘的树据说以北海道美瑛町丘陵上的一棵白杨树为原型。这棵树如今已成为著名的旅游地标，被游客称为"七星之树"（セブンスターの木）。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        在日本，香烟包装承载着深厚的情感。Seven Stars的红色盒子超越了容器的意义，成为一个时代的象征。"Setta"（セッタ）和"Sesta"（セスタ）这些亲切的昵称，正是品牌与吸烟者之间深厚纽带的体现。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">1975–1977年 — 登顶日本</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        发售数年后，Seven Stars征服了日本吸烟者的心。1975年，它终于登上日本国内销量<strong>第一位</strong>的宝座，并将这一地位保持到1977年。在那个吸烟深度融入日常生活的时代，Seven Stars被誉为"劳动者的香烟""父亲的香烟"。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        然而1977年，一个强劲的挑战者出现了——Mild Seven（现Mevius）。迎合了消费者对更柔和口感的追求，Mild Seven迅速超越Seven Stars成为新的销量冠军。Seven Stars退居第二，但正是这场竞争，磨砺了品牌的锋芒。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">不断创新 — 产品线的扩展</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        Seven Stars从不满足于单一产品，而是根据消费者需求的变化不断扩充产品线：
      </p>
      <ul class="list-disc pl-6 space-y-2 text-stone-600 mb-4">
        <li><strong>1986年</strong> — 推出加长版"Seven Stars EX"，采用美式混合烟叶（1993年停产）。</li>
        <li><strong>1990年</strong> — 推出"Seven Stars 10"（原Medium），焦油含量10mg，满足追求柔和口感的消费者。</li>
        <li><strong>1993年</strong> — 标准尺寸升级为加长规格，顺应市场趋势。</li>
        <li><strong>1995年</strong> — 推出硬盒版"Seven Stars Box"，兼顾软包和硬盒爱好者的需求。</li>
        <li><strong>2009年</strong> — 40周年纪念版"Black Impact"限量发售。</li>
        <li><strong>2014年</strong> — 重大产品线重组，以焦油含量数字命名（Seven Stars 1、4、7、10），让消费者直观选择浓度。</li>
        <li><strong>2016年</strong> — 推出"Long Time"系列，加长规格，满足追求慢享体验的消费者。</li>
      </ul>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">文化跨界 — 广告与赛车运动</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        Seven Stars的影响力远超烟草领域。1990年代末至2000年代，丰川悦司、杉本哲太等知名演员曾为其代言。2007年起，以"静かに、高ぶる。"（沉静而高昂）为口号，邀请Boom Boom Satellites等音乐人出演杂志广告，将品牌塑造为内敛阳刚之气的象征。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        最令人瞩目的莫过于<strong>赛车运动赞助</strong>。2003年至2006年间，Seven Stars作为本田厂队赞助商参加"铃鹿8小时耐力赛"，并于2004年和2005年夺得冠军。铃鹿赛道期间还推出了本田配色的特别版Seven Stars包装，创造了烟草文化与赛车文化交汇的独特风景。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">2008–2016年 — 荣耀回归</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        在Mild Seven的阴影下沉寂多年后，Seven Stars于2008年第一季度重新夺回<strong>日本销量第一</strong>的宝座——并将这一荣耀保持了整整八年，直至2016年。回归的背后，是焦油数值的清晰化、产品线的全面重组，以及最重要的——跨越世代的品牌信任。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        自1969年以来定义Seven Stars的"不变的味道"，成为了它最大的竞争优势。当竞品追逐潮流时，Seven Stars的始终如一赢得了市场的尊重。
      </p>
    </section>

    <section class="mb-12">
      <h2 class="font-heading text-2xl font-bold text-stone-800 mb-4">Seven Stars的今天</h2>
      <p class="leading-relaxed text-stone-600 mb-4">
        半个多世纪过去了，Seven Stars依然稳稳地摆放在日本各地便利店和烟草店的货架上。目前的产品阵容以经典原味（焦油14mg）为核心，辅以1、4、7、10的焦油系列，薄荷系列（5、8、12mg），以及Long Time系列。售价460至480日元。
      </p>
      <p class="leading-relaxed text-stone-600 mb-4">
        在日本烟草产业占据国内约66%市场份额的背景下，Seven Stars与Mevius、Winston、Camel并列为JT的核心品牌。正如红色包装上那棵孤寂而坚韧的树一样，Seven Stars深深扎根于日本的烟草风景中——一个仍在续写传奇的活着的经典。
      </p>
    </section>
  `,
};

// ---- All posts ----
const ALL_POSTS: BlogPost[] = [SEVEN_STARS_HISTORY];

export function getAllPosts(): BlogPost[] {
  return ALL_POSTS;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((p) => p.slug === slug);
}

export function getLocalizedPost(
  post: BlogPost,
  locale: string
): {
  title: string;
  excerpt: string;
  content: string;
} {
  return {
    title:
      locale === "en"
        ? post.titleEn
        : locale === "zh"
          ? post.titleZh
          : post.title,
    excerpt:
      locale === "en"
        ? post.excerptEn
        : locale === "zh"
          ? post.excerptZh
          : post.excerpt,
    content:
      locale === "en"
        ? post.contentEn
        : locale === "zh"
          ? post.contentZh
          : post.content,
  };
}
