import axios, { AxiosError, InternalAxiosRequestConfig, type AxiosInstance } from 'axios'

import { config } from 'src/constants/config'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import { ErrorResponse } from 'src/types/utils.type'

import toast from 'react-hot-toast'
import { URL_AUTH, URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/apis/auth.api'

// eslint-disable-next-line import/namespace
import { URL_ME, URL_USER } from 'src/apis/user.api'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { UserRole } from 'src/types/user.type'
import {
  clearCookies,
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
  setAccessTokenToCookie,
  setProfileToLS,
  setRefreshTokenToCookie
} from './auth'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromCookie()
    this.refreshToken = getRefreshTokenFromCookie()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = 'Bearer ' + this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    //Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config

        if (url === URL_AUTH + '/' + URL_LOGIN || url === URL_AUTH + '/' + URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessTokenToCookie(this.accessToken, data.data.refresh_token_expires_in)
          setRefreshTokenToCookie(this.refreshToken, data.data.refresh_token_expires_in)
        } else if (url === URL_USER + '/' + URL_ME) {
          const data = response.data

          if (data?.data?.roles?.some((role: UserRole) => role.name.includes('ADMIN'))) {
            setProfileToLS(data.data)
          }
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearCookies()
        }
        return response
      },
      (error: AxiosError) => {
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message, {
            position: 'top-right'
          })
        }

        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config

          //When token expires and request not request refresh token => go to call refresh token
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            // Prevent call 2 refresh token handleRefreshToken
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Hold refreshTokenRequest in 10s for request if 401 to use
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })

            return this.refreshTokenRequest.then((access_token) => {
              return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
            })
          }
          clearCookies()
          this.accessToken = ''
          this.refreshToken = ''

          if (error.response?.data?.message) {
            toast.error(error.response.data.message, {
              position: 'top-right'
            })
          }
        }

        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_AUTH + '/' + URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessTokenToCookie(access_token, res.data.data.access_token_expires_in)
        this.accessToken = access_token

        return access_token
      })
      .catch((error) => {
        clearCookies()
        this.accessToken = ''
        this.refreshToken = ''

        throw error
      })
  }
}

const http = new Http().instance

export default http
