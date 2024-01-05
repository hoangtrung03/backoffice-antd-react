import { ProductType } from 'src/types/product.type'
import { PaginationParams, ResponseWithPagination, SuccessResponse } from './../types/utils.type'

import http from 'src/utils/http'
export const URL_PRODUCT = 'products'

const productApi = {
  getAllProduct(queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<ProductType[]>>(URL_PRODUCT + '/all', {
      params: {
        ...queryParam
      }
    })
  },
  getProductById(id: number | string) {
    return http.get<SuccessResponse<ProductType>>(URL_PRODUCT + '/' + id)
  },
  addProduct(body: FormData) {
    return http.post<SuccessResponse<ProductType>>(URL_PRODUCT + '/add', body)
  },
  editProductById(id: number | string, body: FormData) {
    return http.put<SuccessResponse<ProductType>>(URL_PRODUCT + '/update/' + id, body)
  },
  deleteProductById(id: number | string) {
    return http.delete<SuccessResponse<ProductType>>(URL_PRODUCT + '/delete' + '/' + id)
  },
  deleteProductByIds(ids: string) {
    return http.delete<SuccessResponse<ProductType[]>>(URL_PRODUCT + '/delete' + '?ids=' + ids)
  },
  searchProduct(value: string, queryParam?: PaginationParams) {
    return http.get<ResponseWithPagination<ProductType[]>>(URL_PRODUCT + '/search', {
      params: {
        ...queryParam,
        search: value
      }
    })
  }
}

export default productApi
