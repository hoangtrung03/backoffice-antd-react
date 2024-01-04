import { PaginationParams, ResponseWithPagination, SuccessResponse } from './../types/utils.type'

import { CategoryType } from 'src/types/category.type'
import http from 'src/utils/http'
export const URL_CATEGORY = 'categories'

type FormData = Pick<CategoryType, 'name' | 'slug' | 'status' | 'description' | 'parent_category_id'> & {
  parentCategoryId: number
}

const categoryApi = {
  getAllCategory(queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<CategoryType[]>>(URL_CATEGORY + '/all-admin', {
      params: {
        ...queryParam
      }
    })
  },
  getCategoryById(id: number | string) {
    return http.get<SuccessResponse<CategoryType>>(URL_CATEGORY + '/' + id)
  },
  addCategory(body: FormData) {
    return http.post<SuccessResponse<CategoryType>>(URL_CATEGORY + '/add', body)
  },
  editCategoryById(id: number | string, body: FormData) {
    return http.put<SuccessResponse<CategoryType>>(URL_CATEGORY + '/update' + id, body)
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
