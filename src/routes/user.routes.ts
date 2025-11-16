import { Router } from "express"
import { getMeController, logoutController, oauthController, refreshTokenController } from "~/controllers/user.controller"
import { accessTokenValidator, refreshTokenValidator } from "~/middlewares/user.middlewares"
import { wrapRequestHandler } from "~/utils/handlers"

const usersRouter = Router()
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

export default usersRouter