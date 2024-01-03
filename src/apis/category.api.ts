import { PaginationParams, ResponseWithPagination, SuccessResponse } from './../types/utils.type'

import { CategoryType } from 'src/types/category.type'
import http from 'src/utils/http'
export const URL_CATEGORY = 'categories'

const categoryApi = {
  getAllCategory(queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<CategoryType[]>>(URL_CATEGORY + '/all-admin', {
      params: {
        ...queryParam
      }
    })
  },
  deleteCategoryById(id: number | string) {
    return http.delete<SuccessResponse<CategoryType>>(URL_CATEGORY + '/delete' + '/' + id)
  },
  deleteCategoryByIds(ids: string) {
    return http.delete<SuccessResponse<CategoryType[]>>(URL_CATEGORY + '/delete' + '?ids=' + ids)
  },
  searchCategory(value: string, queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<CategoryType[]>>(URL_CATEGORY + '/search', {
      params: {
        ...queryParam,
        search: value
      }
    })
  }
}

export default categoryApi
