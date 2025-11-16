import { Router } from "express"
import { createCategoryController, getCategoriesController } from "~/controllers/category.controller"
import { createCategoryValidator, getCategoriesValidator } from "~/middlewares/category.middlewares"
import { accessTokenValidator } from "~/middlewares/user.middlewares"
import { wrapRequestHandler } from "~/utils/handlers"

const categoriesRouter = Router()
categoriesRouter.post('/', accessTokenValidator, createCategoryValidator, wrapRequestHandler(createCategoryController))
categoriesRouter.get('/', accessTokenValidator, getCategoriesValidator, wrapRequestHandler(getCategoriesController))

export default categoriesRouter