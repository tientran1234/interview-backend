import { ObjectId } from "mongodb"

export interface WalletType {
    _id?: ObjectId
    user_id: ObjectId
    name: string
    bank_name?: string
    account_number?: string
    balance: number
    start_balance_date: Date
    is_active?: boolean
    created_at?: Date
    updated_at?: Date
}

export class Wallet implements WalletType {
    _id?: ObjectId
    user_id: ObjectId
    name: string
    bank_name?: string
    account_number?: string
    balance: number
    start_balance_date: Date
    is_active: boolean
    created_at: Date
    updated_at: Date

    constructor(data: WalletType) {
        this._id = data._id
        this.user_id = data.user_id
        this.name = data.name
        this.bank_name = data.bank_name
        this.account_number = data.account_number
        this.balance = data.balance
        this.start_balance_date = data.start_balance_date
        this.is_active = data.is_active ?? true
        const now = new Date()
        this.created_at = data.created_at || now
        this.updated_at = data.updated_at || now
    }
}