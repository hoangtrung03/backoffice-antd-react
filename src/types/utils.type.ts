export interface ErrorResponse<Data> {
  code: number
  message: string
  data: Data
}

export interface SuccessResponse<Data> {
  message: string
  data: Data
}

// -? se loai bo undefiend cua key optional
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export interface PaginationParams {
  page?: number
  per_page?: number
  sort_by?: string | 'createdAt' | 'id'
  sort_direction?: 'asc' | 'desc'
}

interface Pagination {
  page?: number
  size?: number
  total_page?: number
}

export interface ResponseWithPagination<T> extends SuccessResponse<T> {
  pagination: Pagination
}
