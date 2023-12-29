import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'
export const URL_AUTH = 'auth'
export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-token'

const authApi = {
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_AUTH + '/' + URL_REGISTER, body)
  },
  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_AUTH + '/' + URL_LOGIN, body)
  },
  logout() {
    return http.post(URL_AUTH + '/' + URL_LOGOUT)
  }
}

export default authApi
