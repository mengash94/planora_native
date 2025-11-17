import OneSignal from 'onesignal-cordova-plugin'
import { isNative } from './env'

let initialized = false

export async function onesignalInit(appId: string) {
  if (!isNative() || initialized || !appId) return false
  try {
    // API החדש של OneSignal בקורדובה תואם ל-Capacitor
    await OneSignal.initialize(appId)
    try { await OneSignal.Notifications.requestPermission() } catch {}
    initialized = true
    return true
  } catch (e) {
    console.error('[OneSignal] init failed', e)
    return false
  }
}

export async function onesignalLoginExternal(userId: string) {
  if (!initialized || !userId) return
  try { await OneSignal.login(userId) } catch (e) { console.warn('[OneSignal] login failed', e) }
}

export async function onesignalLogoutExternal() {
  if (!initialized) return
  try { await OneSignal.logout() } catch (e) { console.warn('[OneSignal] logout failed', e) }
}
