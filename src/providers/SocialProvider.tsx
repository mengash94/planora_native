import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isNative } from '@/services/env'
import { onesignalInit, onesignalLoginExternal, onesignalLogoutExternal } from '@/services/onesignal'
import { loginWithGoogle, loginWithApple, socialLogout } from '@/services/social'

// user הדמו — בפועל תחליף לערך מהשרת שלך אחרי exchange
type User = { id: string; email?: string } | null

type Ctx = {
  isNative: boolean
  socialReady: boolean
  onesignalReady: boolean
  user: User
  loginGoogle: () => Promise<void>
  loginApple: () => Promise<void>
  logout: () => Promise<void>
  onesignalLogin: () => Promise<void>
  onesignalLogout: () => Promise<void>
}

const Ctx = createContext<Ctx>({
  isNative: false, socialReady: false, onesignalReady: false, user: null,
  loginGoogle: async () => {}, loginApple: async () => {}, logout: async () => {},
  onesignalLogin: async () => {}, onesignalLogout: async () => {},
})

export const useSocial = () => useContext(Ctx)

// טיפוסי import.meta.env מגיעים דרך vite-env.d.ts שהוספת
const ONE_ID = (import.meta as any).env.VITE_ONESIGNAL_APP_ID || ''

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [osReady, setOsReady] = useState(false)
  const [socialReady, setSocialReady] = useState(false)

  useEffect(() => {
    (async () => {
      const ok = await onesignalInit(ONE_ID)
      setOsReady(ok)
      setSocialReady(isNative())
    })()
  }, [])

  const loginGoogle = async () => {
    const res = await loginWithGoogle()
    const u = {
      id: (res as any)?.result?.user?.id || 'user',
      email: (res as any)?.result?.user?.email,
    }
    // TODO: כאן תשלח את res.result.idToken/res.result.accessToken ל-InstaBack ותקבל user אמיתי
    setUser(u)
  }

  const loginApple = async () => {
    try {
      alert('🍎 SocialProvider: Starting Apple login...')
      const res = await loginWithApple()
      alert('🍎 SocialProvider: Got response: ' + JSON.stringify(res, null, 2))
      
      // Extract user data from response
      const userId = (res as any)?.result?.user || (res as any)?.result?.userIdentifier || 'apple_user'
      const email = (res as any)?.result?.email
      
      const u = {
        id: userId,
        email: email || undefined,
      }
      
      alert('🍎 SocialProvider: Setting user: ' + JSON.stringify(u))
      setUser(u)
      
    } catch (error: any) {
      alert('🍎 SocialProvider ERROR: ' + (error?.message || error))
      throw error
    }
  }

  const logout = async () => {
    // בחר איזה ספק התנתקת בפועל; אם אתה שומר state של provider, השתמש בו
    await socialLogout('google')
    await socialLogout('apple')
    setUser(null)
  }

  const onesignalLogin = async () => {
    if (user?.id) await onesignalLoginExternal(user.id)
  }

  const onesignalLogout = async () => {
    await onesignalLogoutExternal()
  }

  const value = useMemo<Ctx>(() => ({
    isNative: isNative(),
    socialReady,
    onesignalReady: osReady,
    user,
    loginGoogle, loginApple, logout,
    onesignalLogin, onesignalLogout,
  }), [user, socialReady, osReady])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
