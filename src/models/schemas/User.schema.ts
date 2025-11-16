import { ObjectId } from 'mongodb'
export interface UserType {
    _id?: ObjectId
    google_id: string
    email: string
    full_name?: string
    avatar_url?: string
    created_at?: Date
    updated_at?: Date
}

export class User implements UserType {


    email: string
    full_name?: string
    avatar_url?: string
    google_id: string
    created_at: Date
    updated_at: Date
    _id?: ObjectId

    constructor(data: UserType) {
        this._id = data._id
        this.google_id = data.google_id
        this.email = data.email
        this.full_name = data.full_name
        this.avatar_url = data.avatar_url
        const now = new Date()
        this.created_at = data.created_at || now
        this.updated_at = data.updated_at || now
    }
}
