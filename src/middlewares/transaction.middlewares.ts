
import { checkSchema } from "express-validator";
import { validate } from "~/utils/validation";
import { TRANSACTION_MESSAGES, WALLET_MESSAGES } from "~/constants/messages";

export interface GetTransactionsReqQuery {
    page?: number;
    limit?: number;
    wallet_id?: string;
    type?: "income" | "expense";
    from_date?: Date;
    to_date?: Date;
}

export interface GetStatementReqQuery {
    wallet_id: string;
    from_date: Date;
    to_date: Date;
}


export const createTransactionValidator = validate(
    checkSchema(
        {
            wallet_id: {
                in: ["body"],
                notEmpty: {
                    errorMessage: WALLET_MESSAGES.INVALID_WALLET_ID
                },
                isMongoId: {
                    errorMessage: WALLET_MESSAGES.INVALID_WALLET_ID
                }
            },
            category_id: {
                in: ["body"],
                notEmpty: {
                    errorMessage: TRANSACTION_MESSAGES.CATEGORY_REQUIRED
                },
                isMongoId: {
                    errorMessage: TRANSACTION_MESSAGES.CATEGORY_REQUIRED
                }
            },
            type: {
                in: ["body"],
                notEmpty: {
                    errorMessage: TRANSACTION_MESSAGES.TYPE_REQUIRED
                },
                isString: true,
                custom: {
                    options: (value) => ["income", "expense"].includes(value),
                    errorMessage: TRANSACTION_MESSAGES.TYPE_INVALID
                }
            },
            amount: {
                in: ["body"],
                notEmpty: {
                    errorMessage: TRANSACTION_MESSAGES.AMOUNT_INVALID
                },
                isFloat: {
                    options: { gt: 0 },
                    errorMessage: TRANSACTION_MESSAGES.AMOUNT_INVALID
                },
                toFloat: true
            },
            description: {
                in: ["body"],
                optional: true,
                isString: {
                    errorMessage: TRANSACTION_MESSAGES.DESCRIPTION_INVALID
                },
                trim: true
            },
            trans_date: {
                in: ["body"],
                notEmpty: {
                    errorMessage: TRANSACTION_MESSAGES.DATE_INVALID
                },
                isISO8601: {
                    errorMessage: TRANSACTION_MESSAGES.DATE_INVALID
                },
                toDate: true
            }
        },
        ["body"]
    )
);


export const getTransactionsValidator = validate(
    checkSchema(
        {
            page: {
                in: ["query"],
                optional: true,
                isInt: {
                    options: { min: 1 },
                    errorMessage: "Trang phải là số nguyên >= 1"
                },
                toInt: true,
                default: { options: 1 }
            },
            limit: {
                in: ["query"],
                optional: true,
                isInt: {
                    options: { min: 1 },
                    errorMessage: "Limit phải là số nguyên >= 1"
                },
                toInt: true,
                default: { options: 20 }
            },
            wallet_id: {
                in: ["query"],
                optional: true,
                isMongoId: {
                    errorMessage: WALLET_MESSAGES.INVALID_WALLET_ID
                }
            },
            type: {
                in: ["query"],
                optional: true,
                isString: true,
                custom: {
                    options: (value) =>
                        value === "income" || value === "expense",
                    errorMessage: TRANSACTION_MESSAGES.TYPE_INVALID
                }
            },
            from_date: {
                in: ["query"],
                optional: true,
                isISO8601: {
                    errorMessage: TRANSACTION_MESSAGES.DATE_INVALID
                },
                toDate: true
            },
            to_date: {
                in: ["query"],
                optional: true,
                isISO8601: {
                    errorMessage: TRANSACTION_MESSAGES.DATE_INVALID
                },
                toDate: true
            }
        },
        ["query"]
    )
);


export const getStatementValidator = validate(
    checkSchema(
        {
            wallet_id: {
                in: ["query"],
                notEmpty: {
                    errorMessage: WALLET_MESSAGES.INVALID_WALLET_ID
                },
                isMongoId: {
                    errorMessage: WALLET_MESSAGES.INVALID_WALLET_ID
                }
            },
            from_date: {
                in: ["query"],
                notEmpty: {
                    errorMessage: TRANSACTION_MESSAGES.DATE_INVALID
                },
                isISO8601: {
                    errorMessage: TRANSACTION_MESSAGES.DATE_INVALID
                },
                toDate: true
            },
            to_date: {
                in: ["query"],
                notEmpty: {
                    errorMessage: TRANSACTION_MESSAGES.DATE_INVALID
                },
                isISO8601: {
                    errorMessage: TRANSACTION_MESSAGES.DATE_INVALID
                },
                toDate: true
            }
        },
        ["query"]
    )
);
