import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  access_token_expires_in: number
  refresh_token_expires_in: number
}>

export type RefreshTokenResponse = SuccessResponse<{ access_token: string }>
