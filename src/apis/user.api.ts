import { UserType } from 'src/types/user.type'
import { PaginationParams, ResponseWithPagination, SuccessResponse } from './../types/utils.type'

import http from 'src/utils/http'
export const URL_USER = 'users'
export const URL_ME = 'me'
export const URL_ALL = 'all'
const URL_DELETE = 'delete'

const userApi = {
  getUserProfile() {
    return http.get<SuccessResponse<UserType>>(URL_USER + '/' + URL_ME)
  },
  getAllUser(queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<UserType[]>>(URL_USER + '/' + URL_ALL, {
      params: {
        ...queryParam
      }
    })
  },
  deleteUserById(id: number | string) {
    return http.delete<SuccessResponse<UserType>>(URL_USER + '/' + URL_DELETE + '/' + id)
  },
  deleteUserByIds(ids: string) {
    return http.delete<SuccessResponse<UserType[]>>(URL_USER + '/' + URL_DELETE + '?ids=' + ids)
  },
  searchUser(value: string, queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<UserType[]>>(URL_USER + '/search', {
      params: {
        ...queryParam,
        search: value
      }
    })
  }
}

export default userApi
