<template>
  <div v-if="isLocationEnabled" class="location-share-container">
    <!-- 浮動位置分享按鈕 -->
    <button
      v-if="!showLocationPanel"
      @click="showLocationPanel = true"
      class="floating-location-btn"
      :class="{ 'sharing': isSharingLocation, 'viewing': otherUsers.length > 0 }"
    >
      <span v-if="isSharingLocation && otherUsers.length > 0">📍👥</span>
      <span v-else-if="isSharingLocation">📍</span>
      <span v-else-if="otherUsers.length > 0">👁️</span>
      <span v-else>📍</span>
      <span v-if="otherUsers.length > 0" class="user-count-badge">{{ otherUsers.length }}</span>
    </button>

    <!-- 位置分享面板 -->
    <div v-show="showLocationPanel" class="location-panel">
      <div class="panel-header">
        <h3 class="panel-title">📍 團隊位置追蹤</h3>
        <button @click="showLocationPanel = false" class="close-btn">&times;</button>
      </div>

      <div class="panel-content">
        <!-- 狀態顯示 -->
        <div class="status-section">
          <div class="status-item">
            <span class="status-icon">{{ isSharingLocation ? '🟢' : '🔴' }}</span>
            <span class="status-text">我的位置: {{ locationStatus }}</span>
          </div>
          <div class="status-item">
            <span class="status-icon">👥</span>
            <span class="status-text">團隊成員: {{ otherUsers.length }} 人</span>
          </div>
          <div v-if="isSharingLocation" class="status-item">
            <span class="status-icon">⚡</span>
            <span class="status-text">更新頻率: 前景 30秒 / 背景快照 🔋</span>
          </div>
          <div v-if="backgroundFetchSupported && isSharingLocation" class="status-item">
            <span class="status-icon">�</span>
            <span class="status-text">背景同步: 已啟用 (15分鐘)</span>
          </div>
        </div>

        <!-- 控制按鈕 -->
        <div class="control-section">
          <button 
            @click="toggleLocationSharing" 
            class="control-btn"
            :class="{ 'active': isSharingLocation }"
          >
            {{ isSharingLocation ? '🛑 停止分享我的位置' : '▶️ 開始分享我的位置' }}
          </button>
        </div>

        <!-- 在線成員列表 -->
        <div v-if="otherUsers.length > 0" class="users-list-section">
          <label class="section-label">👥 團隊成員位置：</label>
          <div class="users-list">
            <div 
              v-for="user in otherUsers" 
              :key="user.id"
              class="user-item"
              :class="{ 'user-offline': user.statusInfo?.icon === '🔴' }"
              @click="centerMapOnUser(user)"
            >
              <span class="user-emoji">{{ user.emoji }}</span>
              <div class="user-info">
                <div class="user-name">
                  {{ user.name }}
                  <span 
                    class="user-status-badge" 
                    :style="{ backgroundColor: user.statusInfo?.color }"
                  >
                    {{ user.statusInfo?.icon }} {{ user.statusInfo?.text }}
                  </span>
                </div>
                <div class="user-distance" v-if="user.distance">📍 {{ user.distance }}</div>
              </div>
              <span class="user-time">{{ formatTimeAgo(user.timestamp) }}</span>
            </div>
          </div>
        </div>

        <!-- 地圖容器 -->
        <div class="map-container">
          <div id="location-map" ref="mapContainer"></div>
        </div>

        <!-- 詳細資訊 -->
        <div v-if="myLocation" class="coord-info">
          <div class="coord-item">
            <span class="coord-label">我的座標:</span>
            <span class="coord-value">{{ myLocation.lat.toFixed(6) }}, {{ myLocation.lng.toFixed(6) }}</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">精度:</span>
            <span class="coord-value">{{ myLocation.accuracy ? myLocation.accuracy.toFixed(0) + 'm' : 'N/A' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { database } from '../firebase.config'
import { ref as dbRef, set, onValue, remove, onDisconnect } from 'firebase/database'

export default {
  name: 'LocationShare',
  props: {
    isLocationEnabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // 更新頻率設定（方案 5 混合策略）
    const UPDATE_INTERVAL_FOREGROUND = 30000  // 前景：30秒（提升即時性）
    const UPDATE_INTERVAL_BACKGROUND = 180000 // 背景：180秒（3分鐘，實際上會被暫停）
    
    // 狀態變數
    const showLocationPanel = ref(false)
    const isSharingLocation = ref(false)
    const locationStatus = ref('未開始')
    const myLocation = ref(null)
    const otherUsers = ref([])
    const lastUpdateTime = ref(null)
    
    // 新增：追蹤模式狀態
    const trackingMode = ref('inactive') // 'inactive' | 'foreground' | 'background'
    const backgroundFetchSupported = ref(false)
    
    // 地圖相關
    const mapContainer = ref(null)
    let map = null
    let myMarker = null
    const userMarkers = {} // 儲存其他用戶的 marker
    let watchId = null
    let updateIntervalId = null
    let currentUpdateInterval = UPDATE_INTERVAL_FOREGROUND
    
    // 新增：上傳鎖（防止競態條件）
    let isUploading = false
    
    // 用戶資訊
    const myUserId = ref(null)
    const myUserInfo = ref(null)

    // 初始化 Firebase
    // 取得或創建位置分享用的用戶 ID
    const getOrCreateLocationUserId = () => {
      let userId = localStorage.getItem('myLocationUserId')
      
      if (userId) {
        console.log('📦 Found saved Location User ID:', userId)
        return userId
      }
      
      // 生成新的位置用戶 ID
      const timestamp = Date.now().toString(36)
      const random = Math.random().toString(36).substring(2, 9)
      userId = `loc-${timestamp}-${random}`
      
      localStorage.setItem('myLocationUserId', userId)
      console.log('🆕 Created new Location User ID:', userId)
      
      return userId
    }

    // 載入用戶資訊
    const loadUserInfo = () => {
      const userId = getOrCreateLocationUserId()
      const name = localStorage.getItem('myDisplayName') || '匿名用戶'
      const emoji = localStorage.getItem('myEmoji') || '👤'
      
      console.log('📱 LocationShare - Loading user info:', { userId, name, emoji })

      myUserId.value = userId
      myUserInfo.value = { id: userId, name, emoji }
      console.log('✅ LocationShare - User info loaded:', myUserInfo.value)
      return true
    }

    // 計算兩點間距離
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3 // 地球半徑（米）
      const φ1 = lat1 * Math.PI / 180
      const φ2 = lat2 * Math.PI / 180
      const Δφ = (lat2 - lat1) * Math.PI / 180
      const Δλ = (lng2 - lng1) * Math.PI / 180

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

      const d = R * c // 距離（米）
      
      if (d < 1000) {
        return `${d.toFixed(0)}m`
      } else {
        return `${(d / 1000).toFixed(2)}km`
      }
    }

    // 格式化時間
    const formatTimeAgo = (timestamp) => {
      if (!timestamp) return ''
      const now = Date.now()
      const diff = now - timestamp
      const seconds = Math.floor(diff / 1000)
      
      if (seconds < 60) return `${seconds}秒前`
      if (seconds < 3600) return `${Math.floor(seconds / 60)}分鐘前`
      return `${Math.floor(seconds / 3600)}小時前`
    }

    // ⭐ 方案 5 新增：獲取用戶狀態（即時/最近/離線）
    const getUserStatus = (user) => {
      if (!user || !user.timestamp) return { icon: '⚪', text: '未知', color: '#999' }

      const now = Date.now()
      const timeDiff = now - user.timestamp

      // 檢查用戶狀態標記
      if (user.status === 'stopped') {
        return { icon: '⏸️', text: '已停止', color: '#666' }
      }
      if (user.status === 'disconnected') {
        return { icon: '🔴', text: '已離線', color: '#ef4444' }
      }

      // 根據時間判斷
      if (timeDiff < 60000) {
        // 1分鐘內
        return { icon: '🟢', text: '即時', color: '#10b981' }
      } else if (timeDiff < 300000) {
        // 5分鐘內
        return { icon: '🟡', text: '最近', color: '#f59e0b' }
      } else if (timeDiff < 600000) {
        // 10分鐘內
        return { icon: '🟠', text: '稍早', color: '#f97316' }
      } else {
        // 超過10分鐘
        return { icon: '🔴', text: '離線', color: '#ef4444' }
      }
    }

    // 初始化地圖
    const initializeMap = () => {
      // 檢查地圖容器是否存在
      const mapContainer = document.getElementById('location-map')
      if (!mapContainer) {
        console.warn('⚠️ Map container not found')
        return
      }

      // 如果地圖已存在且正常，不需要重新初始化
      if (map && map.getContainer()) {
        console.log('ℹ️ Map already initialized')
        return
      }

      // 如果地圖物件存在但容器被移除，需要清理
      if (map) {
        console.log('🔄 Cleaning up old map instance...')
        try {
          map.remove()
        } catch (e) {
          console.warn('Map cleanup error:', e)
        }
        map = null
        myMarker = null
        Object.keys(userMarkers).forEach(key => delete userMarkers[key])
      }

      console.log('📍 Initializing map...')
      
      // 修正 Leaflet icon 路徑問題
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // 創建地圖
      map = L.map('location-map').setView([25.0330, 121.5654], 13)

      // 添加 OpenStreetMap 圖層
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)

      console.log('✅ Map initialized')
    }

    // 銷毀地圖
    const destroyMap = () => {
      if (map) {
        console.log('🗑️ Destroying map...')
        map.remove()
        map = null
        myMarker = null
        Object.keys(userMarkers).forEach(key => delete userMarkers[key])
      }
    }

    // 更新我的位置 Marker
    const updateMyMarker = (lat, lng) => {
      if (!map) return

      if (myMarker) {
        myMarker.setLatLng([lat, lng])
      } else {
        // 使用藍色圓形 Marker
        myMarker = L.circleMarker([lat, lng], {
          color: '#3b82f6',
          fillColor: '#60a5fa',
          fillOpacity: 0.8,
          radius: 12,
          weight: 3
        }).addTo(map)
        
        const popupContent = `<div style="text-align: center;">
          <div style="font-size: 20px;">${myUserInfo.value.emoji}</div>
          <div><strong>${myUserInfo.value.name}</strong></div>
          <div style="font-size: 12px; color: #666;">我的位置</div>
        </div>`
        myMarker.bindPopup(popupContent).openPopup()
        
        map.setView([lat, lng], 15)
      }
    }

    // 更新其他用戶 Marker
    const updateUserMarker = (user) => {
      if (!map || !user.lat || !user.lng) return

      const markerId = user.id
      
      if (userMarkers[markerId]) {
        // 更新現有 marker
        userMarkers[markerId].setLatLng([user.lat, user.lng])
      } else {
        // 創建新 marker（使用不同顏色）
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899']
        const colorIndex = Object.keys(userMarkers).length % colors.length
        
        userMarkers[markerId] = L.circleMarker([user.lat, user.lng], {
          color: colors[colorIndex],
          fillColor: colors[colorIndex],
          fillOpacity: 0.6,
          radius: 10,
          weight: 3
        }).addTo(map)
        
        const popupContent = `<div style="text-align: center;">
          <div style="font-size: 20px;">${user.emoji}</div>
          <div><strong>${user.name}</strong></div>
          <div style="font-size: 12px; color: #666;">${formatTimeAgo(user.timestamp)}</div>
        </div>`
        userMarkers[markerId].bindPopup(popupContent)
      }
    }

    // 移除用戶 Marker
    const removeUserMarker = (userId) => {
      if (userMarkers[userId]) {
        map.removeLayer(userMarkers[userId])
        delete userMarkers[userId]
      }
    }

    // 開始位置分享（方案 5：前景實時追蹤）
    const startLocationSharing = () => {
      if (!navigator.geolocation) {
        alert('您的瀏覽器不支援地理定位功能')
        return
      }

      locationStatus.value = '正在獲取位置...'
      trackingMode.value = 'foreground'
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }

      // 使用 watchPosition 持續監聽位置
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          
          myLocation.value = {
            lat: latitude,
            lng: longitude,
            accuracy: accuracy
          }

          locationStatus.value = trackingMode.value === 'foreground' ? '📡 實時分享中' : '🔋 背景模式'
          updateMyMarker(latitude, longitude)
          
          console.log('📍 My location:', latitude, longitude, 'Accuracy:', accuracy, 'Mode:', trackingMode.value)
        },
        (error) => {
          console.error('❌ Geolocation error:', error)
          locationStatus.value = '定位失敗'
          alert(`定位失敗: ${error.message}`)
        },
        options
      )

      // 前景模式：30秒更新一次（提升即時性）
      updateIntervalId = setInterval(() => {
        if (myLocation.value && database && myUserId.value) {
          uploadLocationToFirebase()
        }
      }, UPDATE_INTERVAL_FOREGROUND)

      // 立即上傳一次
      setTimeout(() => {
        if (myLocation.value) {
          uploadLocationToFirebase()
        }
      }, 2000)

      console.log('🚀 Location sharing started in foreground mode (30s interval)')
    }

    // 調整更新頻率（根據前景/背景狀態）
    const adjustUpdateInterval = (interval) => {
      if (!isSharingLocation.value) return
      
      // 清除舊的定時器
      if (updateIntervalId) {
        clearInterval(updateIntervalId)
      }
      
      // 設定新的定時器
      currentUpdateInterval = interval
      updateIntervalId = setInterval(() => {
        if (myLocation.value && database && myUserId.value) {
          uploadLocationToFirebase()
        }
      }, interval)
      
      console.log(`🔄 Update interval changed to ${interval / 1000}s`)
    }

    // 停止位置分享（方案 5：標記為停止而非刪除）
    const stopLocationSharing = async () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
        watchId = null
      }

      if (updateIntervalId) {
        clearInterval(updateIntervalId)
        updateIntervalId = null
      }

      trackingMode.value = 'inactive'

      // 標記為停止，而非刪除資料
      if (database && myUserId.value && myLocation.value) {
        const myLocationRef = dbRef(database, `locations/${myUserId.value}`)
        try {
          await set(myLocationRef, {
            id: myUserId.value,
            name: myUserInfo.value.name,
            emoji: myUserInfo.value.emoji,
            lat: myLocation.value.lat,
            lng: myLocation.value.lng,
            accuracy: myLocation.value.accuracy,
            timestamp: myLocation.value.timestamp || Date.now(),
            status: 'stopped',
            stoppedAt: Date.now()
          })
          console.log('🛑 Location sharing stopped, data marked as inactive')
        } catch (error) {
          console.error('❌ Failed to update stop status:', error)
        }
      }

      locationStatus.value = '未開始'
      console.log('🛑 Location sharing stopped')
    }

    // 上傳位置到 Firebase（方案 5：加入上傳鎖與狀態標記）
    const uploadLocationToFirebase = async () => {
      if (!myLocation.value || !database || !myUserId.value) return

      // 防止重複上傳（競態條件保護）
      if (isUploading) {
        console.log('⏳ Upload in progress, skipping...')
        return
      }

      isUploading = true

      try {
        const locationData = {
          id: myUserId.value,
          name: myUserInfo.value.name,
          emoji: myUserInfo.value.emoji,
          lat: myLocation.value.lat,
          lng: myLocation.value.lng,
          accuracy: myLocation.value.accuracy,
          timestamp: Date.now(),
          status: trackingMode.value, // 'foreground' | 'background' | 'inactive'
          updatedAt: Date.now()
        }

        const myLocationRef = dbRef(database, `locations/${myUserId.value}`)
        await set(myLocationRef, locationData)
        
        lastUpdateTime.value = Date.now()
        console.log(`✅ Location uploaded to Firebase (mode: ${trackingMode.value})`)

        // ⭐ 方案 5 核心改變：不自動刪除，改為標記離線狀態
        onDisconnect(myLocationRef).update({
          status: 'disconnected',
          disconnectedAt: Date.now()
        })
      } catch (error) {
        console.error('❌ Failed to upload location:', error)
      } finally {
        isUploading = false
      }
    }

    // 監聽所有用戶位置
    const listenToAllLocations = () => {
      console.log('🔍 listenToAllLocations() called')
      console.log('🔍 Database:', database)
      console.log('🔍 Database type:', typeof database)
      
      if (!database) {
        console.error('❌ Database not initialized!')
        return
      }

      console.log('👂 Starting to listen to all locations...')
      const locationsRef = dbRef(database, 'locations')
      console.log('👂 Locations reference created:', locationsRef)
      
      onValue(locationsRef, 
        // Success callback
        (snapshot) => {
          const data = snapshot.val()
          console.log('📍 Locations data received:', data)
          console.log('📍 Snapshot exists:', snapshot.exists())
        
        if (!data) {
          otherUsers.value = []
          console.log('📍 No locations data found')
          return
        }

        // 過濾掉自己，只顯示其他用戶
        const allUsers = Object.values(data)
        console.log('📍 All users:', allUsers)
        console.log('📍 My user ID:', myUserId.value)
        
        const users = allUsers.filter(user => user.id !== myUserId.value)
        
        // ⭐ 方案 5：計算距離並加入狀態資訊
        if (myLocation.value) {
          users.forEach(user => {
            user.distance = calculateDistance(
              myLocation.value.lat,
              myLocation.value.lng,
              user.lat,
              user.lng
            )
            // 加入狀態資訊
            user.statusInfo = getUserStatus(user)
          })
        } else {
          // 沒有我的位置時，仍然顯示狀態
          users.forEach(user => {
            user.statusInfo = getUserStatus(user)
          })
        }

        // 按狀態和時間排序（即時 > 最近 > 離線）
        users.sort((a, b) => {
          const statusOrder = { '🟢': 0, '🟡': 1, '🟠': 2, '🔴': 3, '⏸️': 4 }
          const orderA = statusOrder[a.statusInfo?.icon] ?? 5
          const orderB = statusOrder[b.statusInfo?.icon] ?? 5
          
          if (orderA !== orderB) return orderA - orderB
          return (b.timestamp || 0) - (a.timestamp || 0)
        })

        otherUsers.value = users
        console.log('👥 Filtered other users:', users)

        // 更新地圖上的 markers
        const currentUserIds = users.map(u => u.id)
        
        // 移除不再存在的用戶 marker
        Object.keys(userMarkers).forEach(userId => {
          if (!currentUserIds.includes(userId)) {
            removeUserMarker(userId)
          }
        })

        // 更新或添加用戶 marker
        users.forEach(user => {
          updateUserMarker(user)
        })

        console.log(`👥 ${users.length} other users online`)
        if (users.length === 0) {
          console.log('ℹ️ No other users found. Make sure other devices have started sharing.')
        }
      },
      // Error callback
      (error) => {
        console.error('❌ Error listening to locations:', error)
        console.error('❌ Error code:', error.code)
        console.error('❌ Error message:', error.message)
      })
    }

    // 點擊用戶，地圖移到該用戶位置
    const centerMapOnUser = (user) => {
      if (map && user.lat && user.lng) {
        map.setView([user.lat, user.lng], 16)
        if (userMarkers[user.id]) {
          userMarkers[user.id].openPopup()
        }
      }
    }

    // 切換位置分享
    const toggleLocationSharing = () => {
      if (isSharingLocation.value) {
        stopLocationSharing()
        isSharingLocation.value = false
      } else {
        if (!loadUserInfo()) {
          alert('請先在語音通話功能中設定個人資訊')
          return
        }
        startLocationSharing()
        isSharingLocation.value = true
      }
    }

    // 監聽 isLocationEnabled 變化
    watch(() => props.isLocationEnabled, (newVal) => {
      if (newVal) {
        loadUserInfo()
        // 延遲啟動監聽
        setTimeout(() => {
          listenToAllLocations()
        }, 500)
      } else {
        stopLocationSharing()
        destroyMap()
        showLocationPanel.value = false
        isSharingLocation.value = false
      }
    })

    // 監聽面板顯示變化
    watch(showLocationPanel, (newVal) => {
      if (newVal && props.isLocationEnabled) {
        // 延遲初始化以確保 DOM 已渲染
        setTimeout(() => {
          initializeMap()
          // 如果有當前位置，更新地圖
          if (myLocation.value) {
            updateMyMarker(myLocation.value.lat, myLocation.value.lng)
          }
          // 如果有其他用戶，更新他們的 marker
          if (otherUsers.value.length > 0) {
            otherUsers.value.forEach(user => {
              updateUserMarker(user)
            })
          }
        }, 100)
      }
    })

    // ⭐ 方案 1: 檢測 Background Fetch 支援
    const checkBackgroundFetchSupport = async () => {
      if ('serviceWorker' in navigator && 'BackgroundFetchManager' in self) {
        try {
          const registration = await navigator.serviceWorker.ready
          if (registration.backgroundFetch) {
            backgroundFetchSupported.value = true
            console.log('✅ Background Fetch API is supported')
            return true
          }
        } catch (error) {
          console.warn('⚠️ Background Fetch check error:', error)
        }
      }
      
      backgroundFetchSupported.value = false
      console.log('⚠️ Background Fetch API is NOT supported, falling back to foreground-only mode')
      return false
    }

    // ⭐ 方案 1: 註冊 Background Fetch（背景位置同步）
    const registerBackgroundFetch = async () => {
      if (!backgroundFetchSupported.value || !myLocation.value || !myUserId.value) {
        return
      }

      try {
        const registration = await navigator.serviceWorker.ready
        
        // 準備要上傳的位置資料
        const locationData = {
          id: myUserId.value,
          name: myUserInfo.value.name,
          emoji: myUserInfo.value.emoji,
          lat: myLocation.value.lat,
          lng: myLocation.value.lng,
          accuracy: myLocation.value.accuracy,
          timestamp: Date.now(),
          status: 'background-fetch',
          fetchedAt: Date.now()
        }

        // Firebase REST API endpoint
        const firebaseUrl = `https://kyoto-travel-2026-default-rtdb.firebaseio.com/locations/${myUserId.value}.json`

        // 註冊 Background Fetch
        const bgFetch = await registration.backgroundFetch.fetch(
          `location-sync-${Date.now()}`, // 唯一 ID
          [firebaseUrl], // 要請求的 URL
          {
            title: '📍 位置同步中',
            icons: [{ src: '/kyotoTravel/icon-192.png', sizes: '192x192', type: 'image/png' }],
            downloadTotal: 2048, // 預估傳輸量（bytes）
          }
        )

        console.log('🔄 Background Fetch registered:', bgFetch.id)

        // 監聽進度
        bgFetch.addEventListener('progress', () => {
          console.log(`📊 Background Fetch progress: ${bgFetch.downloaded}/${bgFetch.downloadTotal}`)
        })

      } catch (error) {
        console.error('❌ Background Fetch registration failed:', error)
      }
    }

    // 監聽來自 Service Worker 的訊息
    const setupServiceWorkerListener = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'BACKGROUND_FETCH_SUCCESS') {
            console.log('✅ Background fetch completed:', event.data)
            // 可以更新 UI 或重新載入資料
          } else if (event.data.type === 'BACKGROUND_FETCH_FAILED') {
            console.error('❌ Background fetch failed:', event.data)
          } else if (event.data.type === 'BACKGROUND_FETCH_ABORTED') {
            console.warn('⚠️ Background fetch aborted:', event.data)
          }
        })
      }
    }

    // 組件掛載
    onMounted(async () => {
      console.log('🔧 LocationShare mounted, isLocationEnabled:', props.isLocationEnabled)
      console.log('🔧 Database object:', database)
      
      // ⭐ 方案 1: 檢測 Background Fetch 支援
      await checkBackgroundFetchSupport()
      setupServiceWorkerListener()
      
      if (props.isLocationEnabled) {
        console.log('✅ Location enabled, loading user info...')
        loadUserInfo()
        
        // 延遲啟動監聽，確保 database 完全就緒
        console.log('✅ Starting to listen to all locations (with 500ms delay)...')
        setTimeout(() => {
          console.log('⏰ Delay completed, now calling listenToAllLocations...')
          listenToAllLocations()
        }, 500)
      } else {
        console.log('⚠️ Location sharing is disabled in props')
      }

      // ⭐ 方案 5 核心：監聽頁面可見性變化（前景/背景切換）
      const handleVisibilityChange = () => {
        if (!isSharingLocation.value) return

        if (document.hidden) {
          // 📱 切換到背景：立即上傳快照
          console.log('📱 App switching to background, capturing snapshot...')
          trackingMode.value = 'background'
          
          if (myLocation.value && database && myUserId.value) {
            uploadLocationToFirebase() // 立即上傳當前位置
            console.log('📸 Background snapshot captured')
            
            // ⭐ 方案 1: 如果支援 Background Fetch，註冊背景同步
            if (backgroundFetchSupported.value) {
              setTimeout(() => {
                registerBackgroundFetch()
                console.log('🔄 Background Fetch registered for periodic sync')
              }, 2000) // 延遲 2 秒避免與立即快照衝突
            }
          }

          // 降低更新頻率（實際上會被 iOS 暫停）
          adjustUpdateInterval(UPDATE_INTERVAL_BACKGROUND)
          locationStatus.value = backgroundFetchSupported.value ? '🔄 背景同步中' : '🔋 背景模式'
        } else {
          // 📱 返回前景：恢復實時追蹤
          console.log('📱 App returning to foreground, resuming real-time tracking...')
          trackingMode.value = 'foreground'
          
          // 立即上傳一次以通知其他用戶
          if (myLocation.value && database && myUserId.value) {
            uploadLocationToFirebase()
            console.log('✅ Foreground resumed, location updated')
          }

          // 恢復高頻更新
          adjustUpdateInterval(UPDATE_INTERVAL_FOREGROUND)
          locationStatus.value = '📡 實時分享中'
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)

      // ⭐ 方案 5 新增：pagehide 事件（頁面關閉前最後快照）
      const handlePageHide = (event) => {
        if (!isSharingLocation.value || !myLocation.value) return

        console.log('🚪 Page hiding, sending final beacon...')

        // 使用 sendBeacon 確保資料能送出（即使頁面關閉）
        const data = JSON.stringify({
          id: myUserId.value,
          name: myUserInfo.value.name,
          emoji: myUserInfo.value.emoji,
          lat: myLocation.value.lat,
          lng: myLocation.value.lng,
          accuracy: myLocation.value.accuracy,
          timestamp: Date.now(),
          status: 'pagehide',
          pagehideAt: Date.now()
        })

        // Firebase Realtime Database 使用 REST API
        const firebaseUrl = `https://kyoto-travel-2026-default-rtdb.firebaseio.com/locations/${myUserId.value}.json`
        
        try {
          navigator.sendBeacon(firebaseUrl, data)
          console.log('📤 Beacon sent successfully')
        } catch (error) {
          console.error('❌ Beacon send failed:', error)
        }
      }

      window.addEventListener('pagehide', handlePageHide)

      // 組件卸載時移除監聽
      onUnmounted(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('pagehide', handlePageHide)
      })
    })

    // 組件卸載
    onUnmounted(() => {
      stopLocationSharing()
      destroyMap()
    })

    return {
      showLocationPanel,
      isSharingLocation,
      locationStatus,
      myLocation,
      otherUsers,
      lastUpdateTime,
      mapContainer,
      toggleLocationSharing,
      centerMapOnUser,
      formatTimeAgo,
      trackingMode,
      backgroundFetchSupported,
      getUserStatus
    }
  }
}
</script>

<style scoped>
/* 浮動位置按鈕 */
.floating-location-btn {
  position: fixed !important;  /* 強制固定定位，確保不被覆蓋 */
  bottom: 100px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 999;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-location-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.floating-location-btn.sharing {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  animation: pulse-location 2s infinite;
}

.floating-location-btn.viewing {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.user-count-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

@keyframes pulse-location {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
  }
}

/* 位置面板 */
.location-panel {
  position: fixed;
  bottom: 170px;
  right: 20px;
  width: 500px; /* 從 420px 增加到 500px，更寬的面板 */
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 200px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* 確保在 iPhone 上不會超出螢幕 */
  top: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.panel-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 狀態區域 */
.status-section {
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.status-icon {
  font-size: 16px;
}

/* 控制區域 */
.control-section {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.control-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  border-color: #10b981;
  background: #f0fdf4;
}

.control-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
}

/* 用戶列表 */
.users-list-section {
  margin-bottom: 16px;
}

.section-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.users-list {
  max-height: 150px;
  overflow-y: auto;
  background: #f9fafb;
  border-radius: 8px;
  padding: 4px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: white;
  border-radius: 6px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-item:hover {
  background: #e0f2fe;
  transform: translateX(2px);
}

.user-item.user-offline {
  opacity: 0.6;
}

.user-emoji {
  font-size: 24px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.user-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  color: white;
  gap: 2px;
}

.user-distance {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.user-time {
  font-size: 11px;
  color: #9ca3af;
}

/* 地圖容器 */
.map-container {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

#location-map {
  height: 450px; /* 桌面版：從 300px 增加到 450px */
  width: 100%;
  /* 允許地圖捏合縮放和拖曳 */
  touch-action: pan-x pan-y pinch-zoom !important;
}

/* Leaflet 地圖容器也需要支援觸控操作 */
#location-map .leaflet-container {
  touch-action: pan-x pan-y pinch-zoom !important;
}

/* 座標資訊 */
.coord-info {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
}

.coord-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.coord-item:last-child {
  margin-bottom: 0;
}

.coord-label {
  color: #6b7280;
  font-weight: 600;
}

.coord-value {
  color: #1f2937;
  font-family: monospace;
}

/* 響應式設計 - iPhone 優化 */
@media (max-width: 640px) {
  .location-panel {
    /* 全螢幕顯示，從安全區域開始 */
    top: env(safe-area-inset-top, 20px);
    bottom: env(safe-area-inset-bottom, 80px);
    left: 10px;
    right: 10px;
    width: auto;
    max-width: none;
    max-height: none;
    border-radius: 20px;
  }

  .panel-header {
    padding: 12px 16px;
    /* 確保關閉按鈕在安全區域內 */
    padding-top: max(12px, env(safe-area-inset-top, 12px));
  }

  .panel-title {
    font-size: 16px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 28px;
    /* 增加點擊區域 */
    padding: 8px;
  }

  .panel-content {
    padding: 12px;
    /* 優化滾動體驗 */
    -webkit-overflow-scrolling: touch;
  }

  /* 壓縮狀態區域 */
  .status-section {
    margin-bottom: 10px;
  }

  .status-item {
    padding: 6px 10px;
    margin-bottom: 6px;
    font-size: 13px;
  }

  .status-icon {
    font-size: 14px;
  }

  /* 壓縮控制按鈕 */
  .control-section {
    margin-bottom: 10px;
  }

  .control-btn {
    padding: 10px;
    font-size: 13px;
  }

  /* 放大地圖！ */
  #location-map {
    height: 50vh; /* 使用 50% 螢幕高度 */
    min-height: 300px;
  }

  .map-container {
    margin-bottom: 10px;
  }

  /* 壓縮用戶列表 */
  .users-section {
    /* 讓用戶列表可滾動但不佔太多空間 */
    max-height: 25vh;
    overflow-y: auto;
  }

  .user-item {
    padding: 8px 10px;
    margin-bottom: 6px;
  }

  .user-emoji {
    font-size: 20px;
  }

  .user-name {
    font-size: 13px;
  }

  .user-distance {
    font-size: 11px;
  }

  .user-time {
    font-size: 10px;
  }

  .floating-location-btn {
    width: 56px;
    height: 56px;
    font-size: 24px;
    bottom: env(safe-area-inset-bottom, 80px);
  }
}
</style>
