import { isNative, isPluginAvailable, waitForCapacitorReady } from './env'
import { SocialLogin, type GoogleLoginOptions, type AppleProviderOptions } from '@capgo/capacitor-social-login'

let isInitialized = false
let initError: Error | null = null

async function initializeSocialLogin() {
  if (isInitialized) return
  if (initError) throw initError

  try {
    await SocialLogin.initialize({
      google: {
        webClientId: '741921128539-rmvupu979hlop84t4iucbbauhbcvqunl.apps.googleusercontent.com',
        iOSClientId: '741921128539-vs2vnn0o29hjhietd777ocrnebe7759u.apps.googleusercontent.com',
        iOSServerClientId: '741921128539-rmvupu979hlop84t4iucbbauhbcvqunl.apps.googleusercontent.com',
        mode: 'offline', // משתמש ב-offline mode לקבלת refresh token
      },
      apple: {
        clientId: 'net.planora.app',
      },
    })
    isInitialized = true
    console.log('[SocialLogin] Initialized successfully')
  } catch (error) {
    console.error('[SocialLogin] Initialize error:', error)
    initError = error as Error
    throw error
  }
}

async function getSocial() {
  await waitForCapacitorReady()
  if (!isNative()) throw new Error('Not native')
  if (!isPluginAvailable('SocialLogin')) throw new Error('SocialLogin plugin not available')
  
  // אתחול הפלאגין לפני השימוש
  await initializeSocialLogin()
  
  return SocialLogin
}

export async function loginWithGoogle() {
  const social = await getSocial()
  const options: GoogleLoginOptions = {} as GoogleLoginOptions
  const res = await social.login({ provider: 'google', options })
  const idToken = (res as any)?.result?.idToken
  const accessToken = (res as any)?.result?.accessToken
  if (!idToken && !accessToken) throw new Error('No Google token')
  return res
}

export async function loginWithApple() {
  const social = await getSocial()
  // אם אינך עובד עם iOS עכשיו, אפשר להשאיר ריק
  const options: AppleProviderOptions = {} as AppleProviderOptions
  const res = await social.login({ provider: 'apple', options })
  const idToken = (res as any)?.result?.idToken
  const accessToken = (res as any)?.result?.accessToken
  if (!idToken && !accessToken) throw new Error('No Apple token')
  return res
}

export async function socialLogout(provider: 'google' | 'apple') {
  try {
    const social = await getSocial()
    await social.logout({ provider })
  } catch {}
}
