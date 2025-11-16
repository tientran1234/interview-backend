import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { envConfig } from '~/constants/config'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.service'
import { verifyAccessToken } from '~/utils/commons'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const accessTokenValidator = validate(
    checkSchema(
        {
            Authorization: {
                custom: {
                    options: async (value, { req }) => {
                        return verifyAccessToken(value, req as Request)
                    }
                }
            }
        },
        ['headers']
    )
)
export const refreshTokenValidator = validate(
    checkSchema(
        {
            refresh_token: {
                trim: true,
                custom: {
                    options: async (value, { req }) => {
                        if (!value) throw new ErrorWithStatus({ message: USERS_MESSAGES.REFRESH_TOKEN_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED })


                        const [decoded, tokenDoc] = await Promise.all([
                            verifyToken({ token: value, secretOrPublicKey: envConfig.jwtSecretRefreshToken }),
                            databaseService.refreshTokens.findOne({ token: value })
                        ])

                        if (!tokenDoc) throw new ErrorWithStatus({ message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST, status: HTTP_STATUS.UNAUTHORIZED })
                        req.decoded_refresh_token = decoded
                    }
                }
            }
        },
        ['body']
    )
)
