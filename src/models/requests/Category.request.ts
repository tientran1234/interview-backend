import { PaginationQuery } from '../Others'
import { CategoryKind } from '../schemas/Category.schema'


export interface GetCategoriesQuery extends PaginationQuery {
    type: CategoryKind
    isReport?: string
}