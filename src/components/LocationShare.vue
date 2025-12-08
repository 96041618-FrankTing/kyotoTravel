<template>
  <div v-if="isLocationEnabled" class="location-share-container">
    <!-- 浮動位置分享按鈕 -->
    <button
      v-if="!showLocationPanel"
      @click="showLocationPanel = true"
      class="floating-location-btn"
      :class="{ 'sharing': isSharingLocation, 'receiving': isReceivingLocation }"
    >
      <span v-if="isSharingLocation && isReceivingLocation">📍🔄</span>
      <span v-else-if="isSharingLocation">📍</span>
      <span v-else-if="isReceivingLocation">📍📥</span>
      <span v-else>📍</span>
    </button>

    <!-- 位置分享面板 -->
    <div v-if="showLocationPanel" class="location-panel">
      <div class="panel-header">
        <h3 class="panel-title">📍 即時位置分享</h3>
        <button @click="showLocationPanel = false" class="close-btn">&times;</button>
      </div>

      <div class="panel-content">
        <!-- 狀態顯示 -->
        <div class="status-section">
          <div class="status-item">
            <span class="status-icon">{{ isSharingLocation ? '🟢' : '🔴' }}</span>
            <span class="status-text">我的位置: {{ locationStatus }}</span>
          </div>
          <div v-if="partnerLocation" class="status-item">
            <span class="status-icon">🟢</span>
            <span class="status-text">對方位置: 已接收</span>
          </div>
        </div>

        <!-- 控制按鈕 -->
        <div class="control-section">
          <button 
            @click="toggleLocationSharing" 
            class="control-btn"
            :class="{ 'active': isSharingLocation }"
          >
            {{ isSharingLocation ? '🛑 停止分享' : '▶️ 開始分享' }}
          </button>
          
          <button 
            v-if="selectedContactForLocation"
            @click="disconnectLocation" 
            class="control-btn disconnect"
          >
            🔌 中斷連線
          </button>
        </div>

        <!-- 聯絡人選擇 -->
        <div class="contact-select-section">
          <label class="section-label">選擇分享對象：</label>
          <select v-model="selectedContactForLocation" @change="onContactSelected" class="contact-select">
            <option :value="null">-- 請選擇聯絡人 --</option>
            <option v-for="contact in contacts" :key="contact.id" :value="contact">
              {{ contact.emoji }} {{ contact.name }}
            </option>
          </select>
        </div>

        <!-- 地圖容器 -->
        <div class="map-container">
          <div id="location-map" ref="mapContainer"></div>
        </div>

        <!-- 座標資訊 -->
        <div v-if="myLocation" class="coord-info">
          <div class="coord-item">
            <span class="coord-label">我的座標:</span>
            <span class="coord-value">{{ myLocation.lat.toFixed(6) }}, {{ myLocation.lng.toFixed(6) }}</span>
          </div>
          <div v-if="partnerLocation" class="coord-item">
            <span class="coord-label">對方座標:</span>
            <span class="coord-value">{{ partnerLocation.lat.toFixed(6) }}, {{ partnerLocation.lng.toFixed(6) }}</span>
          </div>
          <div v-if="distance" class="coord-item">
            <span class="coord-label">距離:</span>
            <span class="coord-value">{{ distance }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Peer from 'peerjs'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'LocationShare',
  props: {
    isLocationEnabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // 狀態變數
    const showLocationPanel = ref(false)
    const isSharingLocation = ref(false)
    const isReceivingLocation = ref(false)
    const locationStatus = ref('未開始')
    const myLocation = ref(null)
    const partnerLocation = ref(null)
    const selectedContactForLocation = ref(null)
    
    // 地圖相關
    const mapContainer = ref(null)
    let map = null
    let myMarker = null
    let partnerMarker = null
    let watchId = null
    
    // PeerJS 相關
    const peer = ref(null)
    let dataConnection = ref(null)
    
    // 通訊錄
    const contacts = ref([])

    // 初始化 Peer（使用與 VoiceCall 相同的 ID）
    const initializePeer = () => {
      // 從 localStorage 讀取 VoiceCall 使用的 Peer ID
      const savedPeerId = localStorage.getItem('myPeerId')
      
      if (!savedPeerId) {
        console.error('❌ No Peer ID found. Please enable Voice Call first.')
        locationStatus.value = '請先啟用語音通話功能'
        return
      }

      console.log('📍 Initializing LocationShare with Peer ID:', savedPeerId)

      try {
        peer.value = new Peer(savedPeerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' }
            ]
          }
        })

        peer.value.on('open', (id) => {
          console.log('✅ LocationShare Peer connected with ID:', id)
        })

        peer.value.on('error', (err) => {
          console.error('❌ LocationShare Peer error:', err)
        })

        // 監聽來自對方的連線
        listenForIncomingConnections()

      } catch (error) {
        console.error('Failed to initialize peer:', error)
      }
    }

    // 載入通訊錄
    const loadContacts = () => {
      const saved = localStorage.getItem('voiceCallContacts')
      if (saved) {
        try {
          contacts.value = JSON.parse(saved)
        } catch (error) {
          console.error('Failed to load contacts:', error)
          contacts.value = []
        }
      }
    }

    // 計算距離
    const distance = computed(() => {
      if (!myLocation.value || !partnerLocation.value) return null
      
      const R = 6371e3 // 地球半徑（米）
      const φ1 = myLocation.value.lat * Math.PI / 180
      const φ2 = partnerLocation.value.lat * Math.PI / 180
      const Δφ = (partnerLocation.value.lat - myLocation.value.lat) * Math.PI / 180
      const Δλ = (partnerLocation.value.lng - myLocation.value.lng) * Math.PI / 180

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

      const d = R * c // 距離（米）
      
      if (d < 1000) {
        return `${d.toFixed(0)} 公尺`
      } else {
        return `${(d / 1000).toFixed(2)} 公里`
      }
    })

    // 初始化地圖
    const initializeMap = () => {
      if (map) return

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
        partnerMarker = null
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
          radius: 10,
          weight: 3
        }).addTo(map)
        myMarker.bindPopup('📍 我的位置').openPopup()
      }

      // 如果沒有對方位置，則將地圖中心設在自己位置
      if (!partnerLocation.value) {
        map.setView([lat, lng], 15)
      } else {
        // 如果有對方位置，調整視野包含雙方
        const bounds = L.latLngBounds([
          [lat, lng],
          [partnerLocation.value.lat, partnerLocation.value.lng]
        ])
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }

    // 更新對方位置 Marker
    const updatePartnerMarker = (lat, lng) => {
      if (!map) return

      if (partnerMarker) {
        partnerMarker.setLatLng([lat, lng])
      } else {
        // 使用紅色圓形 Marker
        partnerMarker = L.circleMarker([lat, lng], {
          color: '#ef4444',
          fillColor: '#f87171',
          fillOpacity: 0.8,
          radius: 10,
          weight: 3
        }).addTo(map)
        const name = selectedContactForLocation.value ? selectedContactForLocation.value.name : '對方'
        partnerMarker.bindPopup(`📍 ${name}的位置`).openPopup()
      }

      // 調整視野包含雙方
      if (myLocation.value) {
        const bounds = L.latLngBounds([
          [myLocation.value.lat, myLocation.value.lng],
          [lat, lng]
        ])
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }

    // 開始位置分享
    const startLocationSharing = () => {
      if (!navigator.geolocation) {
        alert('❌ 您的裝置不支援定位功能')
        return
      }

      console.log('📍 Starting location sharing...')
      locationStatus.value = '定位中...'

      // 開始監聽 GPS
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          myLocation.value = { lat, lng }
          locationStatus.value = '分享中'
          isSharingLocation.value = true

          console.log('📍 My location:', lat, lng)

          // 更新地圖
          if (map) {
            updateMyMarker(lat, lng)
          }

          // 如果有資料連線，發送位置
          if (dataConnection.value && dataConnection.value.open) {
            sendLocation(lat, lng)
          }
        },
        (error) => {
          console.error('GPS error:', error)
          locationStatus.value = '定位失敗'
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              alert('❌ 請允許瀏覽器存取您的位置')
              break
            case error.POSITION_UNAVAILABLE:
              alert('❌ 無法取得位置資訊')
              break
            case error.TIMEOUT:
              alert('❌ 定位逾時')
              break
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }

    // 停止位置分享
    const stopLocationSharing = () => {
      if (watchId !== null) {
        console.log('🛑 Stopping location sharing...')
        navigator.geolocation.clearWatch(watchId)
        watchId = null
        isSharingLocation.value = false
        locationStatus.value = '已停止'
      }
    }

    // 切換位置分享
    const toggleLocationSharing = () => {
      if (isSharingLocation.value) {
        stopLocationSharing()
      } else {
        startLocationSharing()
      }
    }

    // 建立資料連線
    const setupDataConnection = (peerId) => {
      if (!peer.value || !peerId) {
        console.error('❌ Peer or peerId not available')
        return
      }

      console.log('🔌 Setting up data connection to:', peerId)

      try {
        dataConnection.value = peer.value.connect(peerId, {
          reliable: true,
          serialization: 'json'
        })

        dataConnection.value.on('open', () => {
          console.log('✅ Data connection opened')
          
          // 如果正在分享位置，立即發送當前位置
          if (myLocation.value) {
            sendLocation(myLocation.value.lat, myLocation.value.lng)
          }
        })

        dataConnection.value.on('data', (data) => {
          console.log('📥 Received data:', data)
          
          if (data.type === 'location') {
            partnerLocation.value = { lat: data.lat, lng: data.lng }
            isReceivingLocation.value = true
            
            // 更新對方的 Marker
            if (map) {
              updatePartnerMarker(data.lat, data.lng)
            }
          }
        })

        dataConnection.value.on('close', () => {
          console.log('🔌 Data connection closed')
          isReceivingLocation.value = false
          partnerLocation.value = null
          if (partnerMarker && map) {
            map.removeLayer(partnerMarker)
            partnerMarker = null
          }
        })

        dataConnection.value.on('error', (err) => {
          console.error('❌ Data connection error:', err)
        })

      } catch (error) {
        console.error('Failed to setup data connection:', error)
      }
    }

    // 監聽來自對方的連線
    const listenForIncomingConnections = () => {
      if (!peer.value) return

      peer.value.on('connection', (conn) => {
        console.log('📥 Incoming data connection from:', conn.peer)
        
        dataConnection.value = conn

        conn.on('open', () => {
          console.log('✅ Incoming data connection opened')
          
          // 如果正在分享位置，立即發送當前位置
          if (myLocation.value) {
            sendLocation(myLocation.value.lat, myLocation.value.lng)
          }
        })

        conn.on('data', (data) => {
          console.log('📥 Received data:', data)
          
          if (data.type === 'location') {
            partnerLocation.value = { lat: data.lat, lng: data.lng }
            isReceivingLocation.value = true
            
            // 更新對方的 Marker
            if (map) {
              updatePartnerMarker(data.lat, data.lng)
            }
          }
        })

        conn.on('close', () => {
          console.log('🔌 Incoming data connection closed')
          isReceivingLocation.value = false
          partnerLocation.value = null
          if (partnerMarker && map) {
            map.removeLayer(partnerMarker)
            partnerMarker = null
          }
        })
      })
    }

    // 發送位置
    const sendLocation = (lat, lng) => {
      if (dataConnection.value && dataConnection.value.open) {
        const data = {
          type: 'location',
          lat: lat,
          lng: lng,
          timestamp: Date.now()
        }
        dataConnection.value.send(data)
        console.log('📤 Sent location:', data)
      }
    }

    // 聯絡人選擇變更
    const onContactSelected = () => {
      if (selectedContactForLocation.value) {
        console.log('Selected contact:', selectedContactForLocation.value)
        setupDataConnection(selectedContactForLocation.value.peerId)
      }
    }

    // 中斷連線
    const disconnectLocation = () => {
      if (dataConnection.value) {
        dataConnection.value.close()
        dataConnection.value = null
      }
      selectedContactForLocation.value = null
      isReceivingLocation.value = false
      partnerLocation.value = null
      
      if (partnerMarker && map) {
        map.removeLayer(partnerMarker)
        partnerMarker = null
      }
    }

    // 監聽 isLocationEnabled 變化
    watch(() => props.isLocationEnabled, (newVal) => {
      console.log('📍 Location enabled changed to:', newVal)
      
      if (newVal) {
        // 開啟位置分享功能
        loadContacts()
        initializePeer()
        
        // 等待面板顯示後初始化地圖
        if (showLocationPanel.value) {
          setTimeout(() => {
            initializeMap()
          }, 100)
        }
        
      } else {
        // 關閉位置分享功能
        stopLocationSharing()
        destroyMap()
        disconnectLocation()
        showLocationPanel.value = false
        
        // 銷毀 Peer 連線
        if (peer.value) {
          peer.value.destroy()
          peer.value = null
        }
      }
    })

    // 監聽面板顯示變化
    watch(showLocationPanel, (newVal) => {
      if (newVal && props.isLocationEnabled) {
        setTimeout(() => {
          initializeMap()
        }, 100)
      }
    })

    // 組件掛載
    onMounted(() => {
      if (props.isLocationEnabled) {
        loadContacts()
        initializePeer()
      }
    })

    // 組件卸載
    onUnmounted(() => {
      stopLocationSharing()
      destroyMap()
      if (dataConnection.value) {
        dataConnection.value.close()
      }
      if (peer.value) {
        peer.value.destroy()
      }
    })

    return {
      showLocationPanel,
      isSharingLocation,
      isReceivingLocation,
      locationStatus,
      myLocation,
      partnerLocation,
      selectedContactForLocation,
      contacts,
      distance,
      mapContainer,
      toggleLocationSharing,
      onContactSelected,
      disconnectLocation
    }
  }
}
</script>

<style scoped>
/* 浮動位置按鈕 */
.floating-location-btn {
  position: fixed;
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

.floating-location-btn.receiving {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
  width: 420px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 200px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.control-btn.disconnect {
  background: #fee2e2;
  border-color: #fecaca;
  color: #991b1b;
}

.control-btn.disconnect:hover {
  background: #fecaca;
}

/* 聯絡人選擇 */
.contact-select-section {
  margin-bottom: 16px;
}

.section-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.contact-select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.contact-select:focus {
  outline: none;
  border-color: #10b981;
}

/* 地圖容器 */
.map-container {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

#location-map {
  height: 300px;
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

/* 響應式設計 */
@media (max-width: 640px) {
  .location-panel {
    width: calc(100vw - 40px);
    max-height: calc(100vh - 180px);
  }

  .floating-location-btn {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  #location-map {
    height: 250px;
  }
}
</style>
