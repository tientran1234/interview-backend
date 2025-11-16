import { WalletType } from "~/models/schemas/Wallet.schema"
import databaseService from "./database.service"
import { ObjectId } from "mongodb"
const CATEGORY_SYS = "6918a186f6ad6046f655f6a8"
class WalletsService {
    async createWallet(body: WalletType) {

        const wallet = await databaseService.wallets.insertOne({
            ...body,
            start_balance_date: new Date(),
            updated_at: new Date(),
            created_at: new Date(),
            is_active: true
        })
        return await databaseService.transactions.insertOne({
            amount: body.balance,
            category_id: new ObjectId(CATEGORY_SYS),
            created_at: new Date(),
            trans_date: new Date(),
            type: "income",
            user_id: body.user_id,
            wallet_id: wallet.insertedId

        })
    }
    async getWallets(user_id: string, limit: number, page: number) {
        const userObjectId = new ObjectId(user_id)
        const skip = (page - 1) * limit
        const cursor = databaseService.wallets
            .find({ user_id: userObjectId })
            .skip(skip)
            .limit(limit)
            .sort({ _id: -1 })

        const [items, total] = await Promise.all([
            cursor.toArray(),
            databaseService.wallets.countDocuments({ user_id: userObjectId })
        ])

        return {
            items,
            pagination: {
                page: page,
                limit: limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }

    }
}

const walletsService = new WalletsService()
export default walletsService