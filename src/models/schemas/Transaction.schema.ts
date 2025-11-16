import { ObjectId } from "mongodb"

export type TransactionKind = 'income' | 'expense'

export interface TransactionType {
    _id?: ObjectId
    user_id: ObjectId
    wallet_id: ObjectId
    category_id: ObjectId
    type: TransactionKind
    amount: number
    description?: string
    trans_date: Date
    created_at?: Date
}

export class Transaction implements TransactionType {
    _id?: ObjectId
    user_id: ObjectId
    wallet_id: ObjectId
    category_id: ObjectId
    type: TransactionKind
    amount: number
    description?: string
    trans_date: Date
    created_at: Date

    constructor(data: TransactionType) {
        this._id = data._id
        this.user_id = data.user_id
        this.wallet_id = data.wallet_id
        this.category_id = data.category_id
        this.type = data.type
        this.amount = data.amount
        this.description = data.description
        this.trans_date = data.trans_date
        this.created_at = data.created_at || new Date()
    }
}