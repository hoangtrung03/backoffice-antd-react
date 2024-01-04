export interface CategoryType {
  id: number
  slug: string
  name: string
  status: boolean
  description: string | null
  subCategories: CategoryType[]
}
