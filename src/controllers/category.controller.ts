import { Request, Response } from "express"
import { CATEGORY_MESSAGES } from "~/constants/messages"
import { PaginationQuery } from "~/models/Others"
import { GetCategoriesQuery } from "~/models/requests/Category.request"
import { TokenPayload } from "~/models/requests/User.request"
import { CategoryType } from "~/models/schemas/Category.schema"
import categoryService from "~/services/category.service"

export const createCategoryController = async (req: Request<any, any, CategoryType>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await categoryService.createCategory(user_id, { name: req.body.name, type: req.body.type })
    return res.json({
        message: CATEGORY_MESSAGES.CREATE_SUCCESS,
        result
    })

}
export const getCategoriesController = async (req: Request<any, any, any, GetCategoriesQuery>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await categoryService.getCategories({
        user_id, page: Number(req.query.page), limit: Number(req.query.limit), type: req.query.type, isReport: req.query.isReport
    })
    return res.json({
        message: CATEGORY_MESSAGES.GET_SUCCESS,
        result
    })

}