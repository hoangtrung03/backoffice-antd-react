import Cookies from 'js-cookie'
import { UserType } from 'src/types/user.type'

export const localStorageEventTarget = new EventTarget()

export const setAccessTokenToCookie = (access_token: string, access_token_expires_in: number) => {
  const expirationDate = new Date(access_token_expires_in * 1000 + 5000)
  Cookies.set('access_token', access_token, { expires: expirationDate })
}

export const setRefreshTokenToCookie = (refresh_token: string, refresh_token_expires_in: number) => {
  const expirationDate = new Date(refresh_token_expires_in * 1000 + 5000)
  Cookies.set('refresh_token', refresh_token, { expires: expirationDate })
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

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: UserType) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
