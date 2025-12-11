<template>
  <div id="app" class="min-h-screen bg-light">
    <!-- Header -->
    <header class="bg-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div>
            <h1 
              class="text-lg sm:text-2xl font-bold text-primary no-zoom-title flex items-center gap-2" 
              @click="handleTitleClick"
              @touchend.prevent="handleTitleClick"
            >
              <span class="cat-decoration" style="font-size: 1.5em;">�</span>
              🇯🇵 京阪古都七日散策之旅
              <span class="cat-decoration" style="animation-delay: 0.5s; font-size: 1.3em;">🌸</span>
            </h1>
            <p class="text-sm text-gray-600">2026年1月16日 - 1月22日 <span class="sparkle">✨</span></p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-600">
              <div v-if="currentWeather" class="flex items-center justify-end space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors" @click="showWeatherModal = true">
                <span class="text-lg">{{ currentWeather.icon }}</span>
                <div class="text-right">
                  <div class="font-semibold">{{ currentWeather.location }}</div>
                  <div class="text-xs">{{ currentWeather.temp }}</div>
                </div>
              </div>
              <div v-else class="weather-loading">載入天氣中...</div>
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

        <!-- 旅行資訊 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 班機資訊 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-dark mb-4">✈️ 班機資訊</h3>
            <div class="space-y-4">
              <div v-for="flight in travelInfo.flights" :key="flight.date" class="border-l-4 border-blue-400 pl-4">
                <div class="font-semibold text-primary">{{ flight.airline }}</div>
                <div class="text-sm text-gray-600">{{ flight.date }}</div>
                <div class="text-sm mt-1">
                  <div>🛫 出發: {{ flight.departure }}</div>
                  <div>🛬 抵達: {{ flight.arrival }}</div>
                  <div>⏱️ 飛行時間: {{ flight.duration }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 住宿資訊 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-dark mb-4">🏨 住宿資訊</h3>
            <div class="space-y-4">
              <div v-for="hotel in travelInfo.hotels" :key="hotel.name" class="border-l-4 border-green-400 pl-4">
                <div class="font-semibold text-dark">{{ hotel.name }}</div>
                <div class="text-sm text-gray-600">{{ hotel.dates }}</div>
                <div class="space-y-1">
                  <button @click="openExternalLink(hotel.link)" class="text-sm text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer text-left">
                    查看飯店詳情 →
                  </button>
                  <div class="text-xs text-gray-500">
                    <span class="font-mono bg-white px-1 py-0.5 rounded text-xs">{{ hotel.link }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 費用估算 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-dark mb-4">💰 費用估算 (4人總計)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="cost in travelInfo.costs" :key="cost.item" class="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span class="text-sm">{{ cost.item }}</span>
              <span class="font-semibold text-primary">{{ cost.amount }}</span>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex justify-between items-center text-lg font-bold">
              <span>總計預估費用</span>
              <span class="text-primary">NT$ {{ (63317 + 23236 + 15978 + 15282 + 7144 + 6668).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Container (always in DOM) -->
      <div v-show="activeDay !== 'overview' && showMap && devSettings.enableMap" class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div id="map" class="h-96 w-full"></div>
      </div>

      <!-- Day Sections with Map -->
      <div v-if="activeDay !== 'overview'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-dark flex-1">{{ getCurrentDayTitle() }}</h2>
          <button
            v-if="devSettings.enableMap"
            @click="showMap = !showMap"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2 flex-shrink-0 w-32"
          >
            <span>🗺️</span>
            <span>{{ showMap ? '隱藏地圖' : '顯示地圖' }}</span>
          </button>
        </div>

        <!-- Itinerary Section -->
        <div class="space-y-4">
          <template v-for="(item, index) in getCurrentDayItinerary()" :key="index">
            <!-- Itinerary Card -->
            <div
              class="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              @click="openDetailModal(item)"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-tight px-1 text-center">
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

            <!-- Transport Indicator (between cards) -->
            <div 
              v-if="index < getCurrentDayItinerary().length - 1 && getCurrentDayItinerary()[index + 1].transport && getCurrentDayItinerary()[index + 1].transport !== '走路' && getCurrentDayItinerary()[index + 1].transport !== '飯店內'"
              class="flex items-center justify-center py-1"
            >
              <div class="flex items-center space-x-1.5 text-gray-600 text-xs bg-gray-50 px-2.5 py-1 rounded-full">
                <span class="text-sm">{{ getTransportIcon(getCurrentDayItinerary()[index + 1].transport) }}</span>
                <span class="font-medium">{{ getTransportText(getCurrentDayItinerary()[index + 1]) }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Detail Modal -->
      <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeDetailModal">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-2xl font-bold text-dark">{{ selectedItinerary?.title }}</h3>
              <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div class="space-y-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-lg mb-2">📅 時間</h4>
                <p>{{ selectedItinerary?.time }}</p>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-lg mb-2">📝 詳細描述</h4>
                <p>{{ selectedItinerary?.description }}</p>
              </div>

              <div v-if="selectedItinerary?.transport" class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-lg mb-2">🚄 交通方式</h4>
                <p>{{ selectedItinerary?.transport }}</p>
              </div>

              <div v-if="selectedItinerary?.duration" class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-lg mb-2">⏱️ 預計時間</h4>
                <p>{{ selectedItinerary?.duration }}</p>
              </div>

              <div v-if="selectedItinerary?.subway" class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-lg mb-2">🚇 地鐵/車站</h4>
                <p>{{ selectedItinerary?.subway }}</p>
              </div>

              <div v-if="selectedItinerary?.mustEat" class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 class="font-semibold text-lg mb-2 text-red-800">🍜 必吃美食</h4>
                <p class="whitespace-pre-line">{{ selectedItinerary?.mustEat }}</p>
              </div>

              <div v-if="selectedItinerary?.mustVisit" class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h4 class="font-semibold text-lg mb-2 text-purple-800">🎯 必玩景點</h4>
                <p class="whitespace-pre-line">{{ selectedItinerary?.mustVisit }}</p>
              </div>

              <div v-if="selectedItinerary?.mustBuy" class="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
                <h4 class="font-semibold text-lg mb-2 text-pink-800">🛍️ 必買伴手禮</h4>
                <p class="whitespace-pre-line">{{ selectedItinerary?.mustBuy }}</p>
              </div>

              <div v-if="selectedItinerary?.lunchOptions" class="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                <h4 class="font-semibold text-lg mb-2 text-orange-800">🍱 午餐推薦</h4>
                <p class="whitespace-pre-line">{{ selectedItinerary?.lunchOptions }}</p>
                <div v-if="selectedItinerary?.restaurants?.lunch" class="mt-3 space-y-2">
                  <div v-for="(restaurant, index) in selectedItinerary.restaurants.lunch" :key="index" class="bg-white p-2 rounded border border-orange-200">
                    <button 
                      @click="openGoogleMaps(restaurant.name, restaurant.location)"
                      class="text-orange-600 hover:text-orange-800 underline font-medium flex items-center space-x-1 bg-transparent border-none cursor-pointer text-left w-full"
                    >
                      <span>📍</span>
                      <span>{{ restaurant.name }}</span>
                    </button>
                    <div v-if="restaurant.note" class="text-xs text-gray-600 mt-1 ml-5">{{ restaurant.note }}</div>
                  </div>
                </div>
              </div>

              <div v-if="selectedItinerary?.dinnerOptions" class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                <h4 class="font-semibold text-lg mb-2 text-indigo-800">🍽️ 晚餐推薦</h4>
                <p class="whitespace-pre-line">{{ selectedItinerary?.dinnerOptions }}</p>
                <div v-if="selectedItinerary?.restaurants?.dinner" class="mt-3 space-y-2">
                  <div v-for="(restaurant, index) in selectedItinerary.restaurants.dinner" :key="index" class="bg-white p-2 rounded border border-indigo-200">
                    <button 
                      @click="openGoogleMaps(restaurant.name, restaurant.location)"
                      class="text-indigo-600 hover:text-indigo-800 underline font-medium flex items-center space-x-1 bg-transparent border-none cursor-pointer text-left w-full"
                    >
                      <span>📍</span>
                      <span>{{ restaurant.name }}</span>
                    </button>
                    <div v-if="restaurant.note" class="text-xs text-gray-600 mt-1 ml-5">{{ restaurant.note }}</div>
                  </div>
                </div>
              </div>

              <div v-if="selectedItinerary?.details?.japaneseInfo" class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-lg text-blue-800">🇯🇵 日文乘車資訊 (給司機看)</h4>
                  <button 
                    @click="speakJapanese(selectedItinerary.details.japaneseInfo)"
                    :class="[
                      'px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1',
                      isSpeaking 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    ]"
                  >
                    <span v-if="!isSpeaking">🔊</span>
                    <span v-else>⏸️</span>
                    <span>{{ isSpeaking ? '停止' : '播放' }}</span>
                  </button>
                </div>
                <div class="bg-white p-3 rounded border font-mono text-sm whitespace-pre-line">
                  {{ selectedItinerary.details.japaneseInfo }}
                </div>
                <div class="text-xs text-blue-600 mt-2">
                  💡 點擊「播放」按鈕可用日文語音朗讀給司機或服務人員聽
                </div>
              </div>

              <div v-if="selectedItinerary?.details?.notes" class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h4 class="font-semibold text-lg mb-2 text-yellow-800">📋 重要備註</h4>
                <p class="whitespace-pre-line">{{ selectedItinerary.details.notes }}</p>
              </div>

              <div v-if="selectedItinerary?.details?.kkdayLink" class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h4 class="font-semibold text-lg mb-2 text-green-800">🎫 KKday 行程連結</h4>
                <div class="space-y-2">
                  <button @click="openExternalLink(selectedItinerary.details.kkdayLink)" class="text-green-600 hover:text-green-800 underline cursor-pointer bg-transparent border-none text-left">
                    🔗 點擊前往KKday預訂頁面
                  </button>
                  <div class="text-xs text-gray-500 mt-1">
                    如果連結無法打開，請複製以下網址至瀏覽器：<br>
                    <span class="font-mono bg-white px-1 py-0.5 rounded">{{ selectedItinerary.details.kkdayLink }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weather Modal -->
      <div v-if="showWeatherModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showWeatherModal = false">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <span class="text-3xl mr-2">{{ currentWeather?.icon }}</span>
                <h3 class="text-2xl font-bold text-dark">{{ currentWeather?.location }}天氣</h3>
              </div>
              <button @click="showWeatherModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div v-if="currentWeather" class="space-y-4">
              <!-- 當前天氣 -->
              <div class="bg-white rounded-lg p-4 shadow-md">
                <div class="text-center">
                  <div class="text-5xl mb-2">{{ currentWeather.icon }}</div>
                  <div class="text-3xl font-bold text-dark mb-1">{{ currentWeather.temp }}</div>
                  <div class="text-gray-600">{{ currentWeather.description }}</div>
                </div>
              </div>

              <!-- 三天預報 -->
              <div class="space-y-2">
                <h4 class="text-sm font-semibold text-gray-700 px-2">未來三天預報</h4>
                <div 
                  v-for="day in currentWeather.forecast" 
                  :key="day.date"
                  class="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3">
                    <div class="text-2xl">{{ day.icon }}</div>
                    <div>
                      <div class="font-semibold text-gray-800">{{ day.date }}</div>
                      <div class="text-xs text-gray-600">{{ day.desc }}</div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-red-500 font-semibold">{{ day.high }}°</span>
                    <span class="text-gray-400">/</span>
                    <span class="text-blue-500">{{ day.low }}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 貓咪大戰爭行走動畫 - 基礎貓 -->
    <div class="cat-battle-walk">
      <div class="cat-battle-sprite">
        <div class="battle-cat-character"></div>
      </div>
    </div>

    <!-- 語音通話組件（根據開發者設定決定是否顯示）-->
    <VoiceCall 
      v-if="devSettings.enableVoiceCall" 
      ref="voiceCallRef"
    />

    <!-- 即時位置分享組件（根據開發者設定決定是否顯示）-->
    <LocationShare 
      v-if="devSettings.enableLocationShare"
      :isLocationEnabled="devSettings.enableLocationShare"
    />

    <!-- 開發者設定面板 -->
    <DevSettings 
      :show="showDevSettings" 
      @close="showDevSettings = false"
      @settings-changed="onSettingsChanged"
      @user-info-changed="onUserInfoChanged"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import VoiceCall from './components/VoiceCall.vue'
import DevSettings from './components/DevSettings.vue'
import LocationShare from './components/LocationShare.vue'

export default {
  name: 'App',
  components: {
    VoiceCall,
    DevSettings,
    LocationShare
  },
  setup() {
    const activeDay = ref('overview')
    const showMap = ref(false)
    
    // 開發者模式相關
    const showDevSettings = ref(false)
    const titleClickCount = ref(0)
    const titleClickTimer = ref(null)
    const devSettings = ref({
      enableVoiceCall: true,
      enableMap: true,
      enableLocationShare: false,
      enableDebugLog: false,
      enablePerformanceMonitor: false
    })
    const map = ref(null)
    
    // 語音播放相關
    const isSpeaking = ref(false)
    const speechSynthesis = window.speechSynthesis
    let currentUtterance = null
    const markers = ref([])
    const userMarker = ref(null)
    const selectedItinerary = ref(null)
    const showDetailModal = ref(false)
    const showWeatherModal = ref(false)
    const currentWeather = ref(null)

    const days = [
      { id: 'overview', label: '總覽', location: '台灣', coords: [25.0330, 121.5654] },
      { id: 'day1', label: 'Day 1 (五)', location: '京都', coords: [35.0116, 135.7681] },
      { id: 'day2', label: 'Day 2 (六)', location: '京都', coords: [35.0116, 135.7681] },
      { id: 'day3', label: 'Day 3 (日)', location: '關西', coords: [34.6937, 135.5023] },
      { id: 'day4', label: 'Day 4 (一)', location: '大阪', coords: [34.6937, 135.5023] },
      { id: 'day5', label: 'Day 5 (二)', location: '天橋立', coords: [35.5667, 135.1833] },
      { id: 'day6', label: 'Day 6 (三)', location: '大阪', coords: [34.6937, 135.5023] },
      { id: 'day7', label: 'Day 7 (四)', location: '關西機場', coords: [34.4320, 135.2304] }
    ]

    // 旅行資訊
    const travelInfo = {
      flights: [
        {
          date: '2026/01/16 (五)',
          airline: '星宇航空 JX822',
          departure: '09:20 桃園機場 T1',
          arrival: '12:50 關西機場 T1',
          duration: '2小時30分鐘'
        },
        {
          date: '2026/01/22 (四)',
          airline: '中華航空 CI153',
          departure: '14:30 關西機場 T1',
          arrival: '16:45 桃園機場 T2',
          duration: '3小時15分鐘'
        }
      ],
      hotels: [
        {
          name: 'Onyado Nono Kyoto Shichijo Natural Hot Spring',
          dates: '01/16~01/18 (住兩晚)',
          link: 'https://www.booking.com/hotel/jp/onyado-nono-kyoto-shichijo.zh-tw.html'
        },
        {
          name: 'KOKO HOTEL Osaka Namba Sennichimae',
          dates: '01/18~01/20 (住兩晚)',
          link: 'https://www.booking.com/hotel/jp/koko-osaka-namba-sennichimae.zh-tw.html'
        },
        {
          name: 'THE SINGULARI HOTEL & SKYSPA at UNIVERSAL STUDIOS JAPAN',
          dates: '01/20~01/22 (住兩晚)',
          link: 'https://www.booking.com/hotel/jp/singulari-hotel-skyspa-at-universal-studios-japan.zh-tw.html'
        }
      ],
      costs: [
        { item: '來回機票 x4人 (ezTravel訂購)', amount: 'NT$63,317' },
        { item: '住宿 Onyado Nono Kyoto Shichijo 兩晚', amount: 'NT$23,236' },
        { item: '住宿 KOKO HOTEL Osaka Namba 兩晚', amount: 'NT$15,978' },
        { item: '住宿 THE SINGULARI HOTEL 兩晚', amount: 'NT$15,282' },
        { item: 'KKDAY 天橋立一日遊 x4', amount: 'NT$7,144' },
        { item: 'KKDAY 京都奈良一日遊 x4', amount: 'NT$6,668' }
      ]
    }

    // 行程資料
    const itineraryData = {
      day1: [
        {
          time: '08:00-15:00',
          title: '機場移動至京都',
          description: '關西機場 → 京都車站 (JR HARUKA特急) → 飯店 Check-in',
          transport: 'JR HARUKA 特急電車 + 計程車 x2',
          location: '關西機場 → 京都車站 → Onyado Nono Kyoto Shichijo',
          duration: '約2.5小時',
          coordinates: [34.4320, 135.2304],
          subway: '關西機場站 → 京都車站 (JR HARUKA特急)',
          details: {
            japaneseInfo: '天然温泉 蓮花の湯 御宿 野乃 京都七条 までお願いします。\n(住所: 京都市下京区材木町491番地)',
            notes: '有3個大行李，建議分2台車',
            kkdayLink: null
          }
        },
        {
          time: '15:30-17:30',
          title: '京都車站周邊探險 (分流活動)',
          description: 'A組(長輩)：京都塔 | B組(小孩)：Yodobashi Camera 3F 玩具區',
          transport: '走路',
          location: '京都車站',
          duration: '約2小時',
          coordinates: [34.9854, 135.7581],
          details: {
            japaneseInfo: null,
            notes: '分流活動：A組京都塔(就在飯店對面)，B組玩具區(八條口方向)',
            kkdayLink: null
          }
        },
        {
          time: '18:00-20:00',
          title: '晚餐 - 東洋亭 (Porta 地下街店)',
          description: '百年洋食漢堡排 (鋁箔包)、整顆番茄沙拉',
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
            notes: '京都車站地下街美食，排隊人多建議提早',
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
          description: '飯店出發前往京都車站八條口 Avanti 前',
          transport: '計程車 x2',
          location: '京都車站八條口 Avanti',
          duration: '約30分鐘',
          coordinates: [34.9854, 135.7581],
          subway: '京都車站',
          details: {
            japaneseInfo: '京都駅八条口の「京都アバンティ（Avanti）」前までお願いします。',
            notes: '有3個大行李，務必叫2台車。KKday集合點',
            kkdayLink: 'https://www.kkday.com/zh-tw/product/25439'
          }
        },
        {
          time: '08:30-18:30',
          title: 'KKday 天橋立・伊根舟屋一日遊 (京都出發/大阪下車)',
          description: '伊根舟屋遊覽船餵海鷗、天橋立纜車看飛龍觀/昇龍觀',
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
            notes: '搭乘遊覽船餵海鷗(請自備蝦味先)、天橋立纜車看飛龍觀。午餐自理(文殊地區)，推薦花蛤丼',
            kkdayLink: 'https://www.kkday.com/zh-tw/product/25439'
          }
        },
        {
          time: '18:30-19:30',
          title: '抵達大阪・走路去飯店',
          description: '蟹道樂道頓堀東店下車 → 推行李步行至 KOKO HOTEL',
          transport: '走路',
          location: 'KOKO HOTEL Osaka Namba Sennichimae',
          duration: '約4分鐘 (300公尺)',
          coordinates: [34.6658, 135.5043],
          subway: '日本橋站附近',
          details: {
            japaneseInfo: null,
            notes: '步行約300公尺(4分鐘)，雖有行李但路程很短且平坦，不需叫車',
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
          time: '08:30-09:00',
          title: '前往集合地點',
          description: '走路前往蟹道樂道頓堀東店集合',
          transport: '走路',
          location: '大阪蟹道樂道頓堀東店',
          duration: '約4-6分鐘',
          coordinates: [34.6686, 135.5011],
          subway: '日本橋站附近',
          details: {
            japaneseInfo: '「かに道楽 道頓堀東店（ひがしてん）」の前までお願いします。\n(住所: 大阪市中央区道頓堀1-1-3)\n※日本橋駅の近く、堺筋沿いです。',
            notes: 'KKday嵐山奈良一日遊集合點，走路約4-6分鐘非常近',
            kkdayLink: 'https://www.kkday.com/zh-tw/product/270423'
          }
        },
        {
          time: '09:00-18:00',
          title: 'KKday 嵐山・奈良・伏見稻荷一日遊',
          description: '嵐山竹林、奈良餵鹿、伏見稻荷千本鳥居',
          transport: '觀光遊覽車',
          location: '嵐山 → 奈良 → 伏見稻荷',
          duration: '約9小時',
          coordinates: [35.0142, 135.7483],
          mustEat: '嵐山：中村屋可樂餅、% Arabica Coffee、Miffy Sakura Kitchen | 奈良：中谷堂麻糬、大佛布丁 | 伏見稻荷：稻荷壽司',
          mustVisit: '嵐山竹林、奈良餵鹿、伏見稻荷千本鳥居',
          details: {
            japaneseInfo: null,
            notes: '嵐山竹林+奈良餵鹿+伏見稻荷。必吃：中村屋可樂餅、中谷堂麻糬、大佛布丁',
            kkdayLink: 'https://www.kkday.com/zh-tw/product/270423'
          }
        },
        {
          time: '18:00-20:00',
          title: '返回飯店拿行李 & 移動至 USJ',
          description: '走路回 KOKO HOTEL 取行李，搭計程車到環球影城飯店',
          transport: '走路 + 計程車 x2',
          location: 'The Singulari Hotel & Skyspa',
          duration: '約2小時',
          coordinates: [34.6654, 135.4323],
          subway: 'ユニバーサルシティ駅',
          details: {
            japaneseInfo: 'ユニバーサルシティ駅の「ザ・シンギュラリホテル & スカイスパ」までお願いします。\n(住所: 大阪市此花区島屋6丁目2-25)',
            notes: '解散後走路回KOKO HOTEL(4分鐘)取行李，叫2台計程車(有行李)前往USJ飯店',
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
          description: '吃飽一點，樂園裡食物較貴且需排隊',
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
          description: '任天堂世界、哈利波特、小小兵等精彩設施',
          transport: '走路',
          location: '環球影城',
          duration: '約11.5小時',
          coordinates: [34.6654, 135.4323],
          subway: 'ユニバーサルシティ駅',
          mustEat: '奇諾比奧咖啡 (需抽號碼牌)、瑪利歐鬆餅三明治、奶油啤酒 (無酒精)、三根掃帚烤雞拼盤、小小兵夾心餅乾、火雞腿、吉拿棒',
          mustVisit: '超級任天堂世界、哈利波特魔法世界、小小兵樂園',
          details: {
            japaneseInfo: null,
            notes: '飯店就在車站樓上。必吃：奇諾比奧咖啡、奶油啤酒、三根掃帚烤雞、火雞腿',
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

    const getCurrentDayTitle = () => {
      const dayMap = {
        day1: 'Day 1 - 抵達京都・鐵道與溫泉放鬆',
        day2: 'Day 2 - 京都經典：清水寺・小豬療癒・祇園',
        day3: 'Day 3 - 海之京都：天橋立・伊根舟屋 (移動日)',
        day4: 'Day 4 - 大阪市區自由散策',
        day5: 'Day 5 - 古都巡禮：嵐山・奈良・伏見稻荷',
        day6: 'Day 6 - 大阪環球影城 (USJ)',
        day7: 'Day 7 - 輕鬆返台'
      }
      return dayMap[activeDay.value] || '行程總覽'
    }

    const getCurrentDayItinerary = () => {
      return itineraryData[activeDay.value] || []
    }

    const openDetailModal = (item) => {
      selectedItinerary.value = item
      showDetailModal.value = true
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedItinerary.value = null
    }

    const openExternalLink = (url) => {
      if (!url) return

      try {
        // 檢查是否在PWA模式
        const isPWA = window.navigator.standalone ||
                      window.matchMedia('(display-mode: standalone)').matches ||
                      window.matchMedia('(display-mode: fullscreen)').matches

        if (isPWA) {
          // PWA模式：嘗試多種方法打開外部連結
          let opened = false

          // 方法1: 使用window.open
          try {
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
            if (newWindow) {
              newWindow.focus()
              opened = true
            }
          } catch (e) {
            console.log('window.open failed:', e)
          }

          // 方法2: 如果失敗，使用location.href
          if (!opened) {
            try {
              window.location.href = url
              opened = true
            } catch (e) {
              console.log('location.href failed:', e)
            }
          }

          // 方法3: 如果都失敗，創建一個臨時的a標籤
          if (!opened) {
            const link = document.createElement('a')
            link.href = url
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        } else {
          // 普通瀏覽器模式
          window.open(url, '_blank', 'noopener,noreferrer')
        }
      } catch (error) {
        console.error('Failed to open external link:', error)
        // 最後的備用方案
        window.location.href = url
      }
    }

    // 打開 Google Maps 搜尋餐廳/店家位置
    const openGoogleMaps = (name, location) => {
      if (!name) return

      // 建立搜尋查詢字串: 店名 + 地點
      let searchQuery = name
      if (location) {
        searchQuery = `${name} ${location}`
      }

      // 編碼 URL 參數
      const encodedQuery = encodeURIComponent(searchQuery)
      
      // Google Maps 搜尋 URL
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`
      
      console.log('🗺️ 打開 Google Maps:', searchQuery)
      
      // 震動反饋（如果支援）
      if (navigator.vibrate) {
        navigator.vibrate(30)
      }

      // 使用現有的 openExternalLink 函數打開連結
      openExternalLink(googleMapsUrl)
    }

    const initializeMap = () => {
      if (map.value) {
        // 如果地圖已存在，確保它正確渲染
        nextTick(() => {
          map.value.invalidateSize()
        })
        return
      }

      // 修復Leaflet默認圖標路徑問題
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
      })

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

    onMounted(() => {
      // 初始化倒計時
      initializeCountdown()
      // 初始化天氣
      initializeWeather()
      
      // 防止 iOS 的手勢縮放（針對快速連點的情況）
      document.addEventListener('gesturestart', (e) => {
        e.preventDefault()
      })
      document.addEventListener('gesturechange', (e) => {
        e.preventDefault()
      })
      document.addEventListener('gestureend', (e) => {
        e.preventDefault()
      })
      
      // 防止雙擊縮放（額外的 JavaScript 層保護）
      // 但排除標題元素，允許連點開啟開發者面板
      let lastTouchEnd = 0
      document.addEventListener('touchend', (event) => {
        const now = Date.now()
        
        // 檢查是否點擊標題元素（允許連點）
        const target = event.target
        const isTitleClick = target.classList.contains('no-zoom-title') || 
                            target.closest('.no-zoom-title')
        
        // 如果不是標題，且是快速連續點擊，則阻止（防止縮放）
        if (!isTitleClick && now - lastTouchEnd <= 300) {
          event.preventDefault()
        }
        lastTouchEnd = now
      }, { passive: false })
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

    const updateWeather = async () => {
      const currentDay = days.find(day => day.id === activeDay.value)
      if (!currentDay || !currentDay.coords) {
        currentWeather.value = null
        return
      }

      try {
        // 使用 Open-Meteo API (免費且無需 API key)
        const [lat, lon] = currentDay.coords
        // 根據地點選擇時區
        const timezone = currentDay.id === 'overview' ? 'Asia/Taipei' : 'Asia/Tokyo'
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${timezone}&forecast_days=3`
        )
        const data = await response.json()

        // Weather code 到圖示和描述的映射
        const getWeatherInfo = (code) => {
          const weatherMap = {
            0: { icon: '☀️', desc: '晴天' },
            1: { icon: '🌤️', desc: '晴朗' },
            2: { icon: '⛅', desc: '多雲' },
            3: { icon: '☁️', desc: '陰天' },
            45: { icon: '🌫️', desc: '霧' },
            48: { icon: '🌫️', desc: '濃霧' },
            51: { icon: '🌦️', desc: '小雨' },
            53: { icon: '🌧️', desc: '中雨' },
            55: { icon: '🌧️', desc: '大雨' },
            61: { icon: '🌧️', desc: '小雨' },
            63: { icon: '🌧️', desc: '中雨' },
            65: { icon: '⛈️', desc: '大雨' },
            71: { icon: '🌨️', desc: '小雪' },
            73: { icon: '🌨️', desc: '中雪' },
            75: { icon: '❄️', desc: '大雪' },
            77: { icon: '🌨️', desc: '雪' },
            80: { icon: '🌦️', desc: '陣雨' },
            81: { icon: '🌧️', desc: '陣雨' },
            82: { icon: '⛈️', desc: '暴雨' },
            85: { icon: '🌨️', desc: '陣雪' },
            86: { icon: '❄️', desc: '暴雪' },
            95: { icon: '⛈️', desc: '雷雨' },
            96: { icon: '⛈️', desc: '雷雨冰雹' },
            99: { icon: '⛈️', desc: '強雷雨' }
          }
          return weatherMap[code] || { icon: '🌤️', desc: '未知' }
        }

        const currentWeatherInfo = getWeatherInfo(data.current.weather_code)
        
        currentWeather.value = {
          location: currentDay.location,
          temp: `${Math.round(data.current.temperature_2m)}°C`,
          icon: currentWeatherInfo.icon,
          description: currentWeatherInfo.desc,
          forecast: data.daily.time.slice(0, 3).map((date, index) => {
            const weatherInfo = getWeatherInfo(data.daily.weather_code[index])
            return {
              date: index === 0 ? '今天' : index === 1 ? '明天' : '後天',
              icon: weatherInfo.icon,
              desc: weatherInfo.desc,
              high: Math.round(data.daily.temperature_2m_max[index]),
              low: Math.round(data.daily.temperature_2m_min[index])
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error)
        // 使用預設天氣資料
        currentWeather.value = {
          location: currentDay.location,
          temp: '8°C',
          icon: '🌤️',
          description: '多雲',
          forecast: [
            { date: '今天', icon: '🌤️', desc: '多雲', high: 12, low: 5 },
            { date: '明天', icon: '☀️', desc: '晴天', high: 14, low: 6 },
            { date: '後天', icon: '⛅', desc: '多雲', high: 11, low: 4 }
          ]
        }
      }
    }

    const initializeWeather = () => {
      updateWeather()
    }

    // 監視 activeDay 的變化
    watch(activeDay, (newValue, oldValue) => {
      // 更新天氣
      updateWeather()
      
      // 如果從總覽切換到非總覽頁面且地圖應該顯示
      if (newValue !== 'overview' && oldValue === 'overview' && showMap.value) {
        nextTick(() => {
          setTimeout(() => {
            if (!map.value) {
              // 第一次顯示地圖，需要初始化
              initializeMap()
            } else {
              // 地圖已存在，只需調整大小並更新標記
              map.value.invalidateSize()
              updateMapMarkers()
            }
          }, 150)
        })
      }
      
      // 如果在不同 Day 之間切換且地圖正在顯示，更新地圖
      if (newValue !== 'overview' && oldValue !== 'overview' && showMap.value) {
        nextTick(() => {
          if (map.value) {
            setTimeout(() => {
              map.value.invalidateSize()
              updateMapMarkers()
            }, 100)
          }
        })
      }
    })

    // 監視 showMap 的變化（顯示/隱藏地圖按鈕）
    watch(showMap, (newValue) => {
      if (newValue && activeDay.value !== 'overview') {
        // 當地圖從隱藏變為顯示時
        nextTick(() => {
          if (!map.value) {
            initializeMap()
          } else {
            setTimeout(() => {
              map.value.invalidateSize()
              updateMapMarkers()
            }, 100)
          }
        })
      }
    })

    // 開發者模式：載入設定
    const loadDevSettings = () => {
      const saved = localStorage.getItem('devSettings')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          devSettings.value = { ...devSettings.value, ...parsed }
          console.log('📱 Dev settings loaded:', devSettings.value)
        } catch (error) {
          console.error('Failed to load dev settings:', error)
        }
      }
    }

    // 開發者模式：標題連點5次
    const handleTitleClick = (event) => {
      // 阻止事件冒泡，避免被其他處理器攔截
      if (event) {
        event.stopPropagation()
      }
      
      titleClickCount.value++
      console.log(`🔨 Title clicked ${titleClickCount.value} times`)
      
      // 清除之前的計時器
      if (titleClickTimer.value) {
        clearTimeout(titleClickTimer.value)
      }

      // 設定新的計時器（2秒內無動作則重置計數）
      titleClickTimer.value = setTimeout(() => {
        console.log('⏰ Timer reset')
        titleClickCount.value = 0
      }, 2000)

      // 每次點擊都給震動反饋（如果支援）
      if (navigator.vibrate) {
        navigator.vibrate(30)
      }

      // 如果點擊5次
      if (titleClickCount.value === 5) {
        titleClickCount.value = 0
        showDevSettings.value = true
        console.log('🛠️ Dev settings opened!')
        
        // 成功震動反饋（如果支援）
        if (navigator.vibrate) {
          navigator.vibrate([50, 100, 50])
        }
      } else if (titleClickCount.value === 3) {
        // 點擊3次時給個提示
        console.log(`🔨 再點 ${5 - titleClickCount.value} 次開啟開發者模式`)
      }
    }

    // 開發者模式：設定變更回調
    const onSettingsChanged = (newSettings) => {
      devSettings.value = newSettings
      console.log('⚙️ Settings changed:', newSettings)
      
      // 如果關閉了語音通話，提示需要重新載入
      if (!newSettings.enableVoiceCall) {
        console.log('📞 Voice call disabled - Firebase and PeerJS will not initialize')
      }
    }
    
    // 開發者模式：用戶資訊變更回調
    const onUserInfoChanged = (newUserInfo) => {
      console.log('👤 User info changed:', newUserInfo)
      // 用戶資訊已儲存在 localStorage，VoiceCall 和 LocationShare 會自動讀取
    }

    // 日文語音播放功能
    const speakJapanese = (text) => {
      if (!text) return

      // 如果正在播放，則停止
      if (isSpeaking.value) {
        speechSynthesis.cancel()
        isSpeaking.value = false
        currentUtterance = null
        return
      }

      try {
        // 創建語音合成實例
        const utterance = new SpeechSynthesisUtterance(text)
        currentUtterance = utterance

        // 設定為日文
        utterance.lang = 'ja-JP'
        
        // 設定語音參數
        utterance.rate = 0.9  // 語速稍慢一點，讓司機聽得更清楚
        utterance.pitch = 1.0 // 音調正常
        utterance.volume = 1.0 // 音量最大

        // 嘗試選擇日文語音（如果有的話）
        const voices = speechSynthesis.getVoices()
        const japaneseVoice = voices.find(voice => 
          voice.lang === 'ja-JP' || 
          voice.lang.startsWith('ja')
        )
        
        if (japaneseVoice) {
          utterance.voice = japaneseVoice
          console.log('🇯🇵 使用日文語音:', japaneseVoice.name)
        } else {
          console.log('⚠️ 未找到日文語音，使用系統預設語音')
        }

        // 播放開始事件
        utterance.onstart = () => {
          isSpeaking.value = true
          console.log('🔊 開始播放日文語音')
          
          // 震動反饋（如果支援）
          if (navigator.vibrate) {
            navigator.vibrate(50)
          }
        }

        // 播放結束事件
        utterance.onend = () => {
          isSpeaking.value = false
          currentUtterance = null
          console.log('✅ 日文語音播放完成')
        }

        // 播放錯誤事件
        utterance.onerror = (event) => {
          isSpeaking.value = false
          currentUtterance = null
          console.error('❌ 語音播放錯誤:', event.error)
          
          // 顯示錯誤提示
          alert(`語音播放失敗: ${event.error}\n請確認您的裝置支援語音播放功能`)
        }

        // 開始播放
        speechSynthesis.speak(utterance)

      } catch (error) {
        console.error('❌ 語音播放初始化失敗:', error)
        isSpeaking.value = false
        alert('語音播放功能初始化失敗，您的裝置可能不支援此功能')
      }
    }

    // 組件卸載時停止語音播放
    onUnmounted(() => {
      if (isSpeaking.value) {
        speechSynthesis.cancel()
        isSpeaking.value = false
      }
    })

    // 在組件掛載時載入設定
    onMounted(() => {
      loadDevSettings()
      
      // 載入語音列表（某些瀏覽器需要）
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
          const voices = speechSynthesis.getVoices()
          console.log('📢 可用語音:', voices.filter(v => v.lang.startsWith('ja')).map(v => v.name))
        })
      }

      // 確保貓咪動畫正確顯示
      nextTick(() => {
        const catElement = document.querySelector('.battle-cat-character')
        if (catElement) {
          // 使用 JavaScript 設置 emoji,避免編碼問題
          catElement.textContent = '🐈'
          console.log('✅ 貓咪大戰爭角色已載入')
        }
      })
    })

    // 獲取交通方式圖示
    const getTransportIcon = (transport) => {
      if (!transport) return ''
      
      const transportLower = transport.toLowerCase()
      
      if (transportLower.includes('計程車') || transportLower.includes('taxi')) return '🚖'
      if (transportLower.includes('jr') || transportLower.includes('電車') || transportLower.includes('特急')) return '🚄'
      if (transportLower.includes('巴士') || transportLower.includes('bus')) return '🚌'
      if (transportLower.includes('地鐵') || transportLower.includes('subway')) return '🚇'
      if (transportLower.includes('走路') || transportLower.includes('步行')) return '🚶'
      if (transportLower.includes('纜車')) return '🚡'
      if (transportLower.includes('船')) return '⛴️'
      
      return '🚗'
    }

    // 獲取交通方式簡化文字 (含站名資訊)
    const getTransportText = (nextItem) => {
      if (!nextItem || !nextItem.transport) return ''
      
      const transport = nextItem.transport
      
      // 地鐵：顯示站名資訊
      if (transport.includes('地鐵') && nextItem.subway) {
        // 提取終點站名
        const subwayInfo = nextItem.subway
        const stations = subwayInfo.split('→').map(s => s.trim())
        if (stations.length >= 2) {
          const endStation = stations[stations.length - 1].replace(/站$/, '')
          return `地鐵 → ${endStation}`
        }
        return '地鐵'
      }
      
      // JR/火車：顯示站名資訊
      if (transport.includes('JR') || transport.includes('電車') || transport.includes('特急')) {
        if (nextItem.subway) {
          const subwayInfo = nextItem.subway
          const stations = subwayInfo.split('→').map(s => s.trim())
          if (stations.length >= 2) {
            const endStation = stations[stations.length - 1].replace(/站$/, '')
            return `JR → ${endStation}`
          }
        }
        if (transport.includes('JR HARUKA')) {
          return nextItem.location ? `JR HARUKA → ${nextItem.location}` : 'JR HARUKA'
        }
        return transport.includes('JR') ? 'JR電車' : '電車'
      }
      
      // 計程車：顯示目的地
      if (transport.includes('計程車')) {
        const match = transport.match(/x(\d+)/)
        const taxiCount = match ? ` x${match[1]}` : ''
        return nextItem.location ? `計程車${taxiCount} → ${nextItem.location}` : `計程車${taxiCount}`
      }
      
      // 巴士
      if (transport.includes('巴士') || transport.includes('bus')) {
        return nextItem.location ? `巴士 → ${nextItem.location}` : '巴士'
      }
      
      // 纜車
      if (transport.includes('纜車')) {
        return nextItem.location ? `纜車 → ${nextItem.location}` : '纜車'
      }
      
      // 船
      if (transport.includes('船')) {
        return nextItem.location ? `觀光船 → ${nextItem.location}` : '觀光船'
      }
      
      // 如果太長，截斷
      return transport.length > 15 ? transport.substring(0, 15) + '...' : transport
    }

    return {
      activeDay,
      showMap,
      selectedItinerary,
      showDetailModal,
      showWeatherModal,
      travelInfo,
      days,
      getCurrentDayTitle,
      getCurrentDayItinerary,
      openDetailModal,
      closeDetailModal,
      openExternalLink,
      openGoogleMaps,
      currentWeather,
      // 開發者模式
      showDevSettings,
      devSettings,
      handleTitleClick,
      onSettingsChanged,
      onUserInfoChanged,
      // 日文語音播放
      isSpeaking,
      speakJapanese,
      // 交通方式
      getTransportIcon,
      getTransportText
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

/* 防止標題連點時縮放 */
.no-zoom-title {
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1) !important; /* 給一點回饋 */
  cursor: pointer;
  /* 確保點擊事件能正常觸發 */
  pointer-events: auto !important;
  /* 添加點擊區域 */
  padding: 4px 0;
  margin: -4px 0;
}

/* 地圖容器需要允許捏合縮放和拖曳 */
#map,
.leaflet-container {
  touch-action: pan-x pan-y pinch-zoom !important;
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
  background: #FFB7C5;  /* 櫻花粉色 */
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #FF9CAD;  /* 深櫻花粉 */
}

/* 可愛日本風按鈕效果 */
button, .nav-btn {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

button:hover:not(:disabled), .nav-btn:hover {
  transform: translateY(-2px);
}

button:active:not(:disabled), .nav-btn:active {
  transform: translateY(0);
}

/* 貓咪大戰爭動畫效果 */
@keyframes cat-battle-walk {
  0% { 
    left: -100px; 
  }
  100% { 
    left: calc(100% + 100px); 
  }
}

@keyframes cat-wiggle {
  0%, 100% { 
    transform: rotate(-3deg) scale(1); 
  }
  25% { 
    transform: rotate(3deg) scale(1.1); 
  }
  50% { 
    transform: rotate(-3deg) scale(1); 
  }
  75% { 
    transform: rotate(3deg) scale(0.95); 
  }
}

@keyframes sparkle-animation {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1) rotate(0deg); 
  }
  50% { 
    opacity: 0.4; 
    transform: scale(1.3) rotate(180deg); 
  }
}

.cat-battle-walk {
  position: fixed;
  bottom: 20px;
  animation: cat-battle-walk 25s linear infinite;
  z-index: 9999;
  pointer-events: none;
}

.cat-battle-sprite {
  animation: cat-wiggle 0.5s ease-in-out infinite;
}

.cat-decoration {
  display: inline-block;
  animation: cat-wiggle 2s ease-in-out infinite;
}

.sparkle {
  display: inline-block;
  animation: sparkle-animation 2s ease-in-out infinite;
}

/* 貓咪大戰爭角色樣式 */
.battle-cat-character {
  font-size: 48px;
  filter: drop-shadow(3px 3px 6px rgba(0,0,0,0.3));
  line-height: 1;
}

/* 測試用 - 確保動畫可見 */
.cat-battle-walk {
  background: rgba(255, 183, 197, 0.1);
  padding: 10px;
  border-radius: 50%;
}
</style>
