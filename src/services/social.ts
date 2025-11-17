import { isNative, isPluginAvailable, waitForCapacitorReady } from './env'
import { SocialLogin, type GoogleLoginOptions, type AppleProviderOptions } from '@capgo/capacitor-social-login'

async function getSocial() {
  await waitForCapacitorReady()
  if (!isNative()) throw new Error('Not native')
  if (!isPluginAvailable('SocialLogin')) throw new Error('SocialLogin plugin not available')
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
