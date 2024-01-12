export interface ProductType {
  id?: number
  type?: EProductType
  name?: string
  slug?: string
  description?: string
  summary?: string
  images?: string
  price?: number
  status?: boolean
  category_id?: number
}

export interface ProductDetailType extends ProductType {
  variants: Variant[]
}

export interface Variant {
  id?: number
  name?: string
  slug?: string
  images?: string
  price?: number
  discounted_price?: number
  discount_rate?: number
  quantity?: number
  status?: boolean
  variant_attributes?: VariantAttribute[]
  skus?: SKU[]
}

export interface VariantAttribute {
  id?: number
  name?: string
  variant_values?: VariantValue[]
}

export interface VariantValue {
  id?: number
  sku_code?: string
}

export interface SKU {
  id?: number
  name?: string
}

export enum EProductType {
  SINGLE = 'SINGLE',
  VARIANTS = 'VARIANTS'
}
