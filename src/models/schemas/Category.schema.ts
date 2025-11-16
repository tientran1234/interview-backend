import { ObjectId } from "mongodb"

export type CategoryKind = 'income' | 'expense'

export interface CategoryType {
    _id?: ObjectId
    user_id?: ObjectId
    type: CategoryKind
    name: string
    is_default?: boolean
    created_at?: Date
    updated_at?: Date
}

export class Category implements CategoryType {
    _id?: ObjectId
    user_id?: ObjectId
    type: CategoryKind
    name: string
    is_default: boolean
    created_at: Date
    updated_at: Date

    constructor(data: CategoryType) {
        this._id = data._id
        this.user_id = data.user_id
        this.type = data.type
        this.name = data.name
        this.is_default = data.is_default ?? false
        const now = new Date()
        this.created_at = data.created_at || now
        this.updated_at = data.updated_at || now
    }
}