export const itineraryData = {
  day1: [
    {
      time: '08:00-15:00',
      title: '機場移動至京都',
      description: '關西機場 → 京都車站 (領票/買卡) → 走地下通道至飯店 Check-in',
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
      title: '八坂神社周邊 & 和服體驗',
      description: '八坂神社(和服體驗)',
      transport: '計程車 x1',
      location: '八坂神社',
      duration: '約2.5小時',
      coordinates: [35.0036, 135.7810],
      mustVisit: '八坂神社、圓山公園',
      details: {
        japaneseInfo: '八坂神社（やさかじんじゃ）の近くまでお願いします。\n(祇園の交差点付近です)',
        notes: '活動：1. 和服換裝：預約 9:00 開門的店家 (建議找八坂神社/祇園附近的店，如岡本祇園店、梨花和服等)。2. 拍照與散步：換好裝後，先在八坂神社朱紅色樓門、圓山公園拍照。',
        kkdayLink: null
      }
    },
    {
      time: '11:30-13:00',
      title: '午餐 (和服友善)',
      description: '在祇園/八坂神社周邊用餐',
      transport: '走路',
      location: '祇園/八坂神社',
      duration: '約1.5小時',
      coordinates: [35.0036, 135.7810],
      lunchOptions: '祇園牛禪 (壽喜燒/涮涮鍋)、權兵衛 (親子丼/烏龍麵)、Izuju (鯖魚壽司)',
      restaurants: {
        lunch: [
          { name: '祇園牛禪', location: '祇園', note: '壽喜燒/涮涮鍋 (空間大)' },
          { name: '權兵衛 Gonbei', location: '祇園', note: '親子丼/烏龍麵老店 (適合長輩)' },
          { name: 'Izuju いづ重', location: '祇園', note: '鯖魚壽司名店 (可外帶去圓山公園吃)' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '地點：在祇園/八坂神社周邊用餐。推薦：祇園牛禪 (壽喜燒/涮涮鍋，空間大)、權兵衛 (親子丼/烏龍麵老店，適合長輩)、Izuju (鯖魚壽司名店，可外帶去圓山公園吃)。',
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
      title: '歸還和服 & 祇園散策',
      description: '一路逛回八坂神社附近的店家歸還和服',
      transport: '走路',
      location: '祇園',
      duration: '約1小時',
      coordinates: [35.0036, 135.7810],
      details: {
        japaneseInfo: null,
        notes: '歸還和服。若長輩累了，可以在這段路安排人力車代步回到和服店。',
        kkdayLink: null
      }
    },
    {
      time: '18:00',
      title: '晚餐',
      description: '柚子元 (先斗町) 或 鳥貴族 (京都七條店) 或 名代炸豬排',
      location: '先斗町 或 京都七條',
      duration: '約1小時',
      coordinates: [35.0044, 135.7740],
      dinnerOptions: '柚子元 (柚子豬肉火鍋)、鳥貴族 (串燒)、名代炸豬排',
      restaurants: {
        dinner: [
          { name: '柚子元 Yuzugen', location: '先斗町', note: '柚子豬肉火鍋 (湯頭清爽)' },
          { name: '鳥貴族 京都七條店', location: '京都七條', note: '全品項均一價的平價串燒居酒屋' },
          { name: '名代炸豬排', location: '京都', note: '炸豬排名店' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '推薦餐廳 1：柚子元 (先斗町) - 必吃：柚子豬肉火鍋 (湯頭清爽)。推薦餐廳 2：鳥貴族 (京都七條店) - 若中午吃太飽或想早點回飯店休息。推薦餐廳 3：名代炸豬排。',
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
      dinnerOptions: '千房大阪燒、神座拉麵千日前店 (蔬菜湯頭)、章魚燒 道樂 Wanaka',
      restaurants: {
        dinner: [
          { name: '千房大阪燒 Chibo', location: '大阪千日前', note: '大阪燒名店' },
          { name: '神座拉麵 Kamukura 千日前店', location: '大阪千日前', note: '蔬菜湯頭拉麵，口味清甜' },
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
      time: '08:30-09:30',
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
      time: '09:30-10:30',
      title: '難波八阪神社',
      description: '巨大獅子頭舞台 (吸厄運)',
      transport: '走路',
      location: '難波八阪神社',
      duration: '約1小時',
      coordinates: [34.6628, 135.5011],
      mustVisit: '巨大獅子頭舞台',
      details: {
        japaneseInfo: null,
        notes: '離飯店約10-12分鐘',
        kkdayLink: null
      }
    },
    {
      time: '11:00-13:00',
      title: '大阪城公園 (二選一行程)',
      description: 'A. 御座船 (輕鬆)：搭船遊護城河 (20分鐘)，不用爬樓梯 | B. 天守閣 (歷史)：需爬樓梯或排電梯，可看風景',
      transport: '地鐵 (簡單直達)',
      location: '大阪城公園',
      duration: '約2小時',
      coordinates: [34.6873, 135.5262],
      subway: '難波站 (御堂筋線) → 本町 (轉中央線) → 森之宮站 (Morinomiya) 3-B出口',
      mustVisit: '路面小火車 (Road Train)、御座船 (輕鬆推薦)、天守閣 (現場依體力/天氣決定)',
      details: {
        japaneseInfo: null,
        notes: '走回難波站 (約 8 分鐘) → 搭御堂筋線 → 本町轉中央線 → 森之宮站下車。站內指引：3-B 出口 (有電梯)，出口即是公園入口和小火車站。園內移動：搭乘路面小火車 (Road Train)',
        kkdayLink: null
      }
    },
    {
      time: '13:30-15:30',
      title: '黑門市場 & 午餐',
      description: '大阪知名市場，品嚐新鮮海鮮',
      transport: '地鐵',
      location: '黑門市場',
      duration: '約2小時',
      coordinates: [34.6686, 135.5011],
      subway: '森之宮站 (中央線) → 堺筋本町 (轉堺筋線) → 日本橋站 10號出口',
      mustEat: '黑門三平 (現切生魚片、大蝦)、石橋食品 (關東煮)、丸善食肉店 (現烤和牛串)',
      restaurants: {
        lunch: [
          { name: '黑門三平', location: '大阪黑門市場', note: '現切生魚片、大蝦(可內用)' },
          { name: '石橋食品', location: '大阪黑門市場', note: '關東煮(蘿蔔燉得很爛)' },
          { name: '丸善食肉店', location: '大阪黑門市場', note: '現烤和牛串(現場吃非常香)' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '森之宮站 → 中央線 → 堺筋本町轉堺筋線 → 日本橋站。站內指引：10 號出口出來就是黑門市場。午餐推薦邊走邊吃：黑門三平生魚片、石橋關東煮、丸善和牛串',
        kkdayLink: null
      }
    },
    {
      time: '16:00-19:00',
      title: '心齋橋 PARCO & 大丸 (小孩天堂)',
      description: '購物血拼，參觀寶可夢中心、任天堂商店',
      transport: '走路',
      location: '心齋橋 PARCO & 大丸',
      duration: '約3小時',
      coordinates: [34.6739, 135.5011],
      subway: '心齋橋站',
      mustVisit: '9F Pokemon Center DX・Jump Shop、6F 橡子共和國・樂高・哥吉拉商店、B1/2F Harbs蛋糕',
      mustEat: 'Harbs 水果千層蛋糕 (長輩休息好去處)',
      details: {
        japaneseInfo: null,
        notes: '黑門市場走過去約15分鐘。必逛：9F寶可夢中心、6F橡子共和國、B1 Harbs蛋糕',
        kkdayLink: null
      }
    },
    {
      time: '19:00',
      title: '晚餐 - 燒肉',
      description: '國產牛燒肉放題 Aburiya 或播重壽喜燒',
      location: '心齋橋/道頓堀',
      duration: '約1小時',
      coordinates: [34.6739, 135.5011],
      dinnerOptions: '國產牛燒肉放題 Aburiya (道頓堀御堂筋店，建議預約)、播重 Hariju (壽喜燒老店)',
      restaurants: {
        dinner: [
          { name: '國產牛燒肉放題 Aburiya 道頓堀御堂筋店', location: '大阪道頓堀', note: '高品質吃到飽，強烈建議預約' },
          { name: '播重 Hariju', location: '大阪心齋橋', note: '壽喜燒老店，適合長輩' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '推薦國產牛燒肉放題Aburiya(強烈建議預約)或播重壽喜燒(適合長輩)',
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
      time: '06:40-07:50',
      title: '飯店早餐 & 前往集合地點',
      description: '快速吃早餐，然後走路前往 VIP Villa難波集合',
      transport: '飯店內 + 走路',
      location: 'KOKO HOTEL → VIP Villa難波',
      duration: '約1小時10分鐘',
      coordinates: [34.6658, 135.5043],
      details: {
        japaneseInfo: null,
        notes: '飯店餐廳用餐後，走路約 7-10 分鐘 (約 650 公尺) 到 VIP Villa 難波 (KKday 集合點)。往難波車站方向走，請依憑證地圖為準',
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
      mustEat: '嵐山：中村屋可樂餅、% Arabica Coffee | 奈良：中谷堂麻糬、大佛布丁',
      mustVisit: '金閣寺、嵐山竹林、伏見稻荷千本鳥居、奈良公園餵鹿',
      details: {
        japaneseInfo: null,
        notes: '[大阪出發] 07:50集合/VIP Villa難波 → 金閣寺 → 嵐山竹林(午餐自理) → 伏見稻荷千本鳥居 → 奈良餵鹿 → [大阪下車] 19:10抵達/VIP Villa難波。重點：嵐山竹林、奈良公園餵鹿、伏見稻荷千本鳥居。必吃：嵐山可樂餅 (中村屋)、奈良中谷堂麻糬',
        kkdayLink: 'https://www.kkday.com/zh-tw/product/13894'
      }
    },
    {
      time: '19:10-20:30',
      title: '返回飯店拿行李 & 移動至 USJ',
      description: 'VIP Villa難波下車 → 走路回 KOKO HOTEL 取行李 → 叫計程車到環球影城飯店',
      transport: '走路 + 計程車 x2',
      location: 'The Singulari Hotel & Skyspa',
      duration: '約1小時20分',
      coordinates: [34.6654, 135.4323],
      subway: 'ユニバーサルシティ駅',
      details: {
        japaneseInfo: 'ユニバーサルシティ駅の「ザ・シンギュラリホテル & スカイスパ」までお願いします。\n(住所: 大阪市此花区島屋6丁目2-25)',
        notes: 'VIP Villa難波下車 → 走路回 KOKO HOTEL 取行李 → 叫計程車到環球影城飯店。方案 A (電車 - 轉乘1次)：走至近鐵日本橋站 → 搭阪神難波線至西九條 → 轉JR夢咲線至Universal City (飯店在車站旁)。方案 B (計程車 - 分2台)：直接叫車直達飯店 (約 ¥5000/台)',
        kkdayLink: null
      }
    },
    {
      time: '20:30',
      title: '晚餐 - USJ CityWalk',
      description: '環球影城 CityWalk 區享用晚餐',
      location: '環球影城 CityWalk',
      duration: '約1小時',
      coordinates: [34.6654, 135.4323],
      dinnerOptions: '551 Horai (海鮮炒麵、肉包)、大阪章魚燒博物館 (甲賀流、會津屋)',
      restaurants: {
        dinner: [
          { name: '551 Horai 蓬萊', location: '環球影城 CityWalk', note: '海鮮炒麵、肉包(可外帶)' },
          { name: '大阪章魚燒博物館', location: '環球影城 CityWalk', note: '多家名店聚集(甲賀流、會津屋)' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '推薦551 Horai海鮮炒麵與肉包(可外帶)、章魚燒博物館',
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
