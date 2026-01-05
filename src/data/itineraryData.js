export const itineraryData = {
  day1: [
    {
      time: '08:00-15:00',
      title: '機場移動至京都',
      description: '台灣 → 關西機場 → 京都車站 (領票/買卡) → 走地下通道至飯店 Check-in',
      transport: 'JR HARUKA 特急電車',
      location: '關西機場 → 京都車站 → Onyado Nono Kyoto Shichijo',
      duration: '約7小時',
      coordinates: [34.4320, 135.2304],
      subway: '關西機場站 → 京都車站 (JR HARUKA特急)',
      details: {
        japaneseInfo: '京都駅の中央口から地下通路を通って「御宿 野乃 京都七条」までお願いします。\n(住所: 京都市下京区材木町491番地)',
        notes: '入境領票、Check-in。全程走地下通道可避寒避雨，推行李也方便。飯店距離出口很近。',
        kkdayLink: null
      }
    },
    {
      time: '15:30-17:30',
      title: '京都車站周邊探險 & 採購',
      description: 'Yodobashi Camera 京都店 (友都八喜)',
      transport: '走路',
      location: '京都車站',
      duration: '約2小時',
      coordinates: [34.9854, 135.7581],
      details: {
        japaneseInfo: null,
        notes: '全體活動：飯店對面即是。3F 玩具區：模型、轉蛋、電玩，小孩天堂。4F/5F 服飾區：大型 Uniqlo 與 GU，若禦寒衣物帶不夠可直接在此補貨。B1 超市區 (LOPIA)：必逛！這是日本著名的平價大型超市。建議在這裡買齊這幾天要吃的日本草莓、橘子、大瓶飲料、零食回飯店冰箱放，價格比超商便宜非常多。',
        kkdayLink: null
      }
    },
    {
      time: '18:00-20:00',
      title: '晚餐',
      description: '東洋亭 (Porta 地下街店) 或 鳥貴族 (京都七條店)',
      location: '京都車站 Porta 地下街 或 京都七條',
      duration: '約2小時',
      coordinates: [34.9854, 135.7581],
      mustEat: '百年洋食漢堡排、整顆番茄沙拉',
      restaurants: {
        dinner: [
          { name: '東洋亭 Porta店', location: '京都車站 Porta地下街', note: '百年洋食漢堡排 (鋁箔包著，打開熱氣騰騰)、整顆番茄沙拉' },
          { name: '鳥貴族 京都七條店', location: '京都七條', note: '全品項均一價的平價串燒居酒屋，離飯店走路僅 3 分鐘，氣氛輕鬆，適合作為第一晚的放鬆餐或宵夜' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '推薦餐廳 1：東洋亭 (Porta 地下街店) - 必吃：百年洋食漢堡排、整顆番茄沙拉。推薦餐廳 2：鳥貴族 (京都七條店) - 特色：全品項均一價的平價串燒居酒屋。',
        kkdayLink: null
      }
    }
  ],
  day2: [
    {
      time: '08:00-09:00',
      title: '飯店早餐',
      description: '享用飯店著名的自助早餐',
      transport: '飯店內',
      location: 'Onyado Nono Kyoto Shichijo',
      duration: '約1小時',
      coordinates: [34.9877, 135.7551],
      details: {
        japaneseInfo: null,
        notes: '飯店餐廳',
        kkdayLink: null
      }
    },
    {
      time: '09:00-11:30',
      title: '和服體驗(璃光八坂店) & 八坂神社周邊',
      description: '八坂神社(和服體驗)',
      transport: '計程車 x1',
      location: '八坂神社',
      duration: '約2.5小時',
      coordinates: [35.0036, 135.7810],
      mustVisit: '八坂神社、圓山公園',
      details: {
        japaneseInfo: '八坂神社（やさかじんじゃ）の近くまでお願いします。\n(祇園の交差点付近です)',
        notes: '活動：1. 和服換裝：預約 9:00 開門的店家 (建議找八坂神社/祇園附近的店，如岡本祇園店、璃光和服，梨花和服等)。2. 拍照與散步：換好裝後，先在八坂神社朱紅色樓門、圓山公園拍照。',
        kkdayLink: null
      }
    },
    {
      time: '11:30-12:00',
      title: '歸還和服',
      description: '歸還和服',
      transport: '走路',
      location: '八坂神社附近',
      duration: '約30分鐘',
      coordinates: [35.0036, 135.7810],
      details: {
        japaneseInfo: null,
        notes: '歸還和服裝',
        kkdayLink: null
      }
    },
    {
      time: '11:30-13:00',
      title: '午餐：在祇園/八坂神社周邊用餐',
      description: '在祇園/八坂神社周邊用餐',
      transport: '走路',
      location: '祇園/八坂神社',
      duration: '約1.5小時',
      coordinates: [35.0036, 135.7810],
      lunchOptions: 'らぁ〜めん京 (Ramen Miyako Gion Main Shop)',
      restaurants: {
        lunch: [
          { name: 'らぁ〜めん京 (Ramen Miyako Gion Main Shop)', location: '八阪神社旁', note: '拉麵店' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '地點：在祇園/八坂神社周邊用餐。推薦：らぁ〜めん京 (Ramen Miyako Gion Main Shop) 八阪神社旁的拉麵店',
        kkdayLink: null
      }
    },
    {
      time: '13:00-13:30',
      title: '移動至清水寺 (避開上坡)',
      description: '搭車到清水寺上方',
      transport: '計程車 x1',
      location: '清水寺',
      duration: '約30分鐘',
      coordinates: [34.9949, 135.7850],
      details: {
        japaneseInfo: '清水寺の茶わん坂（ちゃわんざか）、仁王門の近くまでお願いします。\n(坂道を上がりきったところです)',
        notes: '關鍵策略：穿著和服不適合走長上坡，吃飽後直接搭車到清水寺上方。指定下車點：茶碗坂 (Chawanzaka) 靠近仁王門處。這樣下車走幾步路就是清水寺門口了。',
        kkdayLink: null
      }
    },
    {
      time: '13:30-15:00',
      title: '清水寺參拜',
      description: '參拜清水舞台、地主神社、音羽之瀧',
      transport: '走路',
      location: '清水寺',
      duration: '約1.5小時',
      coordinates: [34.9949, 135.7850],
      mustVisit: '清水舞台、地主神社、音羽之瀧',
      details: {
        japaneseInfo: null,
        notes: '活動：參拜清水舞台、地主神社、音羽之瀧。穿和服在這裡拍照是經典中的經典。',
        kkdayLink: null
      }
    },
    {
      time: '15:00-16:30',
      title: '二三年坂散策 (回程下坡)',
      description: '從清水寺走下來 → 三年坂 → 二年坂',
      transport: '走路',
      location: '二三年坂',
      duration: '約1.5小時',
      coordinates: [35.0064, 135.7850],
      mustVisit: '三年坂、二年坂',
      details: {
        japaneseInfo: null,
        notes: '路線：從清水寺走下來 → 三年坂 → 二年坂。這段路是下坡，穿和服走起來比較輕鬆。必逛/必吃：藤菜美 (糰子)、橡子共和國 (龍貓)、Starbucks 二寧坂茶屋店 (榻榻米星巴克)。',
        kkdayLink: null
      }
    },
    {
      time: '16:30-17:30',
      title: '祇園＆四條河原町散策',
      description: '一路逛回八坂神社附近',
      transport: '走路',
      location: '祇園、四條河原町',
      duration: '約1小時',
      coordinates: [35.0036, 135.7810],
      details: {
        japaneseInfo: null,
        notes: '一路逛回八坂神社附近。',
        kkdayLink: null
      }
    },
    {
      time: '18:00',
      title: '晚餐',
      description: '祇園鰻川藤 (Gion Unagi Kawato) - 鰻魚飯，需先預約',
      location: '祇園',
      duration: '約1小時',
      coordinates: [35.0044, 135.7740],
      dinnerOptions: '祇園鰻川藤 (Gion Unagi Kawato)',
      restaurants: {
        dinner: [
          { name: '祇園鰻川藤 (Gion Unagi Kawato)', location: '祇園', note: '鰻魚飯，環境優美需先訂位' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '推薦餐廳：祇園鰻川藤 (Gion Unagi Kawato) - 鰻魚飯，環境優美需先預約',
        kkdayLink: null
      }
    }
  ],
  day3: [
    {
      time: '06:30-07:30',
      title: '飯店早餐/退房',
      description: '吃飽一點，車程較長',
      transport: '飯店內',
      location: 'Onyado Nono Kyoto Shichijo',
      duration: '約1小時',
      coordinates: [34.9877, 135.7551],
      details: {
        japaneseInfo: null,
        notes: '飯店餐廳，早餐後辦理退房',
        kkdayLink: null
      }
    },
    {
      time: '07:30-08:00',
      title: '飯店出發前往集合點',
      description: '飯店出發前往京都車站八條口祭時計広場',
      transport: '計程車 x2',
      location: '京都車站八條口祭時計広場',
      duration: '約30分鐘',
      coordinates: [34.9854, 135.7581],
      subway: '京都車站',
      details: {
        japaneseInfo: '京都駅八条口の「祭時計広場（まつりどけいひろば）」までお願いします。',
        notes: '有3個大行李，務必叫2台車。詳細地點請依憑證',
        kkdayLink: 'https://www.kkday.com/zh-tw/product/154074'
      }
    },
    {
      time: '08:00-18:00',
      title: 'KKday 天橋立・伊根舟屋一日遊 (京都出發/大阪下車)',
      description: '伊根舟屋餵海鷗 (船上)、天橋立飛龍觀 (纜車/吊椅)',
      transport: 'KKday 巴士一日遊',
      location: '天橋立、伊根舟屋',
      duration: '約10小時',
      coordinates: [35.5667, 135.1833],
      mustEat: '花蛤丼 (あさり丼)',
      lunchOptions: 'はまや食堂 (花蛤丼、烏龍麵)、橋立大丸本店 (海鮮丼、團體定食)、Cafe du Pin (麵包簡餐)',
      mustVisit: '伊根舟屋餵海鷗 (自備蝦味先)、天橋立纜車',
      restaurants: {
        lunch: [
          { name: 'はまや食堂 Hamaya', location: '天橋立智恩寺', note: '智恩寺對面，出餐快' },
          { name: '橋立大丸', location: '天橋立', note: '空間大' },
          { name: 'Cafe du Pin', location: '天橋立運河旁', note: '麵包和簡餐' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '伊根舟屋餵海鷗 (船上)、天橋立飛龍觀 (纜車/吊椅)。午餐推薦(天橋立/文殊地區自理)：特色必吃花蛤丼。推薦店家：はまや食堂(Hamaya)(智恩寺對面，出餐快)、橋立大丸(空間大)',
        kkdayLink: 'https://www.kkday.com/zh-tw/product/154074'
      }
    },
    {
      time: '18:00-19:30',
      title: '抵達大阪・走路去飯店',
      description: '大阪近鐵日本橋車站 2 號出口下車 → 推行李步行至 KOKO HOTEL',
      transport: '走路',
      location: 'KOKO HOTEL Osaka Namba Sennichimae',
      duration: '約4-5分鐘 (350公尺)',
      coordinates: [34.6658, 135.5043],
      subway: '日本橋站 2號出口',
      details: {
        japaneseInfo: null,
        notes: '下車點：大阪近鐵日本橋車站 2 號出口。步行距離僅約 350 公尺 (4-5 分鐘)，下車後轉個彎就到飯店，非常輕鬆，不用叫計程車',
        kkdayLink: null
      }
    },
    {
      time: '19:30',
      title: '晚餐 - 千日前/日本橋周邊',
      description: '飯店附近美食',
      location: '千日前',
      duration: '約1小時',
      coordinates: [34.6686, 135.5011],
      dinnerOptions: '大起水產迴轉壽司、元祿壽司、神座拉麵千日前店 (蔬菜湯頭)、千房大阪燒、元祖大阪章魚燒、播重 (壽喜燒)、章魚燒 道樂 Wanaka',
      restaurants: {
        dinner: [
          { name: '大起水產迴轉壽司', location: '大阪千日前', note: '迴轉壽司' },
          { name: '元祿壽司', location: '大阪千日前', note: '壽司' },
          { name: '神座拉麵 Kamukura 千日前店', location: '大阪千日前', note: '蔬菜湯頭拉麵，口味清甜' },
          { name: '千房大阪燒 Chibo', location: '大阪千日前', note: '大阪燒名店' },
          { name: '元祖大阪章魚燒', location: '大阪千日前', note: '章魚燒' },
          { name: '播重 Hariju', location: '大阪千日前', note: '壽喜燒老店' },
          { name: '章魚燒 道樂 Wanaka (わなか)', location: '大阪千日前', note: '必吃章魚燒' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '千房大阪燒、神座拉麵(蔬菜湯頭清甜)、わなか章魚燒千日前總店',
        kkdayLink: null
      }
    }
  ],
  day4: [
    {
      time: '07:30-08:30',
      title: '飯店早餐',
      description: '享受飯店自助早餐',
      transport: '飯店內',
      location: 'KOKO HOTEL Osaka Namba',
      duration: '約1小時',
      coordinates: [34.6658, 135.5043],
      details: {
        japaneseInfo: null,
        notes: '飯店餐廳',
        kkdayLink: null
      }
    },
    {
      time: '08:30',
      title: '飯店出發',
      description: '飯店出發，步行約10分鐘',
      transport: '步行',
      location: 'KOKO HOTEL Osaka Namba',
      duration: '約10分鐘',
      coordinates: [34.6658, 135.5043],
      details: {
        japaneseInfo: null,
        notes: '步行前往難波八阪神社',
        kkdayLink: null
      }
    },
    {
      time: '08:40-09:30',
      title: '難波八阪神社',
      description: '巨大獅子頭舞台 (吸厄運)',
      transport: '步行',
      location: '難波八阪神社',
      duration: '約50分鐘',
      coordinates: [34.6628, 135.5011],
      mustVisit: '巨大獅子頭舞台',
      details: {
        japaneseInfo: null,
        notes: '拍照巨大獅子頭舞台',
        kkdayLink: null
      }
    },
    {
      time: '09:30-11:00',
      title: '大阪城公園',
      description: '搭乘路面小火車進入園區，體驗大阪城御座船遊覽護城河',
      transport: '地鐵',
      location: '大阪城公園',
      duration: '約1小時30分鐘',
      coordinates: [34.6873, 135.5262],
      subway: '難波站 (御堂筋線) → 本町 (轉中央線) → 森之宮站 (3-B出口有電梯)',
      mustVisit: '路面小火車、大阪城御座船',
      details: {
        japaneseInfo: null,
        notes: '交通：難波站 (御堂筋線) → 本町 (轉中央線) → 森之宮站 (3-B出口有電梯)。活動：搭乘路面小火車進入園區，體驗大阪城御座船遊覽護城河。',
        kkdayLink: null
      }
    },
    {
      time: '11:30-13:00',
      title: '新世界散策 & 串炸午餐',
      description: '與通天閣合影拍照，並享用串炸達摩或橫綱串炸',
      transport: '地鐵',
      location: '新世界、通天閣',
      duration: '約1小時30分鐘',
      coordinates: [34.6525, 135.5063],
      subway: '森之宮站 (中央線) → 堺筋本町 (轉堺筋線) → 動物園前站',
      mustEat: '串炸 (Kushikatsu)',
      lunchOptions: '串炸達摩或橫綱串炸',
      restaurants: {
        lunch: [
          { name: '串炸達摩 Kushikatsu Daruma', location: '大阪新世界', note: '大阪名物串炸' },
          { name: '橫綱串炸', location: '大阪新世界', note: '知名串炸店' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '交通：森之宮站 (中央線) → 堺筋本町 (轉堺筋線) → 動物園前站。活動：與通天閣合影拍照，並享用串炸達摩或橫綱串炸。',
        kkdayLink: null
      }
    },
    {
      time: '13:30-16:15',
      title: 'NAMBA PARKS 或 心齋橋 PARCO (二選一)',
      description: 'NAMBA PARKS：適合想看綠地花園、追求安靜休憩環境、且離難波飯店近。心齋橋 PARCO：適合 10 歲小孩想逛寶可夢中心、任天堂商店 (但人潮較擠)',
      transport: '地鐵',
      location: 'NAMBA PARKS 或 心齋橋 PARCO 百貨',
      duration: '約2小時45分鐘',
      coordinates: [34.6739, 135.5011],
      subway: '動物園前站 (御堂筋線) → 天王寺站 (御堂筋線) → 心齋橋站',
      mustVisit: 'NAMBA PARKS：綠地花園 | PARCO：6F 玩具/寶可夢區/橡子共和國',
      details: {
        japaneseInfo: null,
        notes: '* NAMBA PARKS：適合想看綠地花園、追求安靜休憩環境、且離難波飯店近。* 心齋橋 PARCO：適合 10 歲小孩想逛寶可夢中心、任天堂商店 (但人潮較擠)。',
        kkdayLink: null
      }
    },
    {
      time: '16:15-17:00',
      title: '唐吉訶德惠比壽摩天輪',
      description: '搭乘摩天輪俯瞰道頓堀河景',
      transport: '步行',
      location: '道頓堀',
      duration: '約45分鐘',
      coordinates: [34.6686, 135.5011],
      mustVisit: '唐吉訶德惠比壽摩天輪',
      details: {
        japaneseInfo: null,
        notes: '搭乘摩天輪從河岸高處俯瞰道頓堀夜景。',
        kkdayLink: null
      }
    },
    {
      time: '17:20-18:45',
      title: '晚餐時間',
      description: '享用晚餐',
      transport: '步行',
      location: '道頓堀',
      duration: '約1小時25分鐘',
      coordinates: [34.6686, 135.5011],
      dinnerOptions: '大起水產迴轉壽司或千房大阪燒',
      restaurants: {
        dinner: [
          { name: '大起水產迴轉壽司', location: '大阪道頓堀', note: '平價迴轉壽司，高CP值與多樣性' },
          { name: '千房大阪燒 Chibo', location: '大阪道頓堀', note: '大阪燒名店' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '推薦餐廳：大起水產迴轉壽司 或 千房大阪燒。需在 18:45 前用餐完畢，步行至碼頭報到。',
        kkdayLink: null
      }
    },
    {
      time: '19:00-19:30',
      title: '道頓堀水上觀光船 (Wonder Cruise)',
      description: '體驗夜晚最華麗的格力高跑跑人燈海',
      transport: '步行',
      location: '道頓堀',
      duration: '約30分鐘',
      coordinates: [34.6686, 135.5011],
      mustVisit: 'Wonder Cruise',
      details: {
        japaneseInfo: null,
        notes: '已預約 19:00 班次，準時搭船，體驗夜晚最華麗的格力高跑跑人燈海。',
        kkdayLink: null
      }
    }
  ],
  day5: [
    {
      time: '06:30-06:40',
      title: '退房與寄放行李',
      description: '辦理退房，將3個大行李寄放在 KOKO HOTEL 櫃檯',
      transport: '飯店內',
      location: 'KOKO HOTEL Osaka Namba',
      duration: '約10分鐘',
      coordinates: [34.6658, 135.5043],
      details: {
        japaneseInfo: null,
        notes: '退房，行李寄放 KOKO HOTEL 櫃檯',
        kkdayLink: null
      }
    },
    {
      time: '06:40-07:30',
      title: '飯店早餐',
      description: '享用飯店早餐',
      transport: '飯店內',
      location: 'KOKO HOTEL Osaka Namba',
      duration: '約50分鐘',
      coordinates: [34.6658, 135.5043],
      details: {
        japaneseInfo: null,
        notes: '飯店餐廳',
        kkdayLink: null
      }
    },
    {
      time: '07:30-07:50',
      title: '前往集合地點',
      description: '走路前往 VIP Villa難波集合',
      transport: '走路',
      location: 'VIP Villa難波',
      duration: '約20分鐘',
      coordinates: [34.6658, 135.5043],
      details: {
        japaneseInfo: null,
        notes: '走路約 7-10 分鐘 (約 650 公尺) 到 VIP Villa 難波 (KKday 集合點)。往難波車站方向走，請依憑證地圖為準',
        kkdayLink: null
      }
    },
    {
      time: '07:50-19:10',
      title: 'KKday 金閣寺・嵐山・伏見稻荷・奈良一日遊',
      description: '金閣寺 → 嵐山竹林 → 伏見稻荷千本鳥居 → 奈良公園餵鹿',
      transport: '觀光遊覽車',
      location: '金閣寺 → 嵐山 → 伏見稻荷 → 奈良',
      duration: '約11小時20分',
      coordinates: [35.0142, 135.7483],
      mustEat: '嵐山：中村屋可樂餅、三忠豆腐茶屋、京豆庵冰淇淋(大豆)、京風特大煎餅 | 奈良：中谷堂麻糬、大佛布丁',
      mustVisit: '金閣寺、嵐山竹林、伏見稻荷千本鳥居、奈良公園餵鹿',
      details: {
        japaneseInfo: null,
        notes: '[大阪出發] 07:50集合/VIP Villa難波 → 金閣寺 → 嵐山竹林(午餐自理) → 伏見稻荷千本鳥居 → 奈良餵鹿 → [大阪下車] 19:10抵達/VIP Villa難波。重點：嵐山竹林、奈良公園餵鹿、伏見稻荷千本鳥居。必吃：嵐山可樂餅 (中村屋)、奈良中谷堂麻糬',
        kkdayLink: 'https://www.kkday.com/zh-tw/product/13894'
      }
    },
    {
      time: '19:10-20:00',
      title: '晚餐 (難波下車處附近)',
      description: '回飯店沿路的快速晚餐',
      location: '難波站/VIP Villa附近',
      duration: '約50分鐘',
      coordinates: [34.6658, 135.5043],
      dinnerOptions: '551 蓬萊 (NAMBA WALK 店/本店)、神座拉麵 (千日前店)、丸龜製麵 (千日前店)、松屋/吉野家',
      restaurants: {
        dinner: [
          { name: '551 蓬萊 (NAMBA WALK 店/本店)', location: '大阪難波', note: '有現做的海鮮炒麵、炒飯或熱騰騰的包子，出餐極快' },
          { name: '神座拉麵 (千日前店)', location: '大阪難波', note: '就在商店街入口，位置多、出餐快，蔬菜多且湯頭清爽適合長輩' },
          { name: '丸龜製麵 (千日前店)', location: '大阪難波', note: '自助式烏龍麵，不用 10 分鐘就能吃上一碗熱麵，非常暖胃' },
          { name: '松屋/吉野家', location: '大阪難波', note: '若真的想在 15 分鐘內解決，這是最穩定的選擇' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '用餐地點：回飯店沿路的快速晚餐。推薦餐廳：551 蓬萊 (NAMBA WALK 店/本店)、神座拉麵 (千日前店)、丸龜製麵 (千日前店)、松屋/吉野家。',
        kkdayLink: null
      }
    },
    {
      time: '20:00-21:00',
      title: '取行李並移動至 USJ 飯店',
      description: '走路回 KOKO HOTEL 取件行李，然後移動至環球影城飯店',
      transport: '走路 + 電車',
      location: 'The Singulari Hotel & Skyspa',
      duration: '約1小時',
      coordinates: [34.6654, 135.4323],
      subway: '近鐵日本橋站 → 阪神難波線至西九條 → JR夢咲線至Universal City',
      details: {
        japaneseInfo: null,
        notes: '1. 走路回 KOKO HOTEL 取件行李。2. 電車 (轉乘1次)：走至近鐵日本橋站 → 搭阪神難波線至西九條 → 轉JR夢咲線至Universal City。飯店在車站旁。',
        kkdayLink: null
      }
    }
  ],
  day6: [
    {
      time: '07:30-08:30',
      title: '飯店早餐',
      description: '建議吃飽一點，園區食物較貴且排隊久',
      transport: '飯店內',
      location: 'The Singulari Hotel',
      duration: '約1小時',
      coordinates: [34.6654, 135.4323],
      details: {
        japaneseInfo: null,
        notes: '飯店餐廳',
        kkdayLink: null
      }
    },
    {
      time: '08:30-20:00',
      title: '大阪環球影城 (USJ) 全日遊',
      description: '用APP掃描門票QRCode加入後(四個人)，進去先用APP抽整理劵。園區不可帶食物進去',
      transport: '走路',
      location: '環球影城',
      duration: '約11.5小時',
      coordinates: [34.6654, 135.4323],
      subway: 'ユニバーサルシティ駅',
      mustEat: 'Happiness Café 小小兵主題快餐 (紐約區)、奇諾比奧咖啡 (任天堂世界)、耀西點心島飲料罐：香菇飲料杯 (任天堂世界)',
      mustVisit: '超級任天堂世界、哈利波特魔法世界、小小兵樂園',
      details: {
        japaneseInfo: null,
        notes: '飯店樓下即是車站與園區入口。用APP掃描門票QRCode，進去先用APP抽整理劵。園區必吃必喝：Happiness Café 小小兵主題快餐、奇諾比奧咖啡、耀西點心島香菇飲料杯',
        kkdayLink: null
      }
    },
    {
      time: '20:00',
      title: '晚餐 - CityWalk',
      description: '環球影城 CityWalk 區享用晚餐',
      location: '環球影城 CityWalk',
      duration: '約1小時',
      coordinates: [34.6654, 135.4323],
      dinnerOptions: 'Shake Shack (紐約漢堡、蘑菇漢堡、奶昔)、Ganko 壽司 (迴轉壽司或定食)',
      restaurants: {
        dinner: [
          { name: 'Shake Shack', location: '環球影城 CityWalk', note: '紐約漢堡，蘑菇漢堡與奶昔必點' },
          { name: 'Ganko 壽司 がんこ', location: '環球影城 CityWalk', note: '迴轉壽司或定食，適合長輩' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: 'Shake Shack蘑菇漢堡與奶昔必點、Ganko壽司適合想吃日式的長輩',
        kkdayLink: null
      }
    }
  ],
  day7: [
    {
      time: '08:30-09:30',
      title: '飯店早餐',
      description: '最後一天，悠閒享用早餐',
      transport: '飯店內',
      location: 'The Singulari Hotel',
      duration: '約1小時',
      coordinates: [34.6654, 135.4323],
      details: {
        japaneseInfo: null,
        notes: '飯店餐廳',
        kkdayLink: null
      }
    },
    {
      time: '10:00',
      title: '退房與移動',
      description: '推行李步行至巴士總站',
      transport: '走路',
      location: '環球影城巴士總站',
      duration: '約10分鐘',
      coordinates: [34.6654, 135.4323],
      details: {
        japaneseInfo: '関西空港行きのリムジンバス乗り場はどこですか？\n(請問往關西機場的利木津巴士乘車處在哪裡？)',
        notes: '推行李步行約10分鐘至巴士總站',
        kkdayLink: null
      }
    },
    {
      time: '10:27-11:30',
      title: '搭乘利木津巴士',
      description: '前往關西機場',
      transport: '利木津巴士',
      location: '關西機場',
      duration: '約1小時',
      coordinates: [34.4320, 135.2304],
      subway: '環球影城巴士總站 → 關西機場 T1',
      details: {
        japaneseInfo: '関西空港行きのリムジンバス乗り場はどこですか？\n(請問往關西機場的利木津巴士乘車處在哪裡？)',
        notes: '利木津巴士從環球影城直達關西機場，建議搭10:27班次',
        kkdayLink: null
      }
    },
    {
      time: '12:00-14:00',
      title: '關西機場 (KIX)',
      description: '辦理登機手續，準備返程',
      location: '關西機場 T1',
      duration: '約2小時',
      coordinates: [34.4320, 135.2304],
      mustEat: '神座拉麵 (第一航廈3F，白菜清甜湯頭)',
      mustBuy: 'Tokyo Banana、白色戀人、Royce 巧克力',
      details: {
        japaneseInfo: null,
        notes: '中華航空CI153：14:30關西機場T1 / 16:45桃園機場T2。必吃神座拉麵、必買伴手禮',
        kkdayLink: null
      }
    },
    {
      time: '14:30-16:45',
      title: '返程航班',
      description: '中華航空 CI153 關西機場 → 桃園機場',
      transport: '中華航空 CI153',
      location: '關西機場 T1 → 桃園機場 T2',
      duration: '飛行約3小時15分',
      coordinates: [34.4320, 135.2304],
      details: {
        japaneseInfo: null,
        notes: '去程：星宇航空JX822 09:20桃園T1/12:50關西T1 | 回程：中華航空CI153 14:30關西T1/16:45桃園T2',
        kkdayLink: null
      }
    }
  ]
}
