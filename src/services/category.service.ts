import { Category, CategoryKind } from "~/models/schemas/Category.schema";
import databaseService from "./database.service";
import { ObjectId } from "mongodb";
class CategoryService {
    async createCategory(user_id: string, payload: { name: string; type: CategoryKind }) {
        const userObjectId = new ObjectId(user_id);
        const category = new Category({
            name: payload.name,
            type: payload.type,
            user_id: userObjectId
        });
        const result = await databaseService.categories.insertOne(category);
        return {
            ...category,
            _id: result.insertedId
        };
    }
    async getCategories(params: {
        user_id: string;
        type?: CategoryKind;
        page: number;
        limit: number;
        isReport?: string
    }) {
        const userObjectId = new ObjectId(params.user_id);
        let filter: any = {}


        if (params.isReport) {
            filter = {
                $or: [
                    { user_id: userObjectId },
                    { user_id: undefined },
                    { is_default: true }
                ]
            }
        } else {
            filter = {
                $or: [
                    { user_id: userObjectId },
                    { is_default: true }
                ]
            }

        }



        if (params.type) {
            filter.type = params.type;
        }

        const safeLimit = Math.max(1, Math.min(params.limit || 20, 100));
        const safePage = Math.max(1, params.page || 1);
        const skip = (safePage - 1) * safeLimit;

        const cursor = databaseService.categories
            .find(filter)
            .skip(skip)
            .limit(safeLimit)
            .sort({ created_at: -1 });

        const [items, total] = await Promise.all([
            cursor.toArray(),
            databaseService.categories.countDocuments(filter)
        ]);

        return {
            items,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit)
            }
        };
    }
}

const categoryService = new CategoryService();
export default categoryService;
