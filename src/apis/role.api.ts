import { UserRole, UserType } from 'src/types/user.type'
import { PaginationParams, ResponseWithPagination, SuccessResponse } from '../types/utils.type'

import http from 'src/utils/http'
export const URL_ROLE = 'role'

const roleApi = {
  getAllRole(queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<UserType[]>>(URL_ROLE + '/all', {
      params: {
        ...queryParam
      }
    })
  },
  getRoleById(id: string | number) {
    return http.get<SuccessResponse<UserRole>>(URL_ROLE + '/get/' + id)
  }
  // deleteUserById(id: number | string) {
  //   return http.delete<SuccessResponse<UserType>>(URL_ROLE + '/' + URL_DELETE + '/' + id)
  // },
  // deleteUserByIds(ids: string) {
  //   return http.delete<SuccessResponse<UserType[]>>(URL_ROLE + '/' + URL_DELETE + '?ids=' + ids)
  // }
}

export default roleApi
