import { UserType } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
export const URL_USER = 'users'
export const URL_ME = 'me'
export const URL_ALL = 'all'
const URL_DELETE = 'delete'

const userApi = {
  getUserProfile() {
    return http.get<SuccessResponse<UserType>>(URL_USER + '/' + URL_ME)
  },
  getAllUser() {
    return http.get<SuccessResponse<UserType[]>>(URL_USER + '/' + URL_ALL)
  },
  deleteUserById(id: number | string) {
    return http.delete<SuccessResponse<UserType>>(URL_USER + '/' + URL_DELETE + '/' + id)
  }
}

export default userApi
