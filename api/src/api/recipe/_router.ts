import {z} from "zod";
import create from "./create";
import {Router} from "express";
import parseAuthorizationHeader from "../_misc/middlewares/parse-authorization-header";
import getById from "./get-by-id";
import rate from "./rate";
import lookup from "./lookup";
import edit from "./edit";

const router = Router();


router.put(
    '/',
    parseAuthorizationHeader(false),
    async (req, res) => {
        const parsedParams = z.object({
            name: z.string(),
            description: z.string(),
            steps: z.array(z.string()),
            tags: z.array(z.string()),
            cookingTimeInMinutes: z.number().nonnegative(),
            preparationTimeInMinutes: z.number().nonnegative(),
            ingredients: z.array(
                z.object({
                    name: z.string(),
                    quantityWithUnit: z.string(),
                })
            ),
            servings: z.number().min(1),
        }).safeParse(req.body);

        if (parsedParams.success) {
            try {
                const result = await create(parsedParams.data, req.user);

                if (result.status === 200) {
                    res.status(result.status).json(result.body);
                } else {
                    res.status(result.status).send(result.errorMessage);
                }
            } catch (e) {
                console.error(e);
                res.status(500).send();
            }

        } else {
            res.status(400).json(parsedParams.error);
        }
    }
);

router.get(
    '/',
    async (req, res) => {
        try {
            const result = await lookup();

            if (result.status === 200) {
                res.status(result.status).json(result.body);
            } else {
                res.status(result.status).send(result.errorMessage);
            }
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    }
);

router.get(
    '/:id',
    parseAuthorizationHeader(true),
    async (req, res) => {
        const parsedParams = z.object({
            id: z.string().uuid(),
        }).safeParse(req.params);

        if (parsedParams.success) {
            try {
                const result = await getById({recipeId: parsedParams.data.id}, req.user);

                if (result.status === 200) {
                    res.status(result.status).json(result.body);
                } else {
                    res.status(result.status).send(result.errorMessage);
                }
            } catch (e) {
                console.error(e);
                res.status(500).send();
            }

        } else {
            res.status(400).json(parsedParams.error);
        }
    }
);

router.put(
    '/:id',
    parseAuthorizationHeader(true),
    async (req, res) => {
        const parsedParams = z.object({
            id: z.string().uuid(),
        }).safeParse(req.params);
        const parsedBody = z.object({
            name: z.string(),
            description: z.string(),
            steps: z.array(z.string()),
            tags: z.array(z.string()),
            cookingTimeInMinutes: z.number().nonnegative(),
            preparationTimeInMinutes: z.number().nonnegative(),
            ingredients: z.array(
                z.object({
                    name: z.string(),
                    quantityWithUnit: z.string(),
                })
            ),
            servings: z.number().min(1),
        }).safeParse(req.body);

        if (parsedParams.success && parsedBody.success) {
            try {
                const result = await edit({
                    recipeId: parsedParams.data.id,
                    name: parsedBody.data.name,
                    description: parsedBody.data.description,
                    steps: parsedBody.data.steps,
                    tags: parsedBody.data.tags,
                    cookingTimeInMinutes: parsedBody.data.cookingTimeInMinutes,
                    preparationTimeInMinutes: parsedBody.data.preparationTimeInMinutes,
                    ingredients: parsedBody.data.ingredients,
                    servings: parsedBody.data.servings,
                }, req.user);

                if (result.status === 200) {
                    res.status(result.status).json(result.body);
                } else {
                    res.status(result.status).send(result.errorMessage);
                }
            } catch (e) {
                console.error(e);
                res.status(500).send();
            }

        } else {
            if (!parsedParams.success) {
                res.status(400).json(parsedParams.error);
            } else if (!parsedBody.success) {
                res.status(400).json(parsedBody.error);
            }
        }
    }
);

router.put(
    '/rate/:id',
    parseAuthorizationHeader(false),
    async (req, res) => {
        const parsedQuery = z.object({
            id: z.string().uuid(),
        }).safeParse(req.params);
        const parsedBody = z.object({
            rating: z.number().min(1).max(5),
        }).safeParse(req.body);

        if (parsedQuery.success && parsedBody.success) {
            try {
                const result = await rate({recipeId: parsedQuery.data.id, rating: parsedBody.data.rating}, req.user);

                if (result.status === 200) {
                    res.sendStatus(result.status);
                } else {
                    res.status(result.status).send(result.errorMessage);
                }
            } catch (e) {
                console.error(e);
                res.status(500).send();
            }

        } else {
            const error = !parsedQuery.success ?
                parsedQuery.error :
                (
                    (!parsedBody.success) ?
                        parsedBody.error :
                        undefined
                );

            res.status(400).json(error);
        }
    }
);

export default router;
