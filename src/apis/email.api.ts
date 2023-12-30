import { PaginationParams, ResponseWithPagination, SuccessResponse } from './../types/utils.type'

import { EmailType } from 'src/types/email.type'
import http from 'src/utils/http'
export const URL_EMAIL = 'emails'
type FormData = Pick<EmailType, 'type' | 'status' | 'subject' | 'content'>

const emailApi = {
  getAllEmail(queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<EmailType[]>>(URL_EMAIL + '/all', {
      params: {
        ...queryParam
      }
    })
  },
  updateEmailById(id: string | number, body: FormData) {
    return http.put<SuccessResponse<EmailType>>(URL_EMAIL + '/update/' + id, body)
  },
  getEmailById(id: string | number) {
    return http.get<SuccessResponse<EmailType>>(URL_EMAIL + '/get/' + id)
  },
  deleteEmailById(id: number | string) {
    return http.delete<SuccessResponse<EmailType>>(URL_EMAIL + '/delete' + '/' + id)
  },
  deleteEmailByIds(ids: string) {
    return http.delete<SuccessResponse<EmailType[]>>(URL_EMAIL + '/delete' + '?ids=' + ids)
  },
  createEmail(body: FormData) {
    return http.post<SuccessResponse<EmailType>>(URL_EMAIL + '/add', body)
  }
}

export default emailApi
