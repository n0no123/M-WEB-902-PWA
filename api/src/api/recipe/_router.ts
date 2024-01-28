import {z} from "zod";
import create from "./create";
import {Router} from "express";
import parseAuthorizationHeader from "../_misc/middlewares/parse-authorization-header";
import getById from "./get-by-id";
import rate from "./rate";
import lookup from "./lookup";
import edit from "./edit";
import upload from "../_misc/middlewares/upload-image";
import coerceArrayOfString from "../_misc/zod/coerce-array-of-string";

const router = Router();

const coerceIngredients = z.string()
    .refine(
        (val) => {
            try {
                JSON.parse(val);
                return true;
            } catch (e) {
                return false;
            }
        }, {
            message: 'Must be a valid JSON'
        }
    )
    .transform((val) => JSON.parse(val) as unknown)
    .refine(
        (parsed) => Array.isArray(parsed),
        {
            message: 'Must be an array'
        }
    )
    .transform((val) => val as unknown[])
    .refine(
        (val) => val.every((item) => typeof item === 'object'),
        {
            message: 'Must be an array of objects'
        }
    )
    .transform((val) => val as object[])
    .refine(
        (val) => val.every((item) => "name" in item && "quantityWithUnit" in item),
        {
            message: 'Must be an array of objects with name and quantityWithUnit'
        }
    )
    .transform((val) => val as { name: unknown, quantityWithUnit: unknown }[])
    .refine(
        (val) => val.every((item) => typeof item.name === 'string'),
        {
            message: 'Must be an array of objects with name as string'
        }
    )
    .transform((val) => val as { name: string, quantityWithUnit: unknown }[])
    .refine(
        (val) => val.every((item) => typeof item.quantityWithUnit === 'string'),
        {
            message: 'Must be an array of objects with quantityWithUnit as string'
        }
    )
    .transform((val) => val as { name: string, quantityWithUnit: string }[])
    .refine(
        (val) => val.every((item) => item.name.length > 0),
        {
            message: 'Must be an array of objects with name as non-empty string'
        }
    )
    .refine(
        (val) => val.every((item) => item.quantityWithUnit.length > 0),
        {
            message: 'Must be an array of objects with quantityWithUnit as non-empty string'
        }
    );

router.put(
    '/',
    upload.single("image"),
    parseAuthorizationHeader(false),
    async (req, res) => {
        console.log(req);
        const parsedParams = z.object({
            name: z.string(),
            description: z.string(),
            steps: coerceArrayOfString,
            tags: coerceArrayOfString,
            cookingTimeInMinutes: z.coerce.number().nonnegative(),
            preparationTimeInMinutes: z.coerce.number().nonnegative(),
            ingredients: coerceIngredients,
            servings: z.coerce.number().min(1),
        }).safeParse(req.body)
        const parsedFile =
            z.object({
                filename: z.string(),
            })
            .optional()
            .safeParse(req.file);

        if (parsedParams.success) {
            if (parsedFile.success) {
                try {
                    const result = await create(
                        {
                            ...parsedParams.data,
                            imageName: parsedFile?.data?.filename
                        },
                        req.user
                    );
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
                res.status(400).json(parsedFile.error);
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
