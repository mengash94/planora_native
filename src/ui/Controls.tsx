import React from 'react'
import { useSocial } from '@/providers/SocialProvider'

export function Controls() {
  const { loginGoogle, loginApple, logout, onesignalLogin, onesignalLogout, user, onesignalReady } = useSocial()
  return (
    <div>
      <button onClick={loginGoogle}>Login with Google (native)</button>
      <button onClick={loginApple}>Login with Apple (native)</button>
      <button onClick={logout} disabled={!user}>Logout</button>
      <button onClick={onesignalLogin} disabled={!user || !onesignalReady}>OneSignal link</button>
      <button onClick={onesignalLogout}>OneSignal unlink</button>
    </div>
  )
}
