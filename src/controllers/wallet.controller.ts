import { Request, Response } from "express"
import { ObjectId } from "mongodb"
import { WALLET_MESSAGES } from "~/constants/messages"
import { PaginationQuery } from "~/models/Others"
import { TokenPayload } from "~/models/requests/User.request"
import { WalletType } from "~/models/schemas/Wallet.schema"
import walletsService from "~/services/wallet.service"

export const createWalletController = async (req: Request<any, any, WalletType>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await walletsService.createWallet({ ...req.body, user_id: new ObjectId(user_id) })
    return res.json({
        message: WALLET_MESSAGES.CREATE_SUCCESS,
        result
    })

}
export const getWalletsController = async (req: Request<any, any, any, PaginationQuery>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await walletsService.getWallets(user_id, Number(req.query.limit), Number(req.query.page))
    return res.json({
        message: WALLET_MESSAGES.GET_SUCCESS,
        result
    })

}
