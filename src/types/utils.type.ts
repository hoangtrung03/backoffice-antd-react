export interface ErrorResponse<Data> {
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
