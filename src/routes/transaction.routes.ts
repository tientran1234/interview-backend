
import { Router } from "express";
import {
    createTransactionController,
    getTransactionsController,
    getStatementController
} from "~/controllers/transaction.controller";
import {
    createTransactionValidator,
    getTransactionsValidator,
    getStatementValidator
} from "~/middlewares/transaction.middlewares";
import { accessTokenValidator } from "~/middlewares/user.middlewares";
import { wrapRequestHandler } from "~/utils/handlers";

const transactionsRouter = Router();


transactionsRouter.post(
    "/",
    accessTokenValidator,
    createTransactionValidator,
    wrapRequestHandler(createTransactionController)
);


transactionsRouter.get(
    "/",
    accessTokenValidator,
    getTransactionsValidator,
    wrapRequestHandler(getTransactionsController)
);


transactionsRouter.get(
    "/statement",
    accessTokenValidator,
    getStatementValidator,
    wrapRequestHandler(getStatementController)
);

export default transactionsRouter;
