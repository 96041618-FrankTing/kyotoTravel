<template>
  <div id="app" class="min-h-screen bg-light">
    <!-- Header -->
    <header class="bg-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-primary">🇯🇵 京都大阪七天六夜之旅</h1>
            <p class="text-sm text-gray-600">2026年1月16日 - 1月22日</p>
          </div>
          <div class="text-right">
            <div id="header-weather" class="text-sm text-gray-600">
              <div class="weather-loading">載入天氣中...</div>
            </div>
            <div id="countdown" class="text-xs text-gray-500 mt-1">
              <div class="countdown-label">距離出發還有</div>
              <div class="countdown-timer flex space-x-1">
                <div class="countdown-item">
                  <span id="countdown-days" class="countdown-number font-bold text-primary">--</span>
                  <span class="countdown-unit">天</span>
                </div>
                <div class="countdown-item">
                  <span id="countdown-hours" class="countdown-number font-bold text-primary">--</span>
                  <span class="countdown-unit">時</span>
                </div>
                <div class="countdown-item">
                  <span id="countdown-minutes" class="countdown-number font-bold text-primary">--</span>
                  <span class="countdown-unit">分</span>
                </div>
                <div class="countdown-item">
                  <span id="countdown-seconds" class="countdown-number font-bold text-primary">--</span>
                  <span class="countdown-unit">秒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Horizontal Date Navigation -->
    <nav class="bg-white border-b sticky top-20 z-40 overflow-x-auto">
      <div class="flex space-x-1 px-4 py-2 min-w-max">
        <button
          v-for="day in days"
          :key="day.id"
          @click="activeDay = day.id"
          :class="[
            'nav-btn px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
            activeDay === day.id
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ day.label }}
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <!-- Overview Section -->
      <div v-if="activeDay === 'overview'" class="space-y-6">
        <h2 class="text-2xl font-bold text-dark mb-6">行程總覽</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-4">
            <h3 class="text-lg font-semibold text-primary mb-2">📅 旅遊日期</h3>
            <p class="text-gray-700">2026年1月16日 - 1月22日</p>
            <p class="text-sm text-gray-500 mt-1">共7天6夜</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4">
            <h3 class="text-lg font-semibold text-primary mb-2">📍 目的地</h3>
            <p class="text-gray-700">京都、大阪、天橋立</p>
            <p class="text-sm text-gray-500 mt-1">關西地區深度遊</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4">
            <h3 class="text-lg font-semibold text-primary mb-2">🚄 交通方式</h3>
            <p class="text-gray-700">JR HARUKA、ICOCA、KKday一日遊</p>
            <p class="text-sm text-gray-500 mt-1">含丹後紅松號鐵道</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4">
            <h3 class="text-lg font-semibold text-primary mb-2">🏨 住宿</h3>
            <p class="text-gray-700">京都2晚、大阪2晚、環球2晚</p>
            <p class="text-sm text-gray-500 mt-1">溫泉飯店體驗</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-dark mb-4">行程亮點</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <span class="text-2xl">🏛️</span>
                <div>
                  <h4 class="font-semibold text-dark">世界遺產巡禮</h4>
                  <p class="text-sm text-gray-600">清水寺、金閣寺、伏見稻荷大社等</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-2xl">🎌</span>
                <div>
                  <h4 class="font-semibold text-dark">傳統文化體驗</h4>
                  <p class="text-sm text-gray-600">祇園藝伎、京都藝伎體驗</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-2xl">🍜</span>
                <div>
                  <h4 class="font-semibold text-dark">美食探索</h4>
                  <p class="text-sm text-gray-600">京都懷石料理、大阪章魚燒、鰻魚飯</p>
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <span class="text-2xl">🚄</span>
                <div>
                  <h4 class="font-semibold text-dark">交通便利</h4>
                  <p class="text-sm text-gray-600">JR HARUKA直達、ICOCA一卡通</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-2xl">🌸</span>
                <div>
                  <h4 class="font-semibold text-dark">四季之美</h4>
                  <p class="text-sm text-gray-600">冬季賞雪、溫泉體驗</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-2xl">🎢</span>
                <div>
                  <h4 class="font-semibold text-dark">主題樂園</h4>
                  <p class="text-sm text-gray-600">環球影城、京都水族館</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Day Sections with Map -->
      <div v-else class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-dark">{{ getCurrentDayTitle() }}</h2>
          <button
            @click="showMap = !showMap"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🗺️</span>
            <span>{{ showMap ? '隱藏地圖' : '顯示地圖' }}</span>
          </button>
        </div>

        <!-- Map Section -->
        <div v-if="showMap" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div id="map" class="h-96 w-full"></div>
        </div>

        <!-- Itinerary Section -->
        <div class="space-y-4">
          <div
            v-for="(item, index) in getCurrentDayItinerary()"
            :key="index"
            class="bg-white rounded-lg shadow-md p-4"
          >
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {{ item.time }}
                </div>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-dark mb-2">{{ item.title }}</h3>
                <p class="text-gray-600 mb-2">{{ item.description }}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span v-if="item.transport">🚄 {{ item.transport }}</span>
                  <span v-if="item.location">📍 {{ item.location }}</span>
                  <span v-if="item.duration">⏱️ {{ item.duration }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'App',
  setup() {
    const activeDay = ref('overview')
    const showMap = ref(false)
    const map = ref(null)
    const markers = ref([])
    const userMarker = ref(null)

    const days = [
      { id: 'overview', label: '總覽' },
      { id: 'day1', label: 'Day 1' },
      { id: 'day2', label: 'Day 2' },
      { id: 'day3', label: 'Day 3' },
      { id: 'day4', label: 'Day 4' },
      { id: 'day5', label: 'Day 5' },
      { id: 'day6', label: 'Day 6' },
      { id: 'day7', label: 'Day 7' }
    ]

    // 行程資料
    const itineraryData = {
      day1: [
        {
          time: '08:00',
          title: '桃園機場集合',
          description: '集合時間請準時到達，逾時不候',
          transport: '桃園機場 → 關西機場',
          location: '桃園機場',
          duration: '飛行約3小時',
          coordinates: [25.0779, 121.2320]
        },
        {
          time: '11:30',
          title: '抵達成田機場',
          description: '辦理入境手續，領取行李',
          location: '成田機場',
          duration: '約1小時',
          coordinates: [35.7720, 140.3929]
        },
        {
          time: '13:00',
          title: '轉乘JR HARUKA',
          description: '從成田機場搭乘JR HARUKA前往京都',
          transport: 'JR HARUKA',
          location: '京都站',
          duration: '約2.5小時',
          coordinates: [34.9854, 135.7581]
        },
        {
          time: '15:30',
          title: '入住京都飯店',
          description: '休息調整時差，熟悉周邊環境',
          location: '京都飯店',
          duration: '休息2小時',
          coordinates: [35.0116, 135.7681]
        },
        {
          time: '17:30',
          title: '祇園散策',
          description: '漫步祇園花見小路，感受京都古都風情',
          location: '祇園',
          duration: '約2小時',
          coordinates: [35.0044, 135.7740]
        },
        {
          time: '19:30',
          title: '晚餐',
          description: '品嚐京都特色料理',
          location: '祇園餐廳',
          duration: '約1小時',
          coordinates: [35.0044, 135.7740]
        }
      ],
      day2: [
        {
          time: '08:00',
          title: '早餐',
          description: '飯店早餐',
          location: '京都飯店',
          duration: '30分鐘',
          coordinates: [35.0116, 135.7681]
        },
        {
          time: '09:00',
          title: '清水寺',
          description: '參觀世界遺產清水寺，俯瞰京都全景',
          transport: '公車',
          location: '清水寺',
          duration: '約2小時',
          coordinates: [34.9949, 135.7850]
        },
        {
          time: '11:30',
          title: '金閣寺',
          description: '參觀金閣寺，欣賞金色建築之美',
          transport: '公車',
          location: '金閣寺',
          duration: '約1.5小時',
          coordinates: [35.0394, 135.7292]
        },
        {
          time: '13:30',
          title: '午餐',
          description: '京都懷石料理',
          location: '金閣寺附近',
          duration: '1小時',
          coordinates: [35.0394, 135.7292]
        },
        {
          time: '15:00',
          title: '伏見稻荷大社',
          description: '參觀千本鳥居，拍攝經典照片',
          transport: '地鐵',
          location: '伏見稻荷大社',
          duration: '約2小時',
          coordinates: [34.9671, 135.7727]
        },
        {
          time: '18:00',
          title: '返回飯店',
          description: '休息準備晚餐',
          transport: '地鐵',
          location: '京都飯店',
          duration: '30分鐘',
          coordinates: [35.0116, 135.7681]
        },
        {
          time: '19:00',
          title: '晚餐',
          description: '京都特色料理',
          location: '飯店附近',
          duration: '1小時',
          coordinates: [35.0116, 135.7681]
        }
      ],
      day3: [
        {
          time: '08:00',
          title: '早餐',
          description: '飯店早餐',
          location: '京都飯店',
          duration: '30分鐘',
          coordinates: [35.0116, 135.7681]
        },
        {
          time: '09:00',
          title: '京都御所',
          description: '參觀京都御所，了解日本皇室歷史',
          transport: '公車',
          location: '京都御所',
          duration: '約1.5小時',
          coordinates: [35.0254, 135.7621]
        },
        {
          time: '11:00',
          title: '二條城',
          description: '參觀二條城，世界遺產建築',
          transport: '公車',
          location: '二條城',
          duration: '約2小時',
          coordinates: [35.0142, 135.7483]
        },
        {
          time: '13:30',
          title: '午餐',
          description: '京都料理',
          location: '二條城附近',
          duration: '1小時',
          coordinates: [35.0142, 135.7483]
        },
        {
          time: '15:00',
          title: '京都藝伎體驗',
          description: '體驗京都藝伎文化，學習傳統舞蹈',
          transport: '計程車',
          location: '祇園',
          duration: '約3小時',
          coordinates: [35.0044, 135.7740]
        },
        {
          time: '19:00',
          title: '晚餐',
          description: '藝伎區特色料理',
          location: '祇園',
          duration: '1小時',
          coordinates: [35.0044, 135.7740]
        }
      ],
      day4: [
        {
          time: '08:00',
          title: '早餐',
          description: '飯店早餐',
          location: '京都飯店',
          duration: '30分鐘',
          coordinates: [35.0116, 135.7681]
        },
        {
          time: '09:00',
          title: '轉往大阪',
          description: '搭乘JR前往大阪',
          transport: 'JR',
          location: '大阪站',
          duration: '約30分鐘',
          coordinates: [34.7024, 135.4959]
        },
        {
          time: '10:00',
          title: '入住大阪飯店',
          description: '休息調整',
          location: '大阪飯店',
          duration: '1小時',
          coordinates: [34.7024, 135.4959]
        },
        {
          time: '11:00',
          title: '大阪城',
          description: '參觀大阪城，了解日本歷史',
          transport: '地鐵',
          location: '大阪城',
          duration: '約2小時',
          coordinates: [34.6873, 135.5262]
        },
        {
          time: '14:00',
          title: '午餐',
          description: '大阪章魚燒',
          location: '大阪城附近',
          duration: '1小時',
          coordinates: [34.6873, 135.5262]
        },
        {
          time: '15:30',
          title: '心齋橋購物',
          description: '大阪知名購物區，血拼時間',
          transport: '地鐵',
          location: '心齋橋',
          duration: '約3小時',
          coordinates: [34.6739, 135.5011]
        },
        {
          time: '19:00',
          title: '晚餐',
          description: '大阪美食',
          location: '心齋橋',
          duration: '1小時',
          coordinates: [34.6739, 135.5011]
        }
      ],
      day5: [
        {
          time: '08:00',
          title: '早餐',
          description: '飯店早餐',
          location: '大阪飯店',
          duration: '30分鐘',
          coordinates: [34.7024, 135.4959]
        },
        {
          time: '09:00',
          title: '環球影城',
          description: '刺激的遊樂園體驗',
          transport: 'JR',
          location: '環球影城',
          duration: '全天',
          coordinates: [34.6654, 135.4323]
        },
        {
          time: '18:00',
          title: '返回飯店',
          description: '休息',
          transport: 'JR',
          location: '大阪飯店',
          duration: '30分鐘',
          coordinates: [34.7024, 135.4959]
        },
        {
          time: '19:00',
          title: '晚餐',
          description: '環球影城附近美食',
          location: '環球影城',
          duration: '1小時',
          coordinates: [34.6654, 135.4323]
        }
      ],
      day6: [
        {
          time: '08:00',
          title: '早餐',
          description: '飯店早餐',
          location: '大阪飯店',
          duration: '30分鐘',
          coordinates: [34.7024, 135.4959]
        },
        {
          time: '09:00',
          title: '天橋立',
          description: '一日遊：搭乘丹後紅松號鐵道前往天橋立',
          transport: '丹後紅松號',
          location: '天橋立',
          duration: '全天',
          coordinates: [35.5667, 135.1833]
        },
        {
          time: '18:00',
          title: '返回大阪',
          description: '返回大阪飯店',
          transport: '丹後紅松號',
          location: '大阪飯店',
          duration: '約2小時',
          coordinates: [34.7024, 135.4959]
        },
        {
          time: '20:00',
          title: '晚餐',
          description: '大阪美食',
          location: '大阪飯店附近',
          duration: '1小時',
          coordinates: [34.7024, 135.4959]
        }
      ],
      day7: [
        {
          time: '08:00',
          title: '早餐',
          description: '飯店早餐',
          location: '大阪飯店',
          duration: '30分鐘',
          coordinates: [34.7024, 135.4959]
        },
        {
          time: '09:00',
          title: '自由活動',
          description: '大阪最後的購物時間',
          location: '大阪市區',
          duration: '約3小時',
          coordinates: [34.7024, 135.4959]
        },
        {
          time: '12:00',
          title: '午餐',
          description: '大阪美食',
          location: '大阪市區',
          duration: '1小時',
          coordinates: [34.7024, 135.4959]
        },
        {
          time: '14:00',
          title: '前往關西機場',
          description: '準備返程',
          transport: 'JR HARUKA',
          location: '關西機場',
          duration: '約1小時',
          coordinates: [34.4320, 135.2304]
        },
        {
          time: '16:00',
          title: '返程',
          description: '搭機返回台灣',
          transport: '飛機',
          location: '關西機場 → 桃園機場',
          duration: '飛行約3小時',
          coordinates: [34.4320, 135.2304]
        }
      ]
    }

    const getCurrentDayTitle = () => {
      const dayMap = {
        day1: 'Day 1 - 桃園 → 京都',
        day2: 'Day 2 - 京都景點巡禮',
        day3: 'Day 3 - 京都文化體驗',
        day4: 'Day 4 - 京都 → 大阪',
        day5: 'Day 5 - 環球影城',
        day6: 'Day 6 - 天橋立一日遊',
        day7: 'Day 7 - 大阪 → 返程'
      }
      return dayMap[activeDay.value] || '行程總覽'
    }

    const getCurrentDayItinerary = () => {
      return itineraryData[activeDay.value] || []
    }

    const initializeMap = () => {
      if (map.value) return

      // iOS Safari 需要特殊的處理
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

      map.value = L.map('map', {
        zoomControl: !isIOS, // iOS 使用原生手勢
        touchZoom: true,
        scrollWheelZoom: !isIOS // 在iOS上禁用滾輪縮放
      }).setView([35.0116, 135.7681], 12)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 8
      }).addTo(map.value)

      // iOS Safari Geolocation 需要特殊處理
      if (navigator.geolocation) {
        const geoOptions = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5分鐘快取
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            userMarker.value = L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'user-location-marker',
                html: '📍',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
              })
            }).addTo(map.value)
            userMarker.value.bindPopup('📍 您現在的位置').openPopup()

            // 如果用戶位置在日本附近，將地圖中心移到用戶位置
            if (latitude > 30 && latitude < 46 && longitude > 128 && longitude < 146) {
              map.value.setView([latitude, longitude], 13)
            }
          },
          (error) => {
            console.log('無法獲取位置:', error.message)
            // 在iOS上顯示友好的錯誤訊息
            if (error.code === error.PERMISSION_DENIED) {
              alert('請允許位置權限以顯示您的現在位置')
            }
          },
          geoOptions
        )
      } else {
        console.log('此瀏覽器不支援地理位置功能')
      }
    }

    const updateMapMarkers = () => {
      // 清除現有標記
      markers.value.forEach(marker => map.value.removeLayer(marker))
      markers.value = []

      const currentItinerary = getCurrentDayItinerary()
      currentItinerary.forEach((item, index) => {
        if (item.coordinates) {
          const marker = L.marker(item.coordinates)
            .addTo(map.value)
            .bindPopup(`
              <div class="text-sm">
                <h4 class="font-bold">${item.title}</h4>
                <p>${item.time} - ${item.location}</p>
                <p class="text-gray-600">${item.description}</p>
              </div>
            `)
          markers.value.push(marker)
        }
      })

      // 調整地圖視圖以包含所有標記
      if (markers.value.length > 0) {
        const group = new L.featureGroup(markers.value)
        map.value.fitBounds(group.getBounds().pad(0.1))
      }
    }

    const watchActiveDay = () => {
      if (showMap.value && activeDay.value !== 'overview') {
        if (!map.value) {
          initializeMap()
        }
        updateMapMarkers()
      }
    }

    onMounted(() => {
      // 初始化倒計時
      initializeCountdown()
      // 初始化天氣
      initializeWeather()
    })

    const initializeCountdown = () => {
      const targetDate = new Date('2026-01-16T00:00:00').getTime()

      const updateCountdown = () => {
        const now = new Date().getTime()
        const distance = targetDate - now

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24))
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)

          document.getElementById('countdown-days').textContent = days
          document.getElementById('countdown-hours').textContent = hours
          document.getElementById('countdown-minutes').textContent = minutes
          document.getElementById('countdown-seconds').textContent = seconds
        }
      }

      updateCountdown()
      setInterval(updateCountdown, 1000)
    }

    const initializeWeather = () => {
      // 模擬天氣資料
      const weatherElement = document.getElementById('header-weather')
      weatherElement.innerHTML = `
        <div class="flex items-center space-x-2">
          <span class="text-lg">🌤️</span>
          <span class="text-sm">京都 8°C</span>
        </div>
      `
    }

    // 監視 activeDay 和 showMap 的變化
    watchActiveDay()

    return {
      activeDay,
      showMap,
      days,
      getCurrentDayTitle,
      getCurrentDayItinerary
    }
  }
}
</script>

<style>
/* Leaflet 自定義樣式 */
.user-location-marker {
  font-size: 24px;
  text-align: center;
  line-height: 30px;
}

/* 自定義滾動條 */
nav::-webkit-scrollbar {
  height: 4px;
}

nav::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb {
  background: #E63946;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #d32f3f;
}
</style>