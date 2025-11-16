import { ObjectId } from "mongodb";

import {
    Transaction,
    TransactionKind,
    TransactionType
} from "~/models/schemas/Transaction.schema";
import HTTP_STATUS from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Errors";
import { TRANSACTION_MESSAGES, WALLET_MESSAGES } from "~/constants/messages";
import databaseService from "./database.service";

class TransactionService {
    private async getWalletCurrentBalance(wallet_id: ObjectId) {
        const wallet = await databaseService.wallets.findOne({ _id: wallet_id });
        if (!wallet) {
            throw new ErrorWithStatus({
                message: WALLET_MESSAGES.NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            });
        }

        return wallet.balance;
    }

    private async getWalletBalanceAtDate(wallet_id: ObjectId, at: Date) {
        const wallet = await databaseService.wallets.findOne({ _id: wallet_id });
        if (!wallet) {
            throw new ErrorWithStatus({
                message: WALLET_MESSAGES.NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            });
        }

        const startDate = wallet.start_balance_date;


        const agg = await databaseService.transactions
            .aggregate([
                {
                    $match: {
                        wallet_id,
                        trans_date: { $gte: new Date(startDate), $lt: at }
                    }
                },
                {
                    $group: {
                        _id: null,
                        income: {
                            $sum: {
                                $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                            }
                        },
                        expense: {
                            $sum: {
                                $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                            }
                        }
                    }
                }
            ])
            .toArray();



        const data = agg[0] || { income: 0, expense: 0 };

        return data.income - data.expense;
    }


    async createTransaction(
        user_id: string,
        payload: {
            wallet_id: string;
            category_id: string;
            type: TransactionKind;
            amount: number;
            description?: string;
            trans_date: Date;
        }
    ) {
        const userObjectId = new ObjectId(user_id);
        const walletObjectId = new ObjectId(payload.wallet_id);
        const categoryObjectId = new ObjectId(payload.category_id);

        const wallet = await databaseService.wallets.findOne({
            _id: walletObjectId,
            user_id: userObjectId
        });

        if (!wallet) {
            throw new ErrorWithStatus({
                message: TRANSACTION_MESSAGES.WALLET_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            });
        }

        if (payload.type === "expense") {
            const currentBalance = await this.getWalletCurrentBalance(walletObjectId);
            if (payload.amount > currentBalance) {
                throw new ErrorWithStatus({
                    message: TRANSACTION_MESSAGES.EXCEED_BALANCE,
                    status: HTTP_STATUS.BAD_REQUEST
                });
            }
        }

        const transaction = new Transaction({
            user_id: userObjectId,
            wallet_id: walletObjectId,
            category_id: categoryObjectId,
            type: payload.type,
            amount: payload.amount,
            description: payload.description,
            trans_date: payload.trans_date
        } as TransactionType);

        const result = await databaseService.transactions.insertOne(transaction);

        const delta = payload.type === "income" ? payload.amount : -payload.amount;

        await databaseService.wallets.updateOne(
            {
                _id: walletObjectId,
                user_id: userObjectId
            },
            {
                $inc: { balance: delta }
            }
        );

        return {
            ...transaction,
            _id: result.insertedId
        };
    }

    async getTransactions(
        user_id: string,
        params: {
            page: number;
            limit: number;
            wallet_id?: string;
            type?: TransactionKind;
            from_date?: Date;
            to_date?: Date;
        }
    ) {
        const page = Math.max(1, params.page || 1);
        const limit = Math.max(1, Math.min(params.limit || 20, 100));
        const skip = (page - 1) * limit;

        const filter: any = {
            user_id: new ObjectId(user_id)
        };

        if (params.wallet_id) {
            filter.wallet_id = new ObjectId(params.wallet_id);
        }

        if (params.type) {
            filter.type = params.type;
        }

        if (params.from_date || params.to_date) {
            filter.trans_date = {};
            if (params.from_date) filter.trans_date.$gte = params.from_date;
            if (params.to_date) filter.trans_date.$lte = params.to_date;
        }

        const cursor = databaseService.transactions
            .find(filter)
            .sort({ trans_date: -1, created_at: -1 })
            .skip(skip)
            .limit(limit);

        const [items, total] = await Promise.all([
            cursor.toArray(),
            databaseService.transactions.countDocuments(filter)
        ]);

        return {
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getStatement(
        user_id: string,
        params: { wallet_id: string; from_date: Date; to_date: Date }
    ) {


        const userObjectId = new ObjectId(user_id);
        const walletObjectId = new ObjectId(params.wallet_id);

        const wallet = await databaseService.wallets.findOne({
            _id: walletObjectId,
            user_id: userObjectId
        });

        if (!wallet) {
            throw new ErrorWithStatus({
                message: TRANSACTION_MESSAGES.WALLET_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            });
        }

        const from = params.from_date;
        const to = params.to_date;



        if (from > to) {
            throw new ErrorWithStatus({
                message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
                status: HTTP_STATUS.BAD_REQUEST
            });
        }

        const opening_balance = await this.getWalletBalanceAtDate(
            walletObjectId,
            from
        );


        const agg = await databaseService.transactions
            .aggregate([
                {
                    $match: {
                        wallet_id: walletObjectId,
                        user_id: userObjectId,
                        trans_date: { $gte: from, $lte: to }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total_income: {
                            $sum: {
                                $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                            }
                        },
                        total_expense: {
                            $sum: {
                                $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                            }
                        }
                    }
                }
            ])
            .toArray();



        const summary = agg[0] || { total_income: 0, total_expense: 0 };

        const total_income = summary.total_income || 0;
        const total_expense = summary.total_expense || 0;
        const closing_balance = opening_balance + total_income - total_expense;

        const items = await databaseService.transactions
            .find({
                wallet_id: walletObjectId,
                user_id: userObjectId,
                trans_date: { $gte: from, $lte: to }
            })
            .sort({ trans_date: 1 })
            .toArray();

        return {
            wallet: {
                _id: walletObjectId,
                name: (wallet as any).name,
                current_balance: (wallet as any).balance ?? null
            },
            period: {
                from_date: from,
                to_date: to
            },
            opening_balance,
            total_income,
            total_expense,
            closing_balance,
            items
        };
    }
}

const transactionService = new TransactionService();
export default transactionService;
