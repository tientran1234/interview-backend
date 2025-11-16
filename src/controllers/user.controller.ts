import { Request, Response } from "express"
import { envConfig } from "~/constants/config"
import { LogoutReqBody, TokenPayload } from "~/models/requests/User.request"
import usersService from "~/services/user.service"
import { ParamsDictionary } from 'express-serve-static-core'

export const oauthController = async (req: Request, res: Response) => {
    const { code } = req.query
    const result = await usersService.oauth(code as string)
    const urlRedirect = `${envConfig.clientRedirectCallback}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&new_user=${result.newUser}`
    return res.redirect(urlRedirect)
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
    const { refresh_token } = req.body
    const result = await usersService.logout(refresh_token)
    return res.json(result)
}
export const getMeController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersService.getMe(user_id)
    return res.json(result)
}