// Firebase 配置
// 請將此檔案中的配置替換為你自己的 Firebase 專案配置

import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// 🔥 Firebase 配置
// 專案：kyoto-osaka-2026
// 區域：asia-southeast1 (新加坡)

const firebaseConfig = {
  apiKey: "AIzaSyD7fts0VjbpEb_VUkl-pnv-cjMuPYYmi38",
  authDomain: "kyoto-osaka-2026.firebaseapp.com",
  databaseURL: "https://kyoto-osaka-2026-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kyoto-osaka-2026",
  storageBucket: "kyoto-osaka-2026.firebasestorage.app",
  messagingSenderId: "269997928666",
  appId: "1:269997928666:web:8bb38908d019ea7b2075e3"
}

// 初始化 Firebase
let app
let database

try {
  app = initializeApp(firebaseConfig)
  database = getDatabase(app)
  console.log('✅ Firebase initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
  console.log('請確認 firebase.config.js 中的配置是否正確')
}

export { database }
