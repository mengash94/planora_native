import { isNative, isPluginAvailable, waitForCapacitorReady } from './env'
import { SocialLogin, type GoogleLoginOptions, type AppleProviderOptions } from '@capgo/capacitor-social-login'
import { initFirebase, signInWithAppleIdToken, getCurrentUser, type User as FirebaseUser } from './firebase'

let isInitialized = false
let initError: Error | null = null

async function initializeSocialLogin() {
  if (isInitialized) return
  if (initError) throw initError

  try {
    // אתחול Firebase
    if (isNative()) {
      initFirebase()
    }
    
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

/**
 * Sign in with Apple using Firebase Auth
 * זה עובד כך:
 * 1. מקבלים idToken מ-Sign in with Apple דרך @capgo/capacitor-social-login
 * 2. משתמשים ב-idToken הזה כדי להתחבר ל-Firebase Auth
 * 3. Firebase מאמת את ה-token מול Apple ומחזיר Firebase User
 */
export async function loginWithApple() {
  // Debug helper function
  const debugAlert = (title: string, data: any) => {
    try {
      const msg = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)
      alert(`🍎 ${title}\n\n${msg}`)
      console.log(`[Apple Debug] ${title}:`, data)
    } catch (e) {
      alert(`🍎 ${title}: [Could not stringify]`)
    }
  }

  try {
    debugAlert('Step 1', 'Getting social plugin...')
    const social = await getSocial()
    
    debugAlert('Step 2', 'Plugin ready, calling login...')
    
    const options: AppleProviderOptions = {
      scopes: ['email', 'name']
    } as AppleProviderOptions
    
    // Wrap with timeout to detect hanging
    const loginPromise = social.login({ provider: 'apple', options })
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Apple login timeout after 60s')), 60000)
    )
    
    debugAlert('Step 3', 'Waiting for Apple response...')
    
    const res = await Promise.race([loginPromise, timeoutPromise]) as any
    
    debugAlert('Step 4 - Response', res)
    
    // Try different response structures
    const idToken = res?.result?.idToken || res?.idToken || res?.result?.identityToken
    const user = res?.result?.user || res?.result?.userIdentifier || res?.user
    const email = res?.result?.email || res?.email
    const givenName = res?.result?.givenName || res?.givenName
    const familyName = res?.result?.familyName || res?.familyName
    
    debugAlert('Step 5 - Extracted', { idToken: idToken ? 'YES' : 'NO', user, email, givenName, familyName })
    
    if (!idToken && !user) {
      throw new Error('No Apple ID token or user received')
    }
    
    // Return raw Apple data without Firebase
    return {
      result: {
        idToken,
        user,
        email,
        givenName,
        familyName,
      },
      raw: res
    }
    
  } catch (error: any) {
    const errorDetails = {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack?.substring(0, 200),
    }
    debugAlert('ERROR', errorDetails)
    throw error
  }
}

export async function socialLogout(provider: 'google' | 'apple') {
  try {
    const social = await getSocial()
    await social.logout({ provider })
  } catch {}
}
