export interface CategoryType {
  id: number
  slug: string
  name: string
  status: boolean
  description: string | null
  sub_categories: CategoryType[]
  parent_category_id: number | null
}
