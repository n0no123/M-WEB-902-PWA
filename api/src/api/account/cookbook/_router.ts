import {z} from 'zod';
import {Router} from 'express';

import addRecipe from "./add-recipe";
import getRecipes from "./get-recipes";
import removeRecipe from "./remove-recipe";
import parseAuthorizationHeader from "../../_misc/middlewares/parse-authorization-header";

const router = Router();

router.put(
    '/:recipeId',
    parseAuthorizationHeader(false),
    async (req, res) => {
        const parsedParams = z.object({
            recipeId: z.string().uuid(),
        }).safeParse(req.params);

        if (parsedParams.success) {
            try {
                const result = await addRecipe(parsedParams.data, req.user);

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
            res.status(400).json(parsedParams.error);
        }
    }
);

router.delete(
    '/:recipeId',
    parseAuthorizationHeader(false),
    async (req, res) => {
        const parsedParams = z.object({
            recipeId: z.string().uuid(),
        }).safeParse(req.params);

        if (parsedParams.success) {
            try {
                const result = await removeRecipe(parsedParams.data, req.user);

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
            res.status(400).json(parsedParams.error);
        }
    }
);

router.get(
    '/',
    parseAuthorizationHeader(false),
    async (req, res) => {
        try {
            const result = await getRecipes(req.user);

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

export default router;
