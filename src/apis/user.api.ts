import { AuthResponse } from 'src/types/auth.type'
import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
export const URL_USER = 'users'
export const URL_ME = 'me'

const userApi = {
  getUserProfile() {
    return http.get<SuccessResponse<User>>(URL_USER + '/' + URL_ME)
  }
}

export default userApi
