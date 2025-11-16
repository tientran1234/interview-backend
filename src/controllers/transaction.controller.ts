
import { Request, Response } from "express";
import {
    GetTransactionsReqQuery,
    GetStatementReqQuery
} from "~/middlewares/transaction.middlewares";
import { TRANSACTION_MESSAGES } from "~/constants/messages";
import { CreateTransactionReqBody } from "~/models/requests/Transaction.request";
import transactionService from "~/services/transaction.service";
import { TokenPayload } from "~/models/requests/User.request";

export const createTransactionController = async (
    req: Request<unknown, unknown, CreateTransactionReqBody>,
    res: Response
) => {
    const { user_id } = (req as any).decoded_authorization as TokenPayload;

    const data = await transactionService.createTransaction(user_id, {
        wallet_id: req.body.wallet_id,
        category_id: req.body.category_id,
        type: req.body.type,
        amount: req.body.amount,
        description: req.body.description,
        trans_date: req.body.trans_date
    });

    return res.json({
        message: TRANSACTION_MESSAGES.CREATE_SUCCESS,
        data
    });
};


export const getTransactionsController = async (
    req: Request<unknown, unknown, unknown, GetTransactionsReqQuery>,
    res: Response
) => {
    const { user_id } = (req as any).decoded_authorization as TokenPayload;

    const { page = 1, limit = 20, wallet_id, type, from_date, to_date } =
        req.query;

    const data = await transactionService.getTransactions(user_id, {
        page: Number(page),
        limit: Number(limit),
        wallet_id,
        type,
        from_date,
        to_date
    });

    return res.json({
        message: TRANSACTION_MESSAGES.LIST_SUCCESS,
        result: { ...data }
    });
};


export const getStatementController = async (
    req: Request<unknown, unknown, unknown, GetStatementReqQuery>,
    res: Response
) => {
    const { user_id } = (req as any).decoded_authorization as TokenPayload;
    const { wallet_id, from_date, to_date } = req.query;

    const from = new Date(from_date);
    const to = new Date(to_date);
    const data = await transactionService.getStatement(user_id, {
        wallet_id,
        from_date: from,
        to_date: to
    });

    return res.json({
        message: "Lấy sao kê giao dịch thành công",
        data
    });
};
