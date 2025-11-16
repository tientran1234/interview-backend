import { Router } from "express"
import { createWalletController, getWalletsController } from "~/controllers/wallet.controller"
import { accessTokenValidator } from "~/middlewares/user.middlewares"
import { createWalletValidator, paginationValidator } from "~/middlewares/wallet.middlewares"
import { wrapRequestHandler } from "~/utils/handlers"

const walletsRouter = Router()
walletsRouter.post('/', accessTokenValidator, createWalletValidator, wrapRequestHandler(createWalletController))
walletsRouter.get('/', accessTokenValidator, paginationValidator, wrapRequestHandler(getWalletsController))

export default walletsRouter