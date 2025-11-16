
import { TransactionKind } from "~/models/schemas/Transaction.schema";

export interface CreateTransactionReqBody {
    wallet_id: string;
    category_id: string;
    type: TransactionKind;
    amount: number;
    description?: string;
    trans_date: Date;
}
