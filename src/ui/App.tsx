import React, { useEffect } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import type { PluginListenerHandle } from '@capacitor/core'
import { StatusCard } from './StatusCard'
import { Controls } from './Controls'
import { SocialProvider, useSocial } from '@/providers/SocialProvider'

function InnerApp() {
  useEffect(() => {
    let listenerHandle: PluginListenerHandle | null = null

    const setup = async () => {
      listenerHandle = await CapacitorApp.addListener('appUrlOpen', (event) => {
        console.log('App opened with URL:', event.url)
        alert(`נפתח דרך קישור: ${event.url}`)
      })
    }

    setup()

    return () => {
      listenerHandle?.remove?.()
    }
  })

  return (
    <div>
      <h2>PlanOra Native</h2>
      <p>מוכן ל־Google + Apple (נייטיב) ול־OneSignal. הכפתורים כאן לצורכי בדיקות בלבד.</p>
      <StatusCard />
      <Controls />
    </div>
  )
}

export default function App() {
  return (
    <SocialProvider>
      <InnerApp />
    </SocialProvider>
  )
}
