import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

const env = process.env.NODE_ENV
const envFilename = `.env.${env}`

if (!env) {
    console.log('❌ Bạn chưa cung cấp biến môi trường NODE_ENV (ví dụ: development, production)')
    console.log(`Phát hiện NODE_ENV = ${env}`)
    process.exit(1)
}

console.log(`✅ Phát hiện NODE_ENV = ${env}, app sẽ dùng file môi trường: ${envFilename}`)

if (!fs.existsSync(path.resolve(envFilename))) {
    console.log(`❌ Không tìm thấy file môi trường ${envFilename}`)
    console.log(
        `Lưu ý: App không dùng file .env, ví dụ môi trường là development thì app sẽ dùng file .env.development`
    )
    console.log(`Vui lòng tạo file ${envFilename} và tham khảo nội dung ở file .env.example`)
    process.exit(1)
}

config({ path: envFilename })

export const isProduction = env === 'production'

export const envConfig = {
    // server
    port: process.env.PORT || 4000,
    host: process.env.HOST as string,

    // database
    dbHost: process.env.DB_HOST as string,
    dbName: process.env.DB_NAME as string,
    dbUsername: process.env.DB_USERNAME as string,
    dbPassword: process.env.DB_PASSWORD as string,

    // collections
    dbRefreshTokensCollection: process.env.DB_REFRESH_TOKEN_COLLECTION as string,
    dbUsersCollection: process.env.DB_USERS_COLLECTION as string,
    dbWalletsCollection: process.env.DB_WALLETS_COLLECTION as string,
    dbCategoriesCollection: process.env.DB_CATEGORIES_COLLECTION as string,
    dbTransactionsCollection: process.env.DB_TRANSACTIONS_COLLECTION as string,

    // auth
    passwordSecret: process.env.PASSWORD_SECRET as string,
    jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
    jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    googleClientId: process.env.GOOGLE_CLIENT_ID as string,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI as string,

    // client
    clientUrl: process.env.CLIENT_URL as string,
    clientRedirectCallback: process.env.CLIENT_REDIRECT_CALLBACK as string
}
