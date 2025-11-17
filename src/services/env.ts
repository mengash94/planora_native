import { Capacitor } from '@capacitor/core'

export const isNative = () => {
  try { return !!Capacitor.isNativePlatform() } catch { return false }
}

export const isPluginAvailable = (name: string) => {
  try {
    if (Capacitor?.isPluginAvailable) return Capacitor.isPluginAvailable(name)
    // fallback
    // @ts-ignore
    return !!(window as any)?.Capacitor?.Plugins?.[name]
  } catch { return false }
}

export const waitForCapacitorReady = () => new Promise<void>((resolve) => {
  const done = () => resolve()
  // If already native, resolve quickly
  try { if ((window as any)?.Capacitor?.isNativePlatform?.()) return resolve() } catch {}
  window.addEventListener('capacitorready', done, { once: true })
  setTimeout(done, 800)
})
