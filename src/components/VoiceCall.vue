<template>
  <div class="voice-call-container">
    <!-- 浮動通話按鈕 -->
    <button
      v-if="!showPanel"
      @click="showPanel = true"
      class="floating-call-btn"
      :class="{ 
        'calling': isCallActive,
        'incoming': incomingCall && !isCallActive
      }"
    >
      <span v-if="incomingCall && !isCallActive" class="pulse">📞</span>
      <span v-else-if="!isCallActive">📞</span>
      <span v-else class="pulse">📞</span>
    </button>

    <!-- 來電彈窗（在主頁面也能顯示）-->
    <div v-if="incomingCall && !isCallActive && !showPanel" class="incoming-call-popup">
      <div class="popup-content">
        <div class="caller-info">
          <div class="caller-avatar">📞</div>
          <p class="caller-name">{{ getCallerName(incomingCall.peer) }}</p>
          <p class="caller-subtitle">來電中...</p>
        </div>
        <div class="popup-buttons">
          <button @click="answerCall" class="answer-btn-popup">
            ✅ 接聽
          </button>
          <button @click="rejectCall" class="reject-btn-popup">
            ❌ 拒絕
          </button>
        </div>
      </div>
    </div>

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

        <!-- 主要通訊錄區域 -->
        <div v-if="myDisplayName" class="contacts-section">
          <div class="contacts-header">
            <h4 class="contacts-title">📋 聯絡人</h4>
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
            <p class="empty-hint">點擊「+ 新增」手動輸入 ID，或點擊下方「發現在線用戶」</p>
          </div>

          <!-- 發現功能 - 摺疊式設計 -->
          <div class="discover-section-compact">
            <button 
              @click="showDiscover = !showDiscover" 
              class="discover-toggle-btn"
            >
              <span>{{ showDiscover ? '▼' : '▶' }}</span>
              <span>發現在線用戶</span>
              <span v-if="onlineUsers.length > 0" class="online-badge">{{ onlineUsers.length }}</span>
            </button>

            <div v-if="showDiscover" class="discover-content">
              <div class="discover-header-compact">
                <p class="discover-hint">🌐 顯示附近同時在線的用戶</p>
                <button 
                  @click="refreshOnlineUsers" 
                  class="refresh-btn-compact"
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
              <div v-else class="empty-online-compact">
                <p>🔍 目前沒有其他在線用戶</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 新增聯絡人彈窗 -->
        <div v-if="showAddContact" class="modal-overlay" @click="cancelAddContact">
          <div class="modal-content" @click.stop>
            <h4 class="modal-title">新增聯絡人</h4>
            
            <div class="add-contact-hint">
              <p>💡 <strong>如何取得對方的 Peer ID？</strong></p>
              <ol>
                <li>請對方打開語音通話面板</li>
                <li>對方點擊自己的個人卡片上的 ✏️ 編輯按鈕</li>
                <li>在彈出視窗中點擊「複製完整 ID」</li>
                <li>透過訊息傳給你，貼到下方欄位</li>
              </ol>
            </div>

            <div class="form-group">
              <label>名稱 <span class="required">*</span></label>
              <input 
                v-model="newContact.name" 
                type="text" 
                placeholder="例如: 爸爸、媽媽、Frank"
                class="form-input"
                maxlength="20"
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
              <label>Peer ID <span class="required">*</span></label>
              <textarea 
                v-model="newContact.peerId" 
                placeholder="貼上對方的 Peer ID（長字串）"
                class="form-textarea"
                rows="3"
              ></textarea>
              <p v-if="newContact.peerId" class="id-preview">
                預覽: {{ truncateId(newContact.peerId) }}
              </p>
            </div>
            <div class="modal-buttons">
              <button @click="cancelAddContact" class="modal-btn cancel">取消</button>
              <button @click="saveContact" class="modal-btn save">儲存</button>
            </div>
          </div>
        </div>

        <!-- 編輯我的資訊彈窗 -->
        <div v-if="showEditMyInfo" class="modal-overlay" @click="showEditMyInfo = false">
          <div class="modal-content" @click.stop>
            <h4 class="modal-title">我的資訊</h4>
            
            <div class="my-full-info">
              <div class="info-row">
                <span class="info-label">名稱：</span>
                <span class="info-value">{{ myDisplayName }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">表情：</span>
                <span class="info-value">{{ myEmoji }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">完整 ID：</span>
                <div class="full-id-display">
                  <code class="full-id">{{ myPeerId }}</code>
                  <button @click="copyMyFullId" class="copy-full-id-btn">
                    📋 複製完整 ID
                  </button>
                </div>
              </div>
            </div>

            <div class="edit-actions">
              <button @click="changeMyName" class="edit-action-btn">
                ✏️ 修改名稱
              </button>
              <button @click="changeMyEmoji" class="edit-action-btn">
                😊 更換表情
              </button>
            </div>

            <div class="id-info-hint">
              <p>💡 你的 ID 是固定的，每次開啟都相同</p>
              <button @click="resetPeerId" class="reset-id-btn">
                🔄 重置 ID（進階）
              </button>
            </div>

            <div class="modal-buttons">
              <button @click="showEditMyInfo = false" class="modal-btn cancel">關閉</button>
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

    <!-- 隱藏的音訊元素（移到外層確保始終存在）-->
    <audio 
      ref="remoteAudio" 
      autoplay 
      playsinline 
      style="display: none;"
    ></audio>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Peer from 'peerjs'
import { database } from '../firebase.config.js'
import { ref as dbRef, set, onValue, remove, onDisconnect } from 'firebase/database'

export default {
  name: 'VoiceCall',
  setup() {
    // 狀態變數
    const showPanel = ref(false)
    const showDiscover = ref(false)
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
    const showEditMyInfo = ref(false)
    const selectedContact = ref(null)
    const onlineUsers = ref([])
    const isRefreshing = ref(false)
    const broadcastInterval = ref(null)
    const unsubscribePresence = ref(null) // 儲存 Firebase 監聽器的取消訂閱函數
    
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
      showEditMyInfo.value = true
    }

    const changeMyName = () => {
      const newName = prompt('修改我的名稱：', myDisplayName.value)
      if (newName && newName.trim()) {
        myDisplayName.value = newName.trim()
        localStorage.setItem('myDisplayName', myDisplayName.value)
        
        // 如果 Firebase 可用，更新在線狀態
        if (database && myPeerId.value) {
          try {
            const myPresenceRef = dbRef(database, `presence/${myPeerId.value}`)
            set(myPresenceRef, {
              peerId: myPeerId.value,
              name: myDisplayName.value,
              emoji: myEmoji.value,
              lastSeen: Date.now()
            })
          } catch (error) {
            console.warn('Failed to update name in Firebase:', error)
          }
        }
      }
    }

    const changeMyEmoji = () => {
      showEditMyInfo.value = false
      setTimeout(() => {
        const newEmoji = prompt('輸入新的表情符號：', myEmoji.value)
        if (newEmoji && newEmoji.trim()) {
          myEmoji.value = newEmoji.trim()
          localStorage.setItem('myEmoji', myEmoji.value)
          
          // 如果 Firebase 可用，更新在線狀態
          if (database && myPeerId.value) {
            try {
              const myPresenceRef = dbRef(database, `presence/${myPeerId.value}`)
              set(myPresenceRef, {
                peerId: myPeerId.value,
                name: myDisplayName.value,
                emoji: myEmoji.value,
                lastSeen: Date.now()
              })
            } catch (error) {
              console.warn('Failed to update emoji in Firebase:', error)
            }
          }
        }
        showEditMyInfo.value = true
      }, 100)
    }

    const copyMyFullId = async () => {
      try {
        await navigator.clipboard.writeText(myPeerId.value)
        alert('✅ 完整 ID 已複製到剪貼簿！\n\n請透過訊息傳給對方，讓對方可以將你加入通訊錄。\n\n💡 此 ID 是固定的，不會改變。')
      } catch (error) {
        console.error('Failed to copy ID:', error)
        alert(`請手動複製此 ID:\n\n${myPeerId.value}`)
      }
    }

    // 重置 Peer ID（進階功能）
    const resetPeerId = () => {
      if (confirm('⚠️ 確定要重置 ID 嗎？\n\n重置後：\n• 你的 ID 會改變\n• 其他人通訊錄中的你會失效\n• 需要重新分享新 ID 給大家')) {
        localStorage.removeItem('myPeerId')
        alert('✅ ID 已重置\n\n請重新整理頁面生成新的 ID')
        location.reload()
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
        alert('❌ 請填寫名稱和 Peer ID')
        return
      }

      // 驗證 Peer ID 格式（去除空白）
      const cleanPeerId = newContact.value.peerId.trim()
      if (cleanPeerId.length < 10) {
        alert('❌ Peer ID 格式不正確，請確認是否完整複製')
        return
      }

      // 檢查是否已存在
      if (isInContacts(cleanPeerId)) {
        alert('⚠️ 此聯絡人已存在於通訊錄中')
        return
      }

      contacts.value.push({
        id: Date.now().toString(),
        name: newContact.value.name.trim(),
        emoji: newContact.value.emoji,
        peerId: cleanPeerId
      })

      saveContacts()
      cancelAddContact()
      
      callStatus.value = `✅ ${newContact.value.name} 已加入通訊錄`
      setTimeout(() => {
        if (!isCallActive.value) {
          callStatus.value = '✅ 就緒 - 可以撥打或接聽'
        }
      }, 2000)
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

    // 廣播我的存在（使用 Firebase Realtime Database）
    const startBroadcast = () => {
      console.log('🔍 Checking broadcast requirements:', {
        hasDatabase: !!database,
        hasPeerId: !!myPeerId.value,
        hasDisplayName: !!myDisplayName.value,
        peerId: myPeerId.value,
        displayName: myDisplayName.value
      })

      if (!database) {
        console.error('❌ Firebase database not initialized')
        return
      }

      if (!myPeerId.value) {
        console.warn('⚠️ Peer ID not ready, will retry when Peer connects')
        return
      }

      if (!myDisplayName.value) {
        console.warn('⚠️ Display name not set')
        return
      }

      try {
        // 在 Firebase 註冊我的在線狀態
        const myPresenceRef = dbRef(database, `presence/${myPeerId.value}`)
        
        const userData = {
          peerId: myPeerId.value,
          name: myDisplayName.value,
          emoji: myEmoji.value,
          lastSeen: Date.now()
        }

        console.log('📤 Writing to Firebase:', userData)

        // 設定我的在線狀態
        set(myPresenceRef, userData)
          .then(() => {
            console.log('✅ Successfully wrote to Firebase')
          })
          .catch((error) => {
            console.error('❌ Failed to write to Firebase:', error)
          })

        // 當斷線時自動移除
        onDisconnect(myPresenceRef).remove()

        // 每 30 秒更新一次時間戳（保持活躍）
        if (broadcastInterval.value) {
          clearInterval(broadcastInterval.value)
        }
        broadcastInterval.value = setInterval(() => {
          const updatedData = {
            peerId: myPeerId.value,
            name: myDisplayName.value,
            emoji: myEmoji.value,
            lastSeen: Date.now()
          }
          set(myPresenceRef, updatedData)
          console.log('🔄 Updated presence timestamp')
        }, 30000)

        console.log('✅ Broadcasting presence:', myDisplayName.value)

        // 監聽所有在線用戶（確保只註冊一次）
        if (!unsubscribePresence.value) {
          const presenceRef = dbRef(database, 'presence')
          console.log('🎧 Setting up Firebase listener for path:', 'presence')
          
          try {
            // onValue 返回一個取消訂閱的函數
            unsubscribePresence.value = onValue(presenceRef, (snapshot) => {
              console.log('📥 Received Firebase update, snapshot exists:', snapshot.exists())
              const users = []
              
              if (!snapshot.exists()) {
                console.log('⚠️ No data in presence node')
                onlineUsers.value = users
                return
              }

              snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val()
                console.log('👤 Found user:', user)
                // 排除自己，只顯示其他用戶
                if (user && user.peerId !== myPeerId.value) {
                  // 檢查是否在 5 分鐘內活躍
                  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
                  if (user.lastSeen && user.lastSeen > fiveMinutesAgo) {
                    users.push(user)
                    console.log('✅ Added online user:', user.name)
                  } else {
                    console.log('⏱️ User outdated:', user.name, 'last seen:', new Date(user.lastSeen))
                  }
                } else if (user && user.peerId === myPeerId.value) {
                  console.log('👋 Skipping self:', user.name)
                }
              })
              onlineUsers.value = users
              console.log('👥 Online users updated:', users.length, users)
            }, (error) => {
              console.error('❌ Firebase onValue error:', error)
              console.error('Error code:', error.code)
              console.error('Error message:', error.message)
            })
            console.log('✅ Firebase listener registered successfully')
          } catch (error) {
            console.error('❌ Failed to register Firebase listener:', error)
          }
        } else {
          console.log('ℹ️ Firebase listener already registered, skipping')
        }

      } catch (error) {
        console.error('❌ Failed to broadcast presence:', error)
        console.error('Error details:', error.message, error.stack)
      }
    }

    const stopBroadcast = () => {
      if (broadcastInterval.value) {
        clearInterval(broadcastInterval.value)
        broadcastInterval.value = null
      }

      // 取消訂閱 Firebase 監聽器
      if (unsubscribePresence.value) {
        console.log('🔇 Unsubscribing from Firebase listener')
        unsubscribePresence.value()
        unsubscribePresence.value = null
      }

      // 從 Firebase 移除我的在線狀態
      if (database && myPeerId.value) {
        try {
          const myPresenceRef = dbRef(database, `presence/${myPeerId.value}`)
          remove(myPresenceRef)
          console.log('✅ Removed presence from Firebase')
        } catch (error) {
          console.error('❌ Failed to remove presence:', error)
        }
      }
    }

    // 產生或取得固定的 Peer ID
    const getOrCreatePeerId = () => {
      // 先檢查 localStorage 是否有儲存的 ID
      let savedId = localStorage.getItem('myPeerId')
      
      if (savedId) {
        console.log('📦 Found saved Peer ID:', savedId)
        return savedId
      }
      
      // 如果沒有，生成一個新的固定 ID（使用時間戳和隨機數）
      const timestamp = Date.now().toString(36) // 轉成 36 進制縮短長度
      const random = Math.random().toString(36).substring(2, 9)
      savedId = `user-${timestamp}-${random}`
      
      // 儲存到 localStorage
      localStorage.setItem('myPeerId', savedId)
      console.log('🆕 Created new Peer ID:', savedId)
      
      return savedId
    }

    // 初始化 Peer
    const initializePeer = () => {
      try {
        // 取得或創建固定的 Peer ID
        const fixedPeerId = getOrCreatePeerId()
        
        // 使用固定 ID 初始化 Peer（而不是 undefined）
        peer.value = new Peer(fixedPeerId, {
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
          console.log('✅ Peer connected with ID:', id)
          
          // 確保 ID 已儲存到 localStorage（防止被覆蓋）
          const savedId = localStorage.getItem('myPeerId')
          if (savedId !== id) {
            console.log('⚠️ Updating saved Peer ID from', savedId, 'to', id)
            localStorage.setItem('myPeerId', id)
          }
          
          // 如果已設定名稱，開始廣播
          if (myDisplayName.value) {
            startBroadcast()
          }
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
          console.log('Received remote stream from making call')
          if (remoteAudio.value) {
            remoteAudio.value.srcObject = remoteStream
            // 確保音訊播放（某些瀏覽器需要手動觸發）
            remoteAudio.value.play().catch(err => {
              console.error('Failed to play audio:', err)
            })
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
          console.log('Received remote stream from answering call')
          if (remoteAudio.value) {
            remoteAudio.value.srcObject = remoteStream
            // 確保音訊播放（某些瀏覽器需要手動觸發）
            remoteAudio.value.play().catch(err => {
              console.error('Failed to play audio:', err)
            })
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
      // 檢查開發者設定
      const devSettingsStr = localStorage.getItem('devSettings')
      let isVoiceCallEnabled = true
      
      if (devSettingsStr) {
        try {
          const devSettings = JSON.parse(devSettingsStr)
          isVoiceCallEnabled = devSettings.enableVoiceCall !== false
        } catch (error) {
          console.error('Failed to parse dev settings:', error)
        }
      }

      if (!isVoiceCallEnabled) {
        console.log('🚫 Voice call is disabled in dev settings')
        callStatus.value = '🔧 語音通話功能已在開發者設定中關閉'
        return
      }

      loadMyInfo()
      loadContacts()
      initializePeer()
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
      showDiscover,
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
      showEditMyInfo,
      saveMyDisplayName,
      editMyInfo,
      changeMyName,
      changeMyEmoji,
      copyMyFullId,
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

.floating-call-btn.incoming {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  animation: pulse-ring-green 1s infinite;
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

@keyframes pulse-ring-green {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 來電彈窗（在主頁面顯示）*/
.incoming-call-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 32px;
  min-width: 300px;
  animation: popup-appear 0.3s ease-out;
}

@keyframes popup-appear {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.popup-content {
  text-align: center;
}

.caller-info {
  margin-bottom: 24px;
}

.caller-avatar {
  font-size: 64px;
  margin-bottom: 16px;
  animation: ring-shake 0.5s infinite;
}

@keyframes ring-shake {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
}

.caller-name {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.caller-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.popup-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.answer-btn-popup,
.reject-btn-popup {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.answer-btn-popup {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.answer-btn-popup:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.reject-btn-popup {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.reject-btn-popup:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
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
  overflow-x: hidden; /* 防止水平滾動 */
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

/* 名稱設定 */
.name-setup {
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border: 2px solid #fbbf24;
  width: 100%;
  box-sizing: border-box;
}

.name-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  width: 100%;
}

.name-input {
  flex: 1;
  min-width: 0; /* 允許 flex item 縮小至內容以下 */
  padding: 10px 12px;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  box-sizing: border-box;
}

.name-input:focus {
  outline: none;
  border-color: #d97706;
}

.save-name-btn {
  width: 44px;
  min-width: 44px; /* 防止按鈕被壓縮 */
  flex-shrink: 0; /* 不允許縮小 */
  padding: 10px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
}

.save-name-btn:hover {
  background: #059669;
  transform: scale(1.05);
}

.name-hint {
  font-size: 12px;
  color: #92400e;
  margin: 0;
  word-wrap: break-word; /* 允許文字換行 */
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
/* 舊的標籤按鈕樣式（已廢棄，改用摺疊式設計）
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
*/

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
  width: 100%;
}

.id-input,
.partner-input {
  flex: 1;
  min-width: 0; /* 允許縮小 */
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  font-family: monospace;
  transition: border-color 0.2s;
  box-sizing: border-box;
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
  min-width: 44px; /* 最小寬度 */
  flex-shrink: 0; /* 不允許縮小 */
  background: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
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

/* 發現功能 - 摺疊式設計 */
.discover-section-compact {
  margin-top: 16px;
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}

.discover-toggle-btn {
  width: 100%;
  padding: 10px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.discover-toggle-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.online-badge {
  margin-left: auto;
  background: #10b981;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.discover-content {
  margin-top: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.discover-header-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.discover-hint {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.refresh-btn-compact {
  padding: 4px 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn-compact:hover:not(:disabled) {
  background: #5568d3;
}

.refresh-btn-compact:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.empty-online-compact {
  text-align: center;
  padding: 16px;
  color: #9ca3af;
  font-size: 13px;
}

.empty-online-compact p {
  margin: 0;
}

/* 舊的發現標籤樣式（保留兼容性）*/
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
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.add-contact-hint {
  background: #fef3c7;
  border: 2px solid #fbbf24;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 13px;
}

.add-contact-hint p {
  margin: 0 0 8px 0;
  color: #92400e;
}

.add-contact-hint ol {
  margin: 0;
  padding-left: 20px;
  color: #78350f;
}

.add-contact-hint li {
  margin: 4px 0;
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

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  font-family: monospace;
  font-size: 12px;
}

.required {
  color: #ef4444;
}

.id-preview {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
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

/* 我的完整資訊顯示 */
.my-full-info {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.info-value {
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.full-id-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.full-id {
  display: block;
  padding: 8px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 11px;
  word-break: break-all;
  color: #4b5563;
}

.copy-full-id-btn {
  padding: 8px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-full-id-btn:hover {
  background: #5568d3;
  transform: scale(1.02);
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.edit-action-btn {
  flex: 1;
  padding: 10px;
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-action-btn:hover {
  background: white;
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

/* ID 資訊提示 */
.id-info-hint {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  text-align: center;
}

.id-info-hint p {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #92400e;
}

.reset-id-btn {
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-id-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
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
