import React, { useEffect } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import type { PluginListenerHandle } from '@capacitor/core'
import { StatusCard } from './StatusCard'
import { Controls } from './Controls'
import { SocialProvider, useSocial } from '@/providers/SocialProvider'

function InnerApp() {
  useEffect(() => {
    let listenerHandle: PluginListenerHandle | null = null

    const setup = async () => {
      // ✅ רק בנייטיב, לא בדפדפן
      try {
        await StatusBar.setOverlaysWebView({ overlay: false })
        await StatusBar.setBackgroundColor({ color: '#FFE0B2' }) // כתום עדין
        await StatusBar.setStyle({ style: Style.Light }) // אייקונים כהים על רקע בהיר (Light Style = Dark Text)
      } catch (err) {
        console.log('StatusBar error', err)
      }

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
    <div className="wrap">
      <div className="card">
        <h2>PlanOra Native</h2>
        <p className="muted">
          מוכן ל־Google + Apple (נייטיב) ול־OneSignal. הכפתורים כאן לצורכי בדיקות בלבד.
        </p>
        <StatusCard />
        <div style={{ height: 5 }} />
        <Controls />
      </div>
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
