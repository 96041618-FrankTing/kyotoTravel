/**
 * 旅行基本資訊
 * 包含：航班、住宿、費用、護照、待辦事項
 */

export const travelInfo = {
  flights: [
    {
      date: '2026/01/16 (五)',
      airline: '星宇航空 JX822 [A359]',
      departure: '09:20 桃園機場 T1',
      arrival: '12:50 關西機場 T1',
      duration: '2小時30分鐘'
    },
    {
      date: '2026/01/22 (四)',
      airline: '中華航空 CI153 [A321NEO]',
      departure: '14:30 關西機場 T1',
      arrival: '16:45 桃園機場 T2',
      duration: '3小時15分鐘'
    }
  ],
  hotels: [
    {
      name: 'Onyado Nono Kyoto Shichijo Natural Hot Spring',
      dates: '01/16~01/18 (住兩晚)',
      address: '京都市下京区材木町491番地',
      email: 'inn-nonokyoto@dormy-hotels.com',
      link: 'https://www.booking.com/hotel/jp/onyado-nono-kyoto-shichijo.zh-tw.html'
    },
    {
      name: 'KOKO HOTEL Osaka Namba Sennichimae',
      dates: '01/18~01/20 (住兩晚)',
      address: '大阪府, 大阪, Chuo-ku, Sennichimae 1-3-7',
      email: 'info-osaka_sennichimae@koko-hotels.com',
      link: 'https://www.booking.com/hotel/jp/koko-osaka-namba-sennichimae.zh-tw.html'
    },
    {
      name: 'THE SINGULARI HOTEL & SKYSPA at UNIVERSAL STUDIOS JAPAN',
      dates: '01/20~01/22 (住兩晚)',
      address: '大阪府, 大阪, Konohana-ku Shimaya 6-2-25',
      contactForm: 'https://www.candeohotels.com/en/contact/',
      link: 'https://www.booking.com/hotel/jp/singulari-hotel-skyspa-at-universal-studios-japan.zh-tw.html'
    }
  ],
  costs: [
    { item: '來回機票 x4人 (ezTravel訂購)', amount: 'NT$63,317' },
    { item: '住宿 Onyado Nono Kyoto Shichijo Natural Hot Spring 兩晚', amount: 'NT$17,529' },
    { item: '住宿 KOKO HOTEL Osaka Namba Sennichimae 兩晚', amount: 'NT$12,530' },
    { item: '住宿 THE SINGULARI HOTEL & SKYSPA at UNIVERSAL STUDIOS JAPAN 兩晚', amount: 'NT$14,565' },
    { item: 'Day3 KKDAY日本天橋立一日遊 x4', amount: 'NT$7,324' },
    { item: 'Day5 KKDAY京都&奈良一日遊(金閣寺、嵐山、奈良公園、伏見稻荷大社) x4', amount: 'NT$6,240' }
  ],
  kkdayTours: [
    {
      day: 'Day3',
      name: '【大阪/京都出發】海之京都一日遊｜伊根灣遊船・伊根舟屋・天橋立',
      departureOption: '[京都出發] 08:00集合/京都車站八条口祭時計広場',
      arrivalOption: '[大阪下車] 18:00抵達/大阪日本橋蟹道樂東店',
      link: 'https://www.kkday.com/zh-tw/product/154074-kyoto-by-the-sea-day-tour-amanohashidate-ine-funaya?pkg_oid=1844037&go_date=2026-01-18&869a86fad997ad236f2b482468357f08=4',
      cost: 'NT$7,324'
    },
    {
      day: 'Day5',
      name: '【京都&奈良一日遊】金閣寺、嵐山(午餐自理)、伏見稻荷大社、奈良公園',
      departureOption: '[大阪出發] 07:50集合/VIP Villa難波',
      arrivalOption: '[大阪下車] 19:10抵達/VIP Villa難波',
      link: 'https://www.kkday.com/zh-tw/product/13894-kyoto-nara-ushimi-inari-taisha-shrine-arashiyama-nara-park?pkg_oid=716952&go_date=2026-01-20&f60a743db366b76fb072d421e3df607a=3&6deba73d66b0ba8521243f2d5eada132=1',
      cost: 'NT$6,240'
    }
  ],
  foodList: {
    osakaNamba: [
      { name: '蟹道樂(道頓堀東店)', note: '蟹肉包' },
      { name: '道樂 Wanaka (わなかたこ焼き)', note: '必吃，傳統大阪章魚燒' },
      { name: '10円パン', note: '10元麵包' },
      { name: '元祿壽司', note: '日本迴轉壽司創始店，價格親民，類似台灣的爭鮮' },
      { name: '大起水產迴轉壽司', note: '平價迴轉壽司，高CP值與多樣性' },
      { name: '神座拉麵(Kamukura)千日前店', note: '蔬菜湯頭，口味清甜' },
      { name: '千房大阪燒 (Chibo)', note: '大阪燒名店' },
      { name: '元祖大阪章魚燒', note: '' }
    ],
    kyotoStation: [
      { name: '鳥貴族(京都七條店)', note: '雞肉串燒' }
    ],
    arashiyama: [
      { name: '三忠 豆腐茶屋', note: '' },
      { name: '京豆庵冰淇淋(大豆)', note: '' },
      { name: '嵐山可樂餅(中村屋)', note: '' },
      { name: '京風特大煎餅', note: '' }
    ],
    amanohashidate: [
      { name: 'よし乃や', note: '花蛤丼、海鮮丼 (1F是土產伴手禮區,2F就是餐廳，靠近傘松公園這一側)' },
      { name: 'つるや食堂', note: '海鮮丼、麵, 甜點 (出餐較慢)' },
      { name: 'はしだて茶屋(橋立茶屋)', note: '花蛤丼、烤黑輪 (天橋立公園街近中間處，也就是天橋立松樹林內)' }
    ],
    kyotoGion: [
      { name: 'らぁ〜めん京 (Ramen Miyako Gion Main Shop)', note: '八阪神社旁的拉麵店' },
      { name: '祇園鰻川藤(Gion Unagi Kawato)', note: '鰻魚飯，環境優美需先訂位' }
    ],
    kyotoKiyomizu: [
      { name: '藤菜美', note: '冰抹茶，傳統風味的醬油丸子專賣店' }
    ]
  },
  passports: [
    { name: 'TING/CHINYUAN' },
    { name: 'LIU/CHIAHSIANG' },
    { name: 'QIU/CAIMIAN' },
    { name: 'TING/PEIEN' }
  ],
  todoList: [
    '購買上網SIM/eSIM卡(eSIMGo)',
    '購買雪地防滑鞋套',
    '預定KKDay一日遊行程',
    '預定日本和服時間',
    '預定機上餐點與座位(需付費？)',
    '投保旅遊不便險(富邦)',
    '填寫日本入境單VJW(Visit Japan Web)',
    '線上購買環球影城門票 + (快通4?)',
    '線上購買JR HARUKA WEST QR火車票和選位(電子票)',
    '列印文件/QRCODE: 環球影城門票、大阪觀光船email、',
    '行動電源'
  ],
  budget: {
    exchangeRate: 0.225,
    people: 4,
    days: 7,
    prepaidInTaiwan: {
      items: [
        { name: '來回機票', amount: 63317, note: '已確認 (星宇/華航)', status: 'completed' },
        { name: '住宿費 (6晚)', amount: 46822, note: '已確認 (3間飯店，含早餐)', status: 'completed' },
        { name: 'KKday 行程', amount: 13564, note: 'Day3 天橋立 + Day5 嵐山奈良', status: 'pending' },
        { name: 'USJ 門票', amount: 7800, note: '1-Day Pass (3大1小)', status: 'pending' },
        { name: 'USJ 快速通關', amount: 18000, note: '(浮動) 預估快通4 @$4500/人', status: 'pending' },
        { name: 'HARUKA 車票', amount: 3200, note: '機場→京都 (單程)', status: 'pending' },
        { name: '網卡/保險', amount: 3000, note: 'eSIM x3 + 漫遊 + 旅平險', status: 'pending' }
      ],
      subtotal: 155703,
      perPerson: 38925
    },
    localExpenses: {
      dining: {
        total: 210000,
        totalNTD: 47250,
        perPersonPerDay: 7500,
        breakdown: {
          breakfast: 0,
          lunch: 2500,
          dinner: 5000
        },
        note: '早餐飯店包含'
      },
      transportation: {
        total: 50000,
        totalNTD: 11250,
        items: [
          { name: '京都移動', note: 'Day1 & Day2 計程車' },
          { name: '大阪移動', note: 'Day3 & Day5 搬家計程車 (長途)' },
          { name: '機場交通', note: 'Day7 利木津巴士 (約 ¥6,300)' },
          { name: 'ICOCA儲值', note: '每人預抓 ¥3,000 (地鐵/備用)' }
        ]
      },
      tickets: {
        total: 48000,
        totalNTD: 10800,
        items: [
          { name: '和服體驗 (4人)', amount: 24000 },
          { name: '人力車 (2台)', amount: 10000 },
          { name: '小景點門票', amount: 12000, note: '清水寺/大阪城等' },
          { name: '餵食體驗', amount: 2000, note: '鹿仙貝/蝦味先' }
        ]
      },
      subtotal: 69300
    },
    cashStrategy: {
      recommended: 120000,
      recommendedNTD: 27000,
      usage: 'ICOCA 儲值、計程車、路邊攤(錦市場/黑門市場)、人力車、自動販賣機',
      distribution: '3 位大人身上各帶 ¥40,000 現金即可'
    },
    cardStrategy: {
      recommended: 188000,
      recommendedNTD: 42300,
      usage: '午晚餐大餐 (燒肉/東洋亭)、和服店、百貨公司購物、USJ 園區內消費'
    },
    summary: {
      prepaidNTD: 155703,
      localNTD: 69300,
      totalNTD: 225003,
      perPersonNTD: 56250,
      recommendedPerPerson: 60000
    }
  }
}
