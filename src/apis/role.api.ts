import { UserType } from 'src/types/user.type'
import { PaginationParams, ResponseWithPagination } from '../types/utils.type'

import http from 'src/utils/http'
export const URL_ROLE = 'role'

const roleApi = {
  getAllRole(queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<UserType[]>>(URL_ROLE + '/all', {
      params: {
        ...queryParam
      }
    })
  }
  // deleteUserById(id: number | string) {
  //   return http.delete<SuccessResponse<UserType>>(URL_ROLE + '/' + URL_DELETE + '/' + id)
  // },
  // deleteUserByIds(ids: string) {
  //   return http.delete<SuccessResponse<UserType[]>>(URL_ROLE + '/' + URL_DELETE + '?ids=' + ids)
  // }
}

export default roleApi
