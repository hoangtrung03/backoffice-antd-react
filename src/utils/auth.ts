import Cookies from 'js-cookie'
import { UserType } from 'src/types/user.type'

export const localStorageEventTarget = new EventTarget()

export const setAccessTokenToCookie = (access_token: string) => {
  Cookies.set('access_token', access_token)
}

export const setRefreshTokenToCookie = (refresh_token: string) => {
  Cookies.set('refresh_token', refresh_token)
}

export const clearCookies = () => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  Cookies.remove('profile')
  const clearCookiesEvent = new Event('clearCookies')
  localStorageEventTarget.dispatchEvent(clearCookiesEvent)
}

export const getAccessTokenFromCookie = () => Cookies.get('access_token') || ''
export const getRefreshTokenFromCookie = () => Cookies.get('refresh_token') || ''

export const getProfileFromCookie = () => {
  const result = Cookies.get('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToCookie = (profile: UserType) => {
  Cookies.set('profile', JSON.stringify(profile))
}
