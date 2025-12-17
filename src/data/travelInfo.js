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
    { item: '住宿 Onyado Nono Kyoto Shichijo Natural Hot Spring 兩晚', amount: 'NT$20,615' },
    { item: '住宿 KOKO HOTEL Osaka Namba Sennichimae 兩晚', amount: 'NT$11,642' },
    { item: '住宿 THE SINGULARI HOTEL & SKYSPA at UNIVERSAL STUDIOS JAPAN 兩晚', amount: 'NT$14,565' },
    { item: 'Day3 KKDAY【大阪/京都出發】海之京都一日遊 x4', amount: 'NT$7,324' },
    { item: 'Day5 KKDAY【京都&奈良一日遊】金閣寺、嵐山、奈良公園、伏見稻荷大社 x4', amount: 'NT$6,240' }
  ],
  passports: [
    { name: 'TING/CHINYUAN', number: '362619707' },
    { name: 'LIU/CHIAHSIANG', number: '362619711' },
    { name: 'QIU/CAIMIAN', number: '368976431' },
    { name: 'TING/PEIEN', number: '362619698' }
  ],
  todoList: [
    '購買上網SIM/eSIM卡(eSIMGo)',
    '購買雪地防滑鞋套',
    '購買iPhone 6S手機殼和背帶',
    '預定KKDay一日遊行程',
    '預定日本和服時間',
    '預定機上餐點與座位(需付費？)',
    '投保旅遊不便險(國泰or富邦)',
    '填寫VJW(https://www.vjw.digital.go.jp/main/#/vjwplo001)',
    '線上購買環球影城門票 + 快通4',
    '線上購買JR HARUKA WEST QR火車票和選位(電子票)'
  ]
}
