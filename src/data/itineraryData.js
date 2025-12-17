export const itineraryData = {
  day1: [
    {
      time: '08:00-15:00',
      title: '機場移動至京都',
      description: '關西機場 → 京都車站 (領票/買卡) → 飯店 Check-in',
      transport: 'JR HARUKA 特急電車 + 計程車 x2',
      location: '關西機場 → 京都車站 → Onyado Nono Kyoto Shichijo',
      duration: '約7小時',
      coordinates: [34.4320, 135.2304],
      subway: '關西機場站 → 京都車站 (JR HARUKA特急)',
      details: {
        japaneseInfo: '天然温泉 蓮花の湯 御宿 野乃 京都七条 までお願いします。\n(住所: 京都市下京区材木町491番地)',
        notes: '有3個大行李，務必叫2台車。入境領票、Check-in。距離約500公尺，有行李建議分2台車',
        kkdayLink: null
      }
    },
    {
      time: '15:30-17:30',
      title: '京都車站周邊探險 (分流活動)',
      description: 'A組(長輩)：京都塔 (欣賞京都市景) | B組(小孩)：Yodobashi Camera 3F 玩具區 (京都車站八條口方向)',
      transport: '走路',
      location: '京都車站',
      duration: '約2小時',
      coordinates: [34.9854, 135.7581],
      details: {
        japaneseInfo: null,
        notes: '分流活動：飯店對面即是。A組京都塔欣賞京都市景，B組Yodobashi Camera 3F玩具區',
        kkdayLink: null
      }
    },
    {
      time: '18:00-20:00',
      title: '晚餐 - 東洋亭 (Porta 地下街店)',
      description: '必吃：百年洋食漢堡排 (鋁箔包著，打開熱氣騰騰)、整顆番茄沙拉',
      location: '京都車站 Porta 地下街',
      duration: '約2小時',
      coordinates: [34.9854, 135.7581],
      mustEat: '百年洋食漢堡排、整顆番茄沙拉',
      restaurants: {
        dinner: [
          { name: '東洋亭 Porta店', location: '京都車站 Porta地下街', note: '百年洋食漢堡排、整顆番茄沙拉' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '京都車站地下街美食',
        kkdayLink: null
      }
    }
  ],
  day2: [
    {
      time: '08:00-09:00',
      title: '飯店早餐',
      description: '享用豐富的日式/西式自助餐',
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
      time: '09:00-12:00',
      title: '清水寺與和服體驗',
      description: '參拜清水舞台、音羽之瀧',
      transport: '計程車 x1',
      location: '清水寺',
      duration: '約3小時',
      coordinates: [34.9949, 135.7850],
      mustVisit: '橡子共和國 (大龍貓)、史努比茶屋',
      details: {
        japaneseInfo: '清水寺の近くの「七味家本舗（しちみやほんぽ）」の前までお願いします。\n(坂道を上がりきったところです)',
        notes: '4人搭1台，請司機停在「七味家本舖」前，這是離清水寺最近的下車點',
        kkdayLink: null
      }
    },
    {
      time: '12:00-14:00',
      title: '二三年坂散策 & 午餐',
      description: '沿著石板路慢慢往下走',
      transport: '走路',
      location: '二三年坂',
      duration: '約2小時',
      coordinates: [35.0064, 135.7850],
      lunchOptions: '奧丹清水 (湯豆腐)、阿古屋茶屋 (茶泡飯吃到飽)、藤菜美 (現烤醬油糰子、洛水)',
      restaurants: {
        lunch: [
          { name: '奧丹清水 Okutan', location: '京都清水寺', note: '湯豆腐料理，環境清幽' },
          { name: '阿古屋茶屋 Akoya', location: '京都清水寺二年坂', note: '茶泡飯吃到飽(需排隊)' },
          { name: '藤菜美 Fujinami', location: '京都清水寺', note: '現烤醬油糰子、洛水(抹茶水)' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '午餐推薦：奧丹清水湯豆腐(長輩會喜歡)、阿古屋茶屋茶泡飯吃到飽(需排隊)、藤菜美現烤糰子',
        kkdayLink: null
      }
    },
    {
      time: '14:30-16:00',
      title: 'Mipig Cafe 迷你豬體驗 (親子大推!)',
      description: '與可愛迷你豬互動',
      transport: '計程車 x1',
      location: 'Mipig Cafe 京都店 (錦市場附近)',
      duration: '約1.5小時',
      coordinates: [35.0080, 135.7680],
      details: {
        japaneseInfo: '「mipig cafe（マイピッグカフェ）京都店」までお願いします。\n(住所: 京都市中京区新京極通四条上る中之町560-2)\n※錦市場の近くです。',
        notes: '親子大推！迷你豬療癒體驗',
        kkdayLink: null
      }
    },
    {
      time: '16:30-18:30',
      title: '錦市場 & 祇園',
      description: '逛「京都的廚房」，漫步祇園花見小路',
      transport: '走路',
      location: '錦市場 & 祇園',
      duration: '約2小時',
      coordinates: [35.0044, 135.7740],
      mustEat: '史努比茶屋饅頭、三木雞卵玉子燒、豆乳甜甜圈',
      details: {
        japaneseInfo: null,
        notes: '必吃：史努比茶屋饅頭、三木雞卵玉子燒、豆乳甜甜圈',
        kkdayLink: null
      }
    },
    {
      time: '19:00',
      title: '晚餐 - 河原町/先斗町周邊',
      description: '柚子元 (柚子豬肉火鍋) 或名代炸豬排',
      location: '祇園/河原町',
      duration: '約1小時',
      coordinates: [35.0044, 135.7740],
      dinnerOptions: '柚子元 (柚子豬肉火鍋)、名代炸豬排 Katsukura 三條本店',
      restaurants: {
        dinner: [
          { name: '柚子元 Yuzugen', location: '京都河原町', note: '柚子豬肉火鍋，湯頭清爽適合冬天' },
          { name: '名代炸豬排 Katsukura 三條本店', location: '京都三條', note: '京都最好吃的炸豬排之一' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '推薦柚子鍋(湯頭清爽適合冬天)或京都最好吃的炸豬排',
        kkdayLink: null
      }
    }
  ],
  day3: [
    {
      time: '07:00-08:00',
      title: '飯店早餐',
      description: '吃飽一點，今天車程較長',
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
      time: '08:00-08:30',
      title: '前往京都車站集合點',
      description: '飯店出發前往京都車站八條口祭時計広場',
      transport: '計程車 x2',
      location: '京都車站八條口祭時計広場',
      duration: '約30分鐘',
      coordinates: [34.9854, 135.7581],
      subway: '京都車站',
      details: {
        japaneseInfo: '京都駅八条口の「祭時計広場（まつりどけいひろば）」までお願いします。',
        notes: '有3個大行李，務必叫2台車。KKday集合點：京都車站八条口祭時計広場',
        kkdayLink: 'https://www.kkday.com/zh-tw/product/154074'
      }
    },
    {
      time: '08:00-18:00',
      title: 'KKDAY【大阪/京都出發】海之京都一日遊｜伊根灣遊船・伊根舟屋・天橋立',
      description: '[京都出發] 08:00集合 → 伊根舟屋遊覽船餵海鷗、天橋立纜車看飛龍觀/昇龍觀 → [大阪下車] 18:00抵達大阪日本橋蟹道樂東店',
      transport: 'KKday 巴士一日遊',
      location: '天橋立、伊根舟屋',
      duration: '約10小時',
      coordinates: [35.5667, 135.1833],
      mustEat: '花蛤丼 (あさり丼)',
      lunchOptions: 'はまや食堂 (花蛤丼、烏龍麵)、橋立大丸本店 (海鮮丼、團體定食)、Cafe du Pin (麵包簡餐)',
      mustVisit: '伊根舟屋餵海鷗 (自備蝦味先)、天橋立纜車',
      restaurants: {
        lunch: [
          { name: 'はまや食堂 Hamaya Shokudo', location: '天橋立智恩寺', note: '花蛤丼、烏龍麵，座位多出餐快' },
          { name: '橋立大丸本店', location: '天橋立', note: '海鮮丼、團體定食，環境寬敞' },
          { name: 'Cafe du Pin', location: '天橋立運河旁', note: '麵包和簡餐' }
        ]
      },
      details: {
        japaneseInfo: null,
        notes: '京都車站八条口祭時計広場 08:00集合，大阪日本橋蟹道樂東店 18:00下車。搭乘遊覽船餵海鷗(請自備蝦味先)、天橋立纜車看飛龍觀。午餐自理(文殊地區)，推薦花蛤丼',
        kkdayLink: 'https://www.kkday.com/zh-tw/product/154074'
      }
    },
    {
      time: '18:00-19:00',
      title: '抵達大阪・走路去飯店',
      description: '大阪日本橋蟹道樂東店下車 → 推行李步行至 KOKO HOTEL',
      transport: '走路',
      location: 'KOKO HOTEL Osaka Namba Sennichimae',
      duration: '約4分鐘 (300公尺)',
      coordinates: [34.6658, 135.5043],
      subway: '日本橋站附近',
      details: {
        japaneseInfo: null,
        notes: 'KKday於大阪日本橋蟹道樂東店 18:00下車。步行約300公尺(4分鐘)至飯店，雖有行李但路程很短且平坦，不需叫車',
        kkdayLink: null
      }
    },
    {
      time: '20:00',
      title: '晚餐 - 千日前/日本橋周邊',
      description: '飯店附近美食',
      location: '千日前',
      duration: '約1小時',
      coordinates: [34.6686, 135.5011],
      dinnerOptions: '千房大阪燒、神座拉麵千日前店 (蔬菜湯頭)、わなか章魚燒',
      restaurants: {
        dinner: [
          { name: '千房大阪燒 Chibo', location: '大阪千日前', note: '大阪燒名店' },
          { name: '神座拉麵 Kamukura 千日前店', location: '大阪千日前', note: '蔬菜湯頭拉麵，口味清甜' },
          { name: 'わなか章魚燒 Wanaka', location: '大阪千日前', note: '千日前總店，必吃大阪章魚燒' }
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
      title: '大阪城公園 (搭小火車)',
      description: '參觀大阪城天守閣，搭路面小火車',
      transport: '地鐵',
      location: '大阪城公園',
      duration: '約2小時',
      coordinates: [34.6873, 135.5262],
      subway: '難波站 (御堂筋線) → 本町站 (轉中央線) → 谷町四丁目站',
      mustEat: '抹茶冰淇淋 (天守閣前廣場)',
      mustVisit: '大阪城御座船 (戴金色斗笠遊護城河)、路面小火車',
      details: {
        japaneseInfo: null,
        notes: '搭乘路面小火車直達天守閣。必玩：御座船(戴金色斗笠)、抹茶冰淇淋',
        kkdayLink: null
      }
    },
    {
      time: '13:30-15:30',
      title: '黑門市場 & 午餐 (邊走邊吃)',
      description: '大阪知名市場，品嚐新鮮海鮮',
      transport: '計程車 x1',
      location: '黑門市場',
      duration: '約2小時',
      coordinates: [34.6686, 135.5011],
      subway: '日本橋站附近',
      mustEat: '黑門三平 (現切生魚片、大蝦)、石橋食品 (關東煮)、丸善食肉店 (現烤和牛串)',
      restaurants: {
        lunch: [
          { name: '黑門三平', location: '大阪黑門市場', note: '現切生魚片、大蝦(可內用)' },
          { name: '石橋食品', location: '大阪黑門市場', note: '關東煮(蘿蔔燉得很爛)' },
          { name: '丸善食肉店', location: '大阪黑門市場', note: '現烤和牛串(現場吃非常香)' }
        ]
      },
      details: {
        japaneseInfo: '「黒門市場（くろもんいちば）」の入り口までお願いします。\n(日本橋駅の近くです)',
        notes: '午餐推薦邊走邊吃：黑門三平生魚片、石橋關東煮、丸善和牛串',
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
      time: '07:00-07:30',
      title: '退房與寄放行李',
      description: '辦理退房，將3個大行李寄放在 KOKO HOTEL 櫃檯',
      transport: '飯店內',
      location: 'KOKO HOTEL Osaka Namba',
      duration: '約30分鐘',
      coordinates: [34.6658, 135.5043],
      details: {
        japaneseInfo: null,
        notes: '將行李寄放在飯店櫃檯，告知晚上回來拿',
        kkdayLink: null
      }
    },
    {
      time: '07:30-08:30',
      title: '飯店早餐',
      description: '快速吃早餐，準備出發',
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
      time: '07:30-07:50',
      title: '前往集合地點',
      description: '走路前往 VIP Villa難波集合',
      transport: '走路',
      location: 'VIP Villa難波',
      duration: '約5-8分鐘',
      coordinates: [34.6686, 135.5011],
      subway: '日本橋站附近',
      details: {
        japaneseInfo: '「VIP Villa（ヴィップヴィラ）なんば」までお願いします。',
        notes: 'KKday集合點：VIP Villa難波 07:50集合，走路約5-8分鐘',
        kkdayLink: 'https://www.kkday.com/zh-tw/product/13894'
      }
    },
    {
      time: '07:50-19:10',
      title: 'KKDAY【京都&奈良一日遊】金閣寺、嵐山(午餐自理)、伏見稻荷大社、奈良公園',
      description: '[大阪出發] 07:50集合/VIP Villa難波 → 金閣寺 → 嵐山竹林(午餐自理) → 伏見稻荷千本鳥居 → 奈良餵鹿 → [大阪下車] 19:10抵達/VIP Villa難波',
      transport: '觀光遊覽車',
      location: '金閣寺 → 嵐山 → 伏見稻荷 → 奈良',
      duration: '約11小時20分',
      coordinates: [35.0142, 135.7483],
      mustEat: '嵐山：中村屋可樂餅、% Arabica Coffee、Miffy Sakura Kitchen | 奈良：中谷堂麻糬、大佛布丁 | 伏見稻荷：稻荷壽司',
      mustVisit: '金閣寺、嵐山竹林、伏見稻荷千本鳥居、奈良餵鹿',
      details: {
        japaneseInfo: null,
        notes: 'VIP Villa難波 07:50集合，19:10回到VIP Villa難波下車。金閣寺→嵐山竹林(午餐自理)→伏見稻荷→奈良餵鹿。必吃：中村屋可樂餅、中谷堂麻糬、大佛布丁',
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
        notes: 'VIP Villa難波 19:10下車後走路回KOKO HOTEL(約5-8分鐘)取行李，叫2台計程車(有行李)前往USJ飯店',
        kkdayLink: null
      }
    },
    {
      time: '20:00',
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
