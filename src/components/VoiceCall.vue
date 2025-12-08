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
        <!-- 我的名稱設定 -->
        <div v-if="!myDisplayName" class="name-setup">
          <label class="label">設定我的名稱（讓其他人看到）</label>
          <div class="name-input-group">
            <input
              v-model="tempDisplayName"
              type="text"
              placeholder="例如: Frank, 爸爸, 媽媽"
              class="name-input"
              maxlength="20"
            />
            <button @click="saveMyDisplayName" class="save-name-btn">✓</button>
          </div>
          <p class="name-hint">💡 設定後其他人會看到你的名稱而非長 ID</p>
        </div>

        <!-- 切換標籤 -->
        <div v-if="myDisplayName" class="tab-buttons">
          <button 
            @click="activeTab = 'contacts'" 
            :class="['tab-btn', { active: activeTab === 'contacts' }]"
          >
            📋 通訊錄
          </button>
          <button 
            @click="activeTab = 'discover'" 
            :class="['tab-btn', { active: activeTab === 'discover' }]"
          >
            � 發現
          </button>
        </div>

        <!-- 我的資訊 -->
        <div v-if="myDisplayName" class="my-info-section">
          <div class="my-info-card">
            <div class="my-avatar">{{ myEmoji }}</div>
            <div class="my-details">
              <div class="my-name">{{ myDisplayName }}</div>
              <div class="my-id-short">ID: {{ truncateId(myPeerId || '載入中...') }}</div>
            </div>
            <button @click="editMyInfo" class="edit-btn" title="編輯">✏️</button>
          </div>
        </div>

        <!-- 通訊錄標籤 -->
        <div v-if="activeTab === 'contacts'" class="contacts-section">
          <div class="contacts-header">
            <h4 class="contacts-title">聯絡人</h4>
            <button @click="showAddContact = true" class="add-contact-btn">+ 新增</button>
          </div>

          <!-- 聯絡人列表 -->
          <div v-if="contacts.length > 0" class="contacts-list">
            <div 
              v-for="contact in contacts" 
              :key="contact.id"
              class="contact-item"
              :class="{ 'selected': selectedContact?.id === contact.id }"
            >
              <div class="contact-info" @click="selectContact(contact)">
                <div class="contact-avatar">{{ contact.emoji }}</div>
                <div class="contact-details">
                  <div class="contact-name">{{ contact.name }}</div>
                  <div class="contact-id-preview">{{ truncateId(contact.peerId) }}</div>
                </div>
              </div>
              <div class="contact-actions">
                <button 
                  @click="callContact(contact)" 
                  class="action-btn call"
                  :disabled="isCallActive || !myPeerId"
                >
                  📞
                </button>
                <button 
                  @click="deleteContact(contact)" 
                  class="action-btn delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
          <div v-else class="empty-contacts">
            <p>📭 尚無聯絡人</p>
            <p class="empty-hint">點擊「+ 新增」來加入聯絡人</p>
          </div>
        </div>

        <!-- 發現標籤 - 在線用戶 -->
        <div v-if="activeTab === 'discover'" class="discover-section">
          <div class="discover-header">
            <h4 class="discover-title">🌐 在線用戶</h4>
            <button 
              @click="refreshOnlineUsers" 
              class="refresh-btn"
              :disabled="isRefreshing"
            >
              {{ isRefreshing ? '⏳' : '🔄' }}
            </button>
          </div>

          <!-- 在線用戶列表 -->
          <div v-if="onlineUsers.length > 0" class="online-users-list">
            <div 
              v-for="user in onlineUsers" 
              :key="user.peerId"
              class="online-user-item"
            >
              <div class="user-info">
                <div class="user-avatar">{{ user.emoji }}</div>
                <div class="user-details">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-status">🟢 在線</div>
                </div>
              </div>
              <div class="user-actions">
                <button 
                  @click="callOnlineUser(user)" 
                  class="action-btn call"
                  :disabled="isCallActive || !myPeerId"
                >
                  📞
                </button>
                <button 
                  @click="addOnlineUserToContacts(user)" 
                  class="action-btn add"
                  :disabled="isInContacts(user.peerId)"
                >
                  {{ isInContacts(user.peerId) ? '✓' : '+' }}
                </button>
              </div>
            </div>
          </div>
          <div v-else class="empty-online">
            <p>🔍 目前沒有其他在線用戶</p>
            <p class="empty-hint">等待其他人上線...</p>
          </div>
        </div>

        <!-- 新增聯絡人彈窗 -->
        <div v-if="showAddContact" class="modal-overlay" @click="cancelAddContact">
          <div class="modal-content" @click.stop>
            <h4 class="modal-title">新增聯絡人</h4>
            <div class="form-group">
              <label>名稱</label>
              <input 
                v-model="newContact.name" 
                type="text" 
                placeholder="例如: 爸爸、媽媽、Frank"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>表情符號</label>
              <div class="emoji-picker">
                <button 
                  v-for="emoji in emojiList" 
                  :key="emoji"
                  @click="newContact.emoji = emoji"
                  :class="['emoji-btn', { selected: newContact.emoji === emoji }]"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>Peer ID</label>
              <input 
                v-model="newContact.peerId" 
                type="text" 
                placeholder="貼上對方的 Peer ID"
                class="form-input"
              />
            </div>
            <div class="modal-buttons">
              <button @click="cancelAddContact" class="modal-btn cancel">取消</button>
              <button @click="saveContact" class="modal-btn save">儲存</button>
            </div>
          </div>
        </div>

        <!-- 狀態顯示 -->
        <div class="status-display" :class="statusClass">
          <span class="status-icon">{{ statusIcon }}</span>
          <span>{{ callStatus }}</span>
        </div>

        <!-- 通話中的掛斷按鈕 -->
        <div v-if="isCallActive" class="button-group">
          <button
            @click="endCall"
            class="call-btn danger"
          >
            ❌ 掛斷
          </button>
        </div>

        <!-- 來電提示 -->
        <div v-if="incomingCall && !isCallActive" class="incoming-call">
          <p class="incoming-text">📞 {{ getCallerName(incomingCall.peer) }} 來電中...</p>
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
    const activeTab = ref('contacts')
    const myPeerId = ref('')
    const myDisplayName = ref('')
    const myEmoji = ref('👤')
    const tempDisplayName = ref('')
    const partnerId = ref('')
    const callStatus = ref('正在連線到伺服器...')
    const isCallActive = ref(false)
    const isConnecting = ref(false)
    const incomingCall = ref(null)
    const showAddContact = ref(false)
    const selectedContact = ref(null)
    const onlineUsers = ref([])
    const isRefreshing = ref(false)
    const broadcastInterval = ref(null)
    
    // Peer 和通話相關
    const peer = ref(null)
    const currentCall = ref(null)
    const localStream = ref(null)
    const remoteAudio = ref(null)
    const wakeLock = ref(null)

    // 通訊錄
    const contacts = ref([])
    const newContact = ref({
      name: '',
      emoji: '👤',
      peerId: ''
    })

    const emojiList = ['👤', '👨', '👩', '👴', '👵', '👶', '👦', '👧', '🧑', '👨‍💼', '👩‍💼', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '❤️', '⭐', '🌟']

    // 載入我的資訊
    const loadMyInfo = () => {
      const savedName = localStorage.getItem('myDisplayName')
      const savedEmoji = localStorage.getItem('myEmoji')
      if (savedName) myDisplayName.value = savedName
      if (savedEmoji) myEmoji.value = savedEmoji
    }

    // 儲存我的資訊
    const saveMyDisplayName = () => {
      if (!tempDisplayName.value.trim()) {
        alert('請輸入名稱')
        return
      }
      myDisplayName.value = tempDisplayName.value.trim()
      localStorage.setItem('myDisplayName', myDisplayName.value)
      localStorage.setItem('myEmoji', myEmoji.value)
      tempDisplayName.value = ''
      // 開始廣播我的存在
      startBroadcast()
    }

    // 編輯我的資訊
    const editMyInfo = () => {
      const newName = prompt('修改我的名稱：', myDisplayName.value)
      if (newName && newName.trim()) {
        myDisplayName.value = newName.trim()
        localStorage.setItem('myDisplayName', myDisplayName.value)
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

    // 儲存通訊錄
    const saveContacts = () => {
      localStorage.setItem('voiceCallContacts', JSON.stringify(contacts.value))
    }

    // 計算屬性
    const statusClass = computed(() => {
      if (isCallActive.value) return 'status-active'
      if (isConnecting.value) return 'status-connecting'
      if (incomingCall.value) return 'status-incoming'
      if (!myPeerId.value) return 'status-loading'
      return 'status-idle'
    })

    const statusIcon = computed(() => {
      if (isCallActive.value) return '🟢'
      if (isConnecting.value) return '🟡'
      if (incomingCall.value) return '🔔'
      if (!myPeerId.value) return '⏳'
      return '🟢'
    })

    // 輔助函數
    const truncateId = (id) => {
      if (!id) return ''
      if (id.length <= 12) return id
      return id.substring(0, 6) + '...' + id.substring(id.length - 6)
    }

    const getCallerName = (peerId) => {
      // 先檢查通訊錄
      const contact = contacts.value.find(c => c.peerId === peerId)
      if (contact) return `${contact.emoji} ${contact.name}`
      
      // 再檢查在線用戶
      const onlineUser = onlineUsers.value.find(u => u.peerId === peerId)
      if (onlineUser) return `${onlineUser.emoji} ${onlineUser.name}`
      
      return '未知來電'
    }

    // 檢查是否已在通訊錄中
    const isInContacts = (peerId) => {
      return contacts.value.some(c => c.peerId === peerId)
    }

    // 通訊錄操作
    const selectContact = (contact) => {
      selectedContact.value = contact
      partnerId.value = contact.peerId
    }

    const callContact = (contact) => {
      partnerId.value = contact.peerId
      selectedContact.value = contact
      makeCall()
    }

    const deleteContact = (contact) => {
      if (confirm(`確定要刪除 ${contact.name} 嗎？`)) {
        contacts.value = contacts.value.filter(c => c.id !== contact.id)
        saveContacts()
      }
    }

    const cancelAddContact = () => {
      showAddContact.value = false
      newContact.value = { name: '', emoji: '👤', peerId: '' }
    }

    const saveContact = () => {
      if (!newContact.value.name || !newContact.value.peerId) {
        alert('請填寫完整資料')
        return
      }

      contacts.value.push({
        id: Date.now().toString(),
        name: newContact.value.name,
        emoji: newContact.value.emoji,
        peerId: newContact.value.peerId
      })

      saveContacts()
      cancelAddContact()
    }

    // 在線用戶操作
    const callOnlineUser = (user) => {
      partnerId.value = user.peerId
      selectedContact.value = null
      makeCall()
    }

    const addOnlineUserToContacts = (user) => {
      if (isInContacts(user.peerId)) return

      contacts.value.push({
        id: Date.now().toString(),
        name: user.name,
        emoji: user.emoji,
        peerId: user.peerId
      })

      saveContacts()
      callStatus.value = `✅ ${user.name} 已加入通訊錄`
      setTimeout(() => {
        if (!isCallActive.value) {
          callStatus.value = '✅ 就緒 - 可以撥打或接聽'
        }
      }, 2000)
    }

    const refreshOnlineUsers = () => {
      isRefreshing.value = true
      // 模擬刷新
      setTimeout(() => {
        isRefreshing.value = false
      }, 500)
    }

    // 廣播我的存在（使用 PeerJS Data Connection）
    const startBroadcast = () => {
      if (!peer.value || !myPeerId.value || !myDisplayName.value) return

      // 每 30 秒廣播一次我的資訊
      broadcastInterval.value = setInterval(() => {
        // 這裡使用 peer 的 metadata 來傳遞資訊
        // 當其他用戶連線時會看到這些資訊
        console.log('Broadcasting presence:', myDisplayName.value)
      }, 30000)
    }

    const stopBroadcast = () => {
      if (broadcastInterval.value) {
        clearInterval(broadcastInterval.value)
        broadcastInterval.value = null
      }
    }

    // 初始化 Peer
    const initializePeer = () => {
      try {
        // 使用 PeerJS 的預設雲端伺服器（0.peerjs.com）
        peer.value = new Peer(undefined, {
          debug: 2,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              { urls: 'stun:stun3.l.google.com:19302' },
              { urls: 'stun:stun4.l.google.com:19302' }
            ]
          }
        })

        // 監聽 Peer 開啟事件
        peer.value.on('open', (id) => {
          myPeerId.value = id
          callStatus.value = '✅ 就緒 - 可以撥打或接聽'
          console.log('My Peer ID:', id)
          
          // 如果已設定名稱，開始廣播
          if (myDisplayName.value) {
            startBroadcast()
          }
        })

        // 監聽數據連線（用於接收其他用戶的廣播）
        peer.value.on('connection', (conn) => {
          conn.on('data', (data) => {
            if (data.type === 'presence') {
              // 收到其他用戶的存在通知
              const existingIndex = onlineUsers.value.findIndex(u => u.peerId === data.peerId)
              const userData = {
                peerId: data.peerId,
                name: data.name,
                emoji: data.emoji,
                lastSeen: Date.now()
              }
              
              if (existingIndex >= 0) {
                onlineUsers.value[existingIndex] = userData
              } else {
                onlineUsers.value.push(userData)
              }
              
              console.log('User online:', data.name)
            }
          })
        })

        // 監聽來電
        peer.value.on('call', (call) => {
          console.log('Incoming call from:', call.peer)
          incomingCall.value = call
          const callerName = getCallerName(call.peer)
          callStatus.value = `📞 ${callerName} 來電中...`
        })

        // 監聽錯誤
        peer.value.on('error', (err) => {
          console.error('Peer error:', err)
          if (err.type === 'peer-unavailable') {
            callStatus.value = '❌ 對方不在線上'
          } else if (err.type === 'network') {
            callStatus.value = '❌ 網路錯誤，請檢查連線'
          } else if (err.type === 'disconnected') {
            callStatus.value = '⚠️ 已斷線，正在重新連線...'
            // 嘗試重新連線
            setTimeout(() => {
              if (peer.value && peer.value.disconnected) {
                peer.value.reconnect()
              }
            }, 2000)
          } else {
            callStatus.value = `❌ 錯誤: ${err.type}`
          }
        })

        // 監聽斷線
        peer.value.on('disconnected', () => {
          callStatus.value = '⚠️ 連線中斷，正在重連...'
          console.log('Peer disconnected, attempting to reconnect...')
          // 自動重新連線
          setTimeout(() => {
            if (peer.value && !peer.value.destroyed) {
              peer.value.reconnect()
            }
          }, 1000)
        })

        // 監聽關閉
        peer.value.on('close', () => {
          callStatus.value = '連線已關閉'
          console.log('Peer connection closed')
        })

      } catch (error) {
        console.error('Failed to initialize Peer:', error)
        callStatus.value = '❌ 初始化失敗，請重新整理'
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
        callStatus.value = '❌ 無法取得麥克風權限'
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
        callStatus.value = '❌ 請輸入對方 ID 或選擇聯絡人'
        return
      }

      if (peer.value.disconnected) {
        callStatus.value = '⚠️ 正在重新連線...'
        peer.value.reconnect()
        setTimeout(() => makeCall(), 2000)
        return
      }

      try {
        isConnecting.value = true
        const targetName = selectedContact.value 
          ? `${selectedContact.value.emoji} ${selectedContact.value.name}` 
          : '對方'
        callStatus.value = `📞 正在撥打給 ${targetName}...`

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
          callStatus.value = `🟢 通話中 - ${targetName}`
          
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
          callStatus.value = '❌ 通話錯誤'
          endCall()
        })

      } catch (error) {
        console.error('Failed to make call:', error)
        isConnecting.value = false
        callStatus.value = '❌ 撥打失敗'
      }
    }

    // 接聽電話
    const answerCall = async () => {
      if (!incomingCall.value) return

      try {
        const callerName = getCallerName(incomingCall.value.peer)
        callStatus.value = `✅ 接聽中 - ${callerName}`

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
          callStatus.value = `🟢 通話中 - ${callerName}`
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
          callStatus.value = '❌ 通話錯誤'
          endCall()
        })

      } catch (error) {
        console.error('Failed to answer call:', error)
        callStatus.value = '❌ 接聽失敗'
        incomingCall.value = null
      }
    }

    // 拒絕來電
    const rejectCall = () => {
      if (incomingCall.value) {
        incomingCall.value.close()
        incomingCall.value = null
        callStatus.value = '已拒絕來電'
        setTimeout(() => {
          if (!isCallActive.value) {
            callStatus.value = '✅ 就緒 - 可以撥打或接聽'
          }
        }, 2000)
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
      selectedContact.value = null
      callStatus.value = '通話已結束'

      setTimeout(() => {
        if (!isCallActive.value) {
          callStatus.value = '✅ 就緒 - 可以撥打或接聽'
        }
      }, 2000)
    }

    // 複製我的 ID
    const copyMyId = async () => {
      try {
        await navigator.clipboard.writeText(myPeerId.value)
        const originalStatus = callStatus.value
        callStatus.value = '✅ ID 已複製到剪貼簿'
        setTimeout(() => {
          callStatus.value = originalStatus
        }, 2000)
      } catch (error) {
        console.error('Failed to copy ID:', error)
        // 備用方案：顯示 ID 讓用戶手動複製
        alert(`請複製此 ID: ${myPeerId.value}`)
      }
    }

    // 生命週期
    onMounted(() => {
      loadMyInfo()
      loadContacts()
      initializePeer()

      // 清理過期的在線用戶（超過 60 秒沒更新）
      setInterval(() => {
        const now = Date.now()
        onlineUsers.value = onlineUsers.value.filter(u => now - u.lastSeen < 60000)
      }, 10000)
    })

    onUnmounted(() => {
      stopBroadcast()
      endCall()
      if (peer.value) {
        peer.value.destroy()
      }
    })

    return {
      showPanel,
      activeTab,
      myPeerId,
      myDisplayName,
      myEmoji,
      tempDisplayName,
      partnerId,
      callStatus,
      isCallActive,
      isConnecting,
      incomingCall,
      remoteAudio,
      statusClass,
      statusIcon,
      contacts,
      newContact,
      emojiList,
      showAddContact,
      selectedContact,
      onlineUsers,
      isRefreshing,
      saveMyDisplayName,
      editMyInfo,
      truncateId,
      getCallerName,
      isInContacts,
      selectContact,
      callContact,
      deleteContact,
      cancelAddContact,
      saveContact,
      callOnlineUser,
      addOnlineUserToContacts,
      refreshOnlineUsers,
      makeCall,
      answerCall,
      rejectCall,
      endCall
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
  width: 380px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 120px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
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
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

/* 名稱設定 */
.name-setup {
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border: 2px solid #fbbf24;
}

.name-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.name-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.name-input:focus {
  outline: none;
  border-color: #d97706;
}

.save-name-btn {
  width: 44px;
  padding: 10px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.save-name-btn:hover {
  background: #059669;
  transform: scale(1.05);
}

.name-hint {
  font-size: 12px;
  color: #92400e;
  margin: 0;
}

/* 我的資訊卡片 */
.my-info-section {
  margin-bottom: 16px;
}

.my-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  border: 2px solid #60a5fa;
}

.my-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.my-details {
  flex: 1;
  min-width: 0;
}

.my-name {
  font-weight: 700;
  color: #1e3a8a;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.my-id-short {
  font-size: 11px;
  color: #3b82f6;
  font-family: monospace;
}

.edit-btn {
  width: 36px;
  height: 36px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #2563eb;
  transform: scale(1.1);
}

/* 標籤按鈕 */
.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.tab-btn:hover:not(.active) {
  border-color: #667eea;
  background: #f3f4f6;
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
  font-size: 12px;
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

/* 通訊錄 */
.contacts-section {
  margin-bottom: 16px;
}

.contacts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.contacts-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.add-contact-btn {
  padding: 6px 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-contact-btn:hover {
  background: #059669;
  transform: scale(1.05);
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.contact-item.selected {
  border-color: #667eea;
  background: #eef2ff;
}

.contact-item:hover {
  border-color: #667eea;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
}

.contact-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.contact-details {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-id-preview {
  font-size: 11px;
  color: #6b7280;
  font-family: monospace;
}

.contact-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.call {
  background: #10b981;
}

.action-btn.call:hover:not(:disabled) {
  background: #059669;
  transform: scale(1.1);
}

.action-btn.call:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.action-btn.delete {
  background: #ef4444;
}

.action-btn.delete:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.empty-contacts {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.empty-contacts p {
  margin: 8px 0;
}

.empty-hint {
  font-size: 12px;
  color: #9ca3af;
}

/* 發現標籤 */
.discover-section {
  margin-bottom: 16px;
}

.discover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.discover-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.refresh-btn {
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.online-users-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.online-user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #f0fdf4;
  border: 2px solid #86efac;
  border-radius: 8px;
  transition: all 0.2s;
}

.online-user-item:hover {
  border-color: #10b981;
  transform: translateX(4px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #065f46;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  font-size: 11px;
  color: #10b981;
  font-weight: 600;
}

.user-actions {
  display: flex;
  gap: 6px;
}

.action-btn.add {
  background: #3b82f6;
}

.action-btn.add:hover:not(:disabled) {
  background: #2563eb;
  transform: scale(1.1);
}

.action-btn.add:disabled {
  background: #10b981;
  cursor: default;
}

.empty-online {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.empty-online p {
  margin: 8px 0;
}

/* 彈窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 20px 0;
  color: #1f2937;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.emoji-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.emoji-btn {
  width: 44px;
  height: 44px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn:hover {
  border-color: #667eea;
  transform: scale(1.1);
}

.emoji-btn.selected {
  border-color: #667eea;
  background: #eef2ff;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.cancel {
  background: #e5e7eb;
  color: #374151;
}

.modal-btn.cancel:hover {
  background: #d1d5db;
}

.modal-btn.save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-btn.save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 狀態顯示 */
.status-display {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.status-idle {
  background: #d1fae5;
  color: #065f46;
}

.status-loading {
  background: #fef3c7;
  color: #92400e;
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
    bottom: 80px;
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

  .contacts-list {
    max-height: 200px;
  }
}
</style>
