import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, signInWithCredential, OAuthProvider, type Auth, type User } from 'firebase/auth'
import { Capacitor } from '@capacitor/core'

// Re-export User type for use in other files
export type { User }

let app: FirebaseApp | null = null
let auth: Auth | null = null

export function initFirebase(): FirebaseApp {
  if (app) return app
  
  // אם Firebase כבר מאותחל, נשתמש בו
  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
  } else {
    // ב-iOS, Firebase.configure() ב-AppDelegate.swift כבר מאתחל את Firebase
    // עם GoogleService-Info.plist, אז אנחנו רק נשתמש ב-default app
    if (Capacitor.isNativePlatform()) {
      // ב-native, Firebase כבר מאותחל ב-AppDelegate.swift
      // נשתמש ב-default app
      const defaultApps = getApps()
      if (defaultApps.length > 0) {
        app = defaultApps[0]
      } else {
        // אם לא, נצטרך לאתחל ידנית (לא אמור לקרות)
        throw new Error('Firebase not initialized. Make sure FirebaseApp.configure() is called in AppDelegate.swift')
      }
    } else {
      // Web - נצטרך config (לא רלוונטי כרגע)
      throw new Error('Firebase initialization for web is not configured')
    }
  }
  
  auth = getAuth(app)
  return app
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    initFirebase()
  }
  return auth!
}

/**
 * Sign in with Apple ID Token using Firebase Auth
 * @param idToken - The ID token from Sign in with Apple
 * @returns Firebase User
 */
export async function signInWithAppleIdToken(idToken: string): Promise<User> {
  const auth = getFirebaseAuth()
  
  // יצירת OAuth credential מ-Apple ID Token
  const provider = new OAuthProvider('apple.com')
  const credential = provider.credential({
    idToken: idToken,
  })
  
  // התחברות ל-Firebase עם ה-credential
  const result = await signInWithCredential(auth, credential)
  return result.user
}

/**
 * Get current Firebase user
 */
export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth()
  return auth.currentUser
}

/**
 * Sign out from Firebase
 */
export async function signOutFirebase(): Promise<void> {
  const auth = getFirebaseAuth()
  await auth.signOut()
}

