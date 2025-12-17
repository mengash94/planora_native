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
        mode: 'offline',
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
  console.log('[Apple] Starting Sign in with Apple...')
  const social = await getSocial()
  
  const options: AppleProviderOptions = {
    scopes: ['name', 'email'],
  } as AppleProviderOptions
  
  console.log('[Apple] Calling social.login with provider: apple')
  
  let res
  try {
    res = await social.login({ provider: 'apple', options })
    console.log('[Apple] Login response:', JSON.stringify(res, null, 2))
  } catch (loginError) {
    console.error('[Apple] Login error:', loginError)
    throw new Error(`Apple Sign In failed: ${loginError}`)
  }
  
  const idToken = (res as any)?.result?.idToken
  console.log('[Apple] ID Token received:', idToken ? 'Yes' : 'No')
  
  if (!idToken) {
    console.error('[Apple] No idToken in response:', res)
    throw new Error('No Apple ID token received')
  }
  
  // אם אנחנו ב-native (iOS), נשתמש ב-Firebase Auth
  if (isNative()) {
    try {
      const firebaseUser = await signInWithAppleIdToken(idToken)
      console.log('[SocialLogin] Firebase Auth successful:', firebaseUser.uid)
      
      // מחזירים את המידע מ-Firebase User
      return {
        ...res,
        firebaseUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        },
        // שמירה על idToken המקורי גם כן
        idToken: idToken,
      }
    } catch (firebaseError) {
      console.error('[SocialLogin] Firebase Auth error:', firebaseError)
      throw new Error(`Firebase authentication failed: ${firebaseError}`)
    }
  }
  
  // אם לא native, נחזיר את התוצאה המקורית
  return res
}

export async function socialLogout(provider: 'google' | 'apple') {
  try {
    const social = await getSocial()
    await social.logout({ provider })
  } catch {}
}
