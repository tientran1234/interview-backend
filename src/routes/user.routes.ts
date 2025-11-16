import { Router } from "express"
import { getMeController, logoutController, oauthController } from "~/controllers/user.controller"
import { accessTokenValidator, refreshTokenValidator } from "~/middlewares/user.middlewares"
import { wrapRequestHandler } from "~/utils/handlers"

const usersRouter = Router()
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
export default usersRouter