import {z} from "zod";
import create from "./create";
import {Router} from "express";
import ensureUserAuthenticated from "../_misc/middlewares/ensure-user-authenticated";

const router = Router();
type IngredientDto = {
    name: string;
    quantityWithUnit: string;
}

type Params = {
    name: string;
    description: string;
    steps: string[];
    tags: string[];
    cookingTimeInMinutes: number;
    preparationTimeInMinutes: number;
    ingredients: IngredientDto[];
    servings: number;
}

router.put('/', ensureUserAuthenticated, async (req, res) => {
    const parsedParams = z.object({
        name: z.string(),
        description: z.string(),
        steps: z.array(z.string()),
        tags: z.array(z.string()),
        cookingTimeInMinutes: z.number().positive(),
        preparationTimeInMinutes: z.number().positive(),
        ingredients: z.array(
            z.object({
                name: z.string(),
                quantityWithUnit: z.string(),
            })
        ),
        servings: z.number().min(1),
    }).safeParse(req.body);

    if (parsedParams.success) {
        const result = await create(parsedParams.data, req.user);

        if (result.status === 200) {
            res.status(result.status).json(result.body);
        } else {
            res.status(result.status);
        }
    } else {
        res.status(400).json(parsedParams.error);
    }
});

export default router;
