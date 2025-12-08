<template>
  <div class="voice-call-container">
    <!-- 浮動通話按鈕 -->
    <button
      v-if="!showPanel"
      @click="showPanel = true"
      class="floating-call-btn"
      :class="{ 'calling': isCallActive }"
    >
      <span v-if="!isCallActive">📞</span>
      <span v-else class="pulse">📞</span>
    </button>

    <!-- 通話面板 -->
    <div v-if="showPanel" class="call-panel">
      <div class="panel-header">
        <h3 class="panel-title">🎙️ 語音通話</h3>
        <button @click="showPanel = false" class="close-btn">&times;</button>
      </div>

      <div class="panel-content">
        <!-- 我的 ID -->
        <div class="id-section">
          <label class="label">我的 ID</label>
          <div class="id-display">
            <input 
              type="text" 
              :value="myPeerId || '載入中...'" 
              readonly 
              class="id-input"
            />
            <button 
              v-if="myPeerId" 
              @click="copyMyId" 
              class="copy-btn"
              title="複製 ID"
            >
              📋
            </button>
          </div>
        </div>

        <!-- 對方 ID -->
        <div class="id-section">
          <label class="label">對方 ID</label>
          <input
            v-model="partnerId"
            type="text"
            placeholder="輸入對方的 ID"
            :disabled="isCallActive"
            class="partner-input"
          />
        </div>

        <!-- 狀態顯示 -->
        <div class="status-display" :class="statusClass">
          <span class="status-icon">{{ statusIcon }}</span>
          <span>{{ callStatus }}</span>
        </div>

        <!-- 控制按鈕 -->
        <div class="button-group">
          <button
            v-if="!isCallActive"
            @click="makeCall"
            :disabled="!myPeerId || !partnerId || isConnecting"
            class="call-btn primary"
          >
            📞 撥打
          </button>
          <button
            v-else
            @click="endCall"
            class="call-btn danger"
          >
            ❌ 掛斷
          </button>
        </div>

        <!-- 來電提示 -->
        <div v-if="incomingCall && !isCallActive" class="incoming-call">
          <p class="incoming-text">📞 收到來電...</p>
          <div class="incoming-buttons">
            <button @click="answerCall" class="answer-btn">✅ 接聽</button>
            <button @click="rejectCall" class="reject-btn">❌ 拒絕</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 隱藏的音訊元素 -->
    <audio ref="remoteAudio" autoplay></audio>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Peer from 'peerjs'

export default {
  name: 'VoiceCall',
  setup() {
    // 狀態變數
    const showPanel = ref(false)
    const myPeerId = ref('')
    const partnerId = ref('')
    const callStatus = ref('等待初始化...')
    const isCallActive = ref(false)
    const isConnecting = ref(false)
    const incomingCall = ref(null)
    
    // Peer 和通話相關
    const peer = ref(null)
    const currentCall = ref(null)
    const localStream = ref(null)
    const remoteAudio = ref(null)
    const wakeLock = ref(null)

    // 計算屬性
    const statusClass = computed(() => {
      if (isCallActive.value) return 'status-active'
      if (isConnecting.value) return 'status-connecting'
      if (incomingCall.value) return 'status-incoming'
      return 'status-idle'
    })

    const statusIcon = computed(() => {
      if (isCallActive.value) return '🟢'
      if (isConnecting.value) return '🟡'
      if (incomingCall.value) return '🔔'
      return '⚪'
    })

    // 初始化 Peer
    const initializePeer = () => {
      try {
        // 使用 Google 免費 STUN Server
        peer.value = new Peer({
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' }
            ]
          }
        })

        // 監聽 Peer 開啟事件
        peer.value.on('open', (id) => {
          myPeerId.value = id
          callStatus.value = '就緒 - 可以撥打或接聽'
          console.log('My Peer ID:', id)
        })

        // 監聽來電
        peer.value.on('call', (call) => {
          console.log('Incoming call from:', call.peer)
          incomingCall.value = call
          callStatus.value = '有來電...'
        })

        // 監聽錯誤
        peer.value.on('error', (err) => {
          console.error('Peer error:', err)
          callStatus.value = `錯誤: ${err.type}`
        })

        // 監聽斷線
        peer.value.on('disconnected', () => {
          callStatus.value = '連線中斷'
          console.log('Peer disconnected')
        })

      } catch (error) {
        console.error('Failed to initialize Peer:', error)
        callStatus.value = '初始化失敗'
      }
    }

    // 取得麥克風權限
    const getMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: false
        })
        localStream.value = stream
        return stream
      } catch (error) {
        console.error('Failed to get microphone:', error)
        callStatus.value = '無法取得麥克風權限'
        throw error
      }
    }

    // 請求 Wake Lock
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock.value = await navigator.wakeLock.request('screen')
          console.log('Wake Lock acquired')
          
          wakeLock.value.addEventListener('release', () => {
            console.log('Wake Lock released')
          })
        }
      } catch (error) {
        console.error('Wake Lock error:', error)
      }
    }

    // 釋放 Wake Lock
    const releaseWakeLock = async () => {
      if (wakeLock.value) {
        try {
          await wakeLock.value.release()
          wakeLock.value = null
        } catch (error) {
          console.error('Failed to release Wake Lock:', error)
        }
      }
    }

    // 撥打電話
    const makeCall = async () => {
      if (!partnerId.value || !peer.value) {
        callStatus.value = '請輸入對方 ID'
        return
      }

      try {
        isConnecting.value = true
        callStatus.value = '正在連線...'

        // 取得麥克風
        const stream = await getMicrophone()

        // 撥打電話
        const call = peer.value.call(partnerId.value, stream)
        currentCall.value = call

        // 監聽對方的音訊流
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream')
          if (remoteAudio.value) {
            remoteAudio.value.srcObject = remoteStream
          }
          isConnecting.value = false
          isCallActive.value = true
          callStatus.value = '通話中...'
          
          // 請求 Wake Lock
          requestWakeLock()
        })

        // 監聽通話結束
        call.on('close', () => {
          console.log('Call closed')
          endCall()
        })

        call.on('error', (err) => {
          console.error('Call error:', err)
          callStatus.value = '通話錯誤'
          endCall()
        })

      } catch (error) {
        console.error('Failed to make call:', error)
        isConnecting.value = false
        callStatus.value = '撥打失敗'
      }
    }

    // 接聽電話
    const answerCall = async () => {
      if (!incomingCall.value) return

      try {
        callStatus.value = '接聽中...'

        // 取得麥克風
        const stream = await getMicrophone()

        // 接聽電話
        const call = incomingCall.value
        call.answer(stream)
        currentCall.value = call

        // 監聽對方的音訊流
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream')
          if (remoteAudio.value) {
            remoteAudio.value.srcObject = remoteStream
          }
          isCallActive.value = true
          callStatus.value = '通話中...'
          incomingCall.value = null
          
          // 請求 Wake Lock
          requestWakeLock()
        })

        // 監聽通話結束
        call.on('close', () => {
          console.log('Call closed')
          endCall()
        })

        call.on('error', (err) => {
          console.error('Call error:', err)
          callStatus.value = '通話錯誤'
          endCall()
        })

      } catch (error) {
        console.error('Failed to answer call:', error)
        callStatus.value = '接聽失敗'
        incomingCall.value = null
      }
    }

    // 拒絕來電
    const rejectCall = () => {
      if (incomingCall.value) {
        incomingCall.value.close()
        incomingCall.value = null
        callStatus.value = '已拒絕來電'
      }
    }

    // 結束通話
    const endCall = () => {
      // 關閉通話
      if (currentCall.value) {
        currentCall.value.close()
        currentCall.value = null
      }

      // 停止本地音訊流
      if (localStream.value) {
        localStream.value.getTracks().forEach(track => track.stop())
        localStream.value = null
      }

      // 清除遠端音訊
      if (remoteAudio.value) {
        remoteAudio.value.srcObject = null
      }

      // 釋放 Wake Lock
      releaseWakeLock()

      // 重置狀態
      isCallActive.value = false
      isConnecting.value = false
      incomingCall.value = null
      callStatus.value = '通話已結束'

      setTimeout(() => {
        if (!isCallActive.value) {
          callStatus.value = '就緒 - 可以撥打或接聽'
        }
      }, 2000)
    }

    // 複製我的 ID
    const copyMyId = async () => {
      try {
        await navigator.clipboard.writeText(myPeerId.value)
        const originalStatus = callStatus.value
        callStatus.value = '✅ ID 已複製'
        setTimeout(() => {
          callStatus.value = originalStatus
        }, 2000)
      } catch (error) {
        console.error('Failed to copy ID:', error)
      }
    }

    // 生命週期
    onMounted(() => {
      initializePeer()
    })

    onUnmounted(() => {
      endCall()
      if (peer.value) {
        peer.value.destroy()
      }
    })

    return {
      showPanel,
      myPeerId,
      partnerId,
      callStatus,
      isCallActive,
      isConnecting,
      incomingCall,
      remoteAudio,
      statusClass,
      statusIcon,
      makeCall,
      answerCall,
      rejectCall,
      endCall,
      copyMyId
    }
  }
}
</script>

<style scoped>
/* 浮動通話按鈕 */
.floating-call-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-call-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.floating-call-btn.calling {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation: pulse-ring 1.5s infinite;
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 87, 108, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(245, 87, 108, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 87, 108, 0);
  }
}

.pulse {
  animation: pulse-icon 1s infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 通話面板 */
.call-panel {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 340px;
  max-width: calc(100vw - 40px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.panel-content {
  padding: 20px;
}

/* ID 區域 */
.id-section {
  margin-bottom: 16px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.id-display {
  display: flex;
  gap: 8px;
}

.id-input,
.partner-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
  transition: border-color 0.2s;
}

.id-input {
  background: #f9fafb;
  color: #6b7280;
}

.partner-input:focus {
  outline: none;
  border-color: #667eea;
}

.partner-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.copy-btn {
  padding: 10px 12px;
  background: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #5568d3;
  transform: scale(1.05);
}

.copy-btn:active {
  transform: scale(0.95);
}

/* 狀態顯示 */
.status-display {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.status-idle {
  background: #f3f4f6;
  color: #6b7280;
}

.status-connecting {
  background: #fef3c7;
  color: #92400e;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-incoming {
  background: #dbeafe;
  color: #1e40af;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.status-icon {
  font-size: 16px;
}

/* 按鈕 */
.button-group {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.call-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.call-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.call-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.call-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.call-btn.danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.call-btn.danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.call-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* 來電提示 */
.incoming-call {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 16px;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.incoming-text {
  text-align: center;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 12px;
  font-size: 16px;
}

.incoming-buttons {
  display: flex;
  gap: 8px;
}

.answer-btn,
.reject-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.answer-btn {
  background: #10b981;
  color: white;
}

.answer-btn:hover {
  background: #059669;
  transform: scale(1.05);
}

.reject-btn {
  background: #ef4444;
  color: white;
}

.reject-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}

/* 響應式設計 */
@media (max-width: 640px) {
  .call-panel {
    bottom: 90px;
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
  }

  .floating-call-btn {
    bottom: 15px;
    right: 15px;
    width: 56px;
    height: 56px;
    font-size: 24px;
  }
}
</style>
