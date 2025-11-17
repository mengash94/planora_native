import React from 'react'
import { useSocial } from '@/providers/SocialProvider'

export function StatusCard() {
  const { isNative, socialReady, onesignalReady, user } = useSocial()
  return (
    <div>
      <div>פלטפורמה: {isNative ? <b className="ok">Native</b> : <b>Web</b>}</div>
      <div>Social plugin: {socialReady ? <b className="ok">Loaded</b> : <b className="bad">Not ready</b>}</div>
      <div>OneSignal: {onesignalReady ? <b className="ok">Ready</b> : <b>Idle</b>}</div>
      <div>User: {user ? <code>{user.email || user.id}</code> : <i>none</i>}</div>
    </div>
  )
}
