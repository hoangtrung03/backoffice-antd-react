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
  },
  updateRoleById(body: { id: string | number; name: string }) {
    return http.put<SuccessResponse<UserRole>>(URL_ROLE + '/update/' + body.id, body)
  },
  createRole(body: { name: string }) {
    return http.post<SuccessResponse<UserRole>>(URL_ROLE + '/create', body)
  },
  deleteRoleById(id: number | string) {
    return http.delete<SuccessResponse<UserType>>(URL_ROLE + '/delete' + '/' + id)
  }
}

export default roleApi
