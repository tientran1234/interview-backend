import { envConfig } from "~/constants/config"
import axios from "axios"
import { ErrorWithStatus } from "~/models/Errors"
import { USERS_MESSAGES } from "~/constants/messages"
import HTTP_STATUS from "~/constants/httpStatus"
import databaseService from "./database.service"
import { signToken, verifyToken } from "~/utils/jwt"
import ms from "ms"
import RefreshToken from "~/models/schemas/RefreshToken.schema"
import { TokenType } from "~/constants/enum"
import { ObjectId } from "mongodb"
import { UserType } from "~/models/schemas/User.schema"
class UsersService {
    private async getOauthGoogleToken(code: string) {
        const body = {
            code,
            client_id: envConfig.googleClientId,
            client_secret: envConfig.googleClientSecret,
            redirect_uri: envConfig.googleRedirectUri,
            grant_type: 'authorization_code'
        }

        const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })


        return data as {
            access_token: string
            id_token: string
        }
    }
    private signAccessToken({ user_id, }: { user_id: string }) {


        return signToken({
            payload: {
                user_id,
                token_type: TokenType.AccessToken,

            },
            privateKey: envConfig.jwtSecretAccessToken,
            options: {
                expiresIn: envConfig.accessTokenExpiresIn as ms.StringValue
            }
        })
    }
    private signRefreshToken({ user_id, exp, }: { user_id: string; exp?: number }) {
        if (exp) {
            return signToken({
                payload: {
                    user_id,
                    token_type: TokenType.RefreshToken,

                    exp,

                },
                privateKey: envConfig.jwtSecretRefreshToken
            })
        }
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.RefreshToken,

            },
            privateKey: envConfig.jwtSecretRefreshToken,
            options: {
                expiresIn: envConfig.refreshTokenExpiresIn as ms.StringValue
            }
        })
    }
    private signAccessAndRefreshToken({ user_id }: { user_id: string }) {
        return Promise.all([this.signAccessToken({ user_id }), this.signRefreshToken({ user_id })])
    }
    async oauth(code: string) {

        const { id_token, access_token } = await this.getOauthGoogleToken(code)

        const userInfo = await this.getGoogleUserInfo(access_token, id_token)


        if (!userInfo.verified_email) {
            throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_NOT_VERIFIED,
                status: HTTP_STATUS.BAD_REQUEST
            })
        }
        const user = await databaseService.users.findOne({ email: userInfo.email })


        if (user) {
            const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
                user_id: user._id.toString(),

            })
            const { iat, exp } = await this.decodeRefreshToken(refresh_token)
            await databaseService.refreshTokens.insertOne(
                new RefreshToken({ user_id: user._id, token: refresh_token, iat, exp })
            )
            return {
                access_token,
                refresh_token,
                newUser: 0,

            }
        } else {


            const data = await this.register({
                email: userInfo.email,
                google_id: userInfo.id,
                full_name: userInfo.name,
                avatar_url: userInfo.picture,

            })
            return { ...data, newUser: 1 }
        }
    }
    private async getGoogleUserInfo(access_token: string, id_token: string) {

        const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            params: {
                access_token,
                alt: 'json'
            },
            headers: {
                Authorization: `Bearer ${id_token}`
            }
        })


        return data as {
            id: string
            email: string
            verified_email: boolean
            name: string
            given_name: string
            family_name: string
            picture: string
            locale: string
        }
    }
    async register(payload: UserType) {
        const { ...rest } = payload
        const user_id = new ObjectId()


        const user = await databaseService.users.insertOne(
            {

                ...rest,
                updated_at: new Date(),
                created_at: new Date(),
            },

        )


        const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
            user_id: user_id.toString(),


        })
        const { iat, exp } = await this.decodeRefreshToken(refresh_token)
        await databaseService.refreshTokens.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
        )
        return {
            access_token,
            refresh_token
        }
    }
    private decodeRefreshToken(refresh_token: string) {
        return verifyToken({
            token: refresh_token,
            secretOrPublicKey: envConfig.jwtSecretRefreshToken
        })
    }
    async logout(refresh_token: string) {
        const result = await databaseService.refreshTokens.deleteOne({ token: refresh_token })
        return {
            message: USERS_MESSAGES.LOGOUT_SUCCESS
        }
    }
    async getMe(user_id: string) {
        const result = await databaseService.users.findOne({
            _id: new ObjectId(user_id)

        }, {
            projection: {
                google_id: 0,
                created_at: 0,
                updated_at: 0,
                _id: 0
            }
        })
        return {
            message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
            result
        }
    }
    async refreshToken({
        user_id,
        refresh_token,
        exp
    }: {
        user_id: string
        refresh_token: string
        exp: number
    }) {
        const [new_access_token, new_refresh_token] = await Promise.all([
            this.signAccessToken({ user_id }),
            this.signRefreshToken({ user_id, exp }),
            databaseService.refreshTokens.deleteOne({ token: refresh_token })
        ])
        const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)
        await databaseService.refreshTokens.insertOne(
            new RefreshToken({
                user_id: new ObjectId(user_id),
                token: new_refresh_token,
                iat: decoded_refresh_token.iat,
                exp: decoded_refresh_token.exp
            })
        )
        return {
            access_token: new_access_token,
            refresh_token: new_refresh_token
        }
    }
}

const usersService = new UsersService()
export default usersService