import { MongoClient, Db, Collection } from 'mongodb'
import { envConfig } from '~/constants/config'
import { Category } from '~/models/schemas/Category.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { Transaction } from '~/models/schemas/Transaction.schema'
import { User } from '~/models/schemas/User.schema'
import { Wallet } from '~/models/schemas/Wallet.schema'

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@${envConfig.dbHost}/?retryWrites=true&w=majority&appName=${envConfig.dbName}`

class DatabaseService {
    private client: MongoClient
    private db: Db

    constructor() {
        this.client = new MongoClient(uri)
        this.db = this.client.db(envConfig.dbName)
    }

    async connect() {
        try {
            await this.client.connect()
            await this.db.command({ ping: 1 })
            console.log(`✅ Connected to MongoDB: ${envConfig.dbName}`)

            await this.createIndexes()
        } catch (error) {
            console.error('❌ MongoDB connection error:', error)
            throw error
        }
    }

    async disconnect() {
        try {
            await this.client.close()
            console.log('🔌 MongoDB disconnected')
        } catch (err) {
            console.error('❌ Error disconnecting MongoDB:', err)
        }
    }


    private async createIndexes() {
        await Promise.all([
            this.indexUsers(),
            this.indexWallets(),
            this.indexCategories(),
            this.indexTransactions(),
            this.indexRefreshTokens()
        ])
    }

    private async indexUsers() {
        await this.users.createIndex({ email: 1 }, { unique: true })
        await this.users.createIndex({ google_id: 1 }, { unique: true })
    }

    private async indexWallets() {
        await this.wallets.createIndex({ user_id: 1 })
        await this.wallets.createIndex(
            { user_id: 1, name: 1 },
            { unique: true }
        )
    }

    private async indexCategories() {
        await this.categories.createIndex({ user_id: 1, type: 1, name: 1 }, { unique: true })
        await this.categories.createIndex({ user_id: 1 })
        await this.categories.createIndex({ type: 1 })
    }

    private async indexTransactions() {
        await this.transactions.createIndex({ user_id: 1, trans_date: 1 })
        await this.transactions.createIndex({ wallet_id: 1, trans_date: 1 })
        await this.transactions.createIndex({ category_id: 1, trans_date: 1 })
        await this.transactions.createIndex({ type: 1 })
    }
    private async indexRefreshTokens() {
        await this.refreshTokens.createIndex({ user_id: 1 })
        await this.refreshTokens.createIndex({ token: 1 }, { unique: true })
        await this.refreshTokens.createIndex({ exp: 1 })
    }


    get users(): Collection<User> {

        return this.db.collection<User>(envConfig.dbUsersCollection)
    }

    get wallets(): Collection<Wallet> {
        return this.db.collection<Wallet>(envConfig.dbWalletsCollection)
    }

    get categories(): Collection<Category> {
        return this.db.collection<Category>(envConfig.dbCategoriesCollection)
    }

    get transactions(): Collection<Transaction> {
        return this.db.collection<Transaction>(envConfig.dbTransactionsCollection)
    }
    get refreshTokens(): Collection<RefreshToken> {
        return this.db.collection<RefreshToken>(envConfig.dbRefreshTokensCollection)
    }


    startSession() {
        return this.client.startSession()
    }
}

const databaseService = new DatabaseService()
export default databaseService
