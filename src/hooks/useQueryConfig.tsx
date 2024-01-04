import { PaginationParams } from 'src/types/utils.type'
import useQueryParams from './useQueryParams'

export type QueryConfig = {
  [key in keyof PaginationParams]: string
} & { [key: string]: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isUndefined(value: any): boolean {
  return value === undefined
}

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = {
    page: queryParams.page !== undefined ? queryParams.page : '1',
    per_page: queryParams.per_page !== undefined ? queryParams.per_page : '10',
    sort_by: queryParams.sort_by !== undefined ? queryParams.sort_by : '',
    sort_direction: queryParams.sort_direction !== undefined ? queryParams.sort_direction : 'desc'
  }

  // Remove keys with undefined values
  for (const key in queryConfig) {
    if (isUndefined(queryConfig[key])) {
      delete queryConfig[key]
    }
  }

  return queryConfig
}
