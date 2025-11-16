import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { WALLET_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { validate } from '~/utils/validation'

export const createWalletValidator = validate(
    checkSchema(
        {
            name: {
                in: ['body'],
                exists: {
                    errorMessage: WALLET_MESSAGES.NAME_REQUIRED
                },
                isString: {
                    errorMessage: WALLET_MESSAGES.NAME_MUST_BE_STRING
                },
                trim: true
            },

            bank_name: {
                in: ['body'],
                optional: true,
                isString: {
                    errorMessage: WALLET_MESSAGES.BANK_NAME_INVALID
                },
                trim: true
            },

            account_number: {
                in: ['body'],
                optional: true,
                isString: {
                    errorMessage: WALLET_MESSAGES.ACCOUNT_NUMBER_INVALID
                },
                trim: true
            },

            balance: {
                in: ['body'],
                exists: {
                    errorMessage: WALLET_MESSAGES.START_BALANCE_REQUIRED
                },
                isNumeric: {
                    errorMessage: WALLET_MESSAGES.START_BALANCE_INVALID
                },
                custom: {
                    options: (value) => {
                        if (Number(value) < 0) throw new ErrorWithStatus({
                            message: WALLET_MESSAGES.START_BALANCE_INVALID,
                            status: HTTP_STATUS.BAD_REQUEST
                        })
                        return true
                    }
                }
            },

        },
        ['body']
    )
)

export const paginationValidator = validate(
    checkSchema(
        {
            page: {
                in: ["query"],
                optional: true,
                isInt: {
                    options: { min: 1 },
                    errorMessage: "Page must be an integer >= 1",
                },
                toInt: true,
                default: { options: 1 }
            },

            limit: {
                in: ["query"],
                optional: true,
                isInt: {
                    options: { min: 1 },
                    errorMessage: "Limit must be an integer >= 1",
                },
                toInt: true,
                default: { options: 10 }
            },
        },
        ["query"]
    )
);