import { checkSchema } from "express-validator";
import { validate } from "~/utils/validation";
import { CATEGORY_MESSAGES } from "~/constants/messages";

export const createCategoryValidator = validate(
    checkSchema(
        {
            name: {
                in: ["body"],
                isString: {
                    errorMessage: CATEGORY_MESSAGES.NAME_MUST_BE_STRING
                },
                notEmpty: {
                    errorMessage: CATEGORY_MESSAGES.NAME_REQUIRED
                },
                trim: true
            },
            type: {
                in: ["body"],
                isString: true,
                notEmpty: {
                    errorMessage: CATEGORY_MESSAGES.TYPE_REQUIRED
                },
                custom: {
                    options: (value) => ["income", "expense"].includes(value),
                    errorMessage: CATEGORY_MESSAGES.TYPE_INVALID
                }
            }
        },
        ["body"]
    )
);

// GET /categories
export const getCategoriesValidator = validate(
    checkSchema(
        {
            page: {
                in: ["query"],
                optional: true,
                isInt: {
                    options: { min: 1 },
                    errorMessage: "Trang phải là số nguyên >= 1"
                },
                toInt: true,
                default: { options: 1 }
            },
            limit: {
                in: ["query"],
                optional: true,
                isInt: {
                    options: { min: 1 },
                    errorMessage: "Limit phải là số nguyên >= 1"
                },
                toInt: true,
                default: { options: 20 }
            },
            type: {
                in: ["query"],
                optional: true,
                isString: true,
                custom: {
                    options: (value) => ["income", "expense"].includes(value),
                    errorMessage: CATEGORY_MESSAGES.TYPE_INVALID
                }
            },
            isReport: {
                in: ["query"],
                optional: true,
                isString: true,

            }
        },
        ["query"]
    )
);
