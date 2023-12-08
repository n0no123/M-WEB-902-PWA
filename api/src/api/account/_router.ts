import {z} from 'zod';
import {Router} from 'express';
import create from "./create";
import login from "./login"

const router = Router();

router.put('/', async (req, res) => {
    const parsedParams = z.object({
        email: z.string().email(),
        password: z.string(),
    }).safeParse(req.body);

    if (parsedParams.success) {
        try {
            const result = await create(parsedParams.data);

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
});

router.get('/', async (req, res) => {
    const parsedParams = z.object({
        email: z.string(),
        password: z.string(),
    }).safeParse(req.body);

    if (parsedParams.success) {
        try {
            const result = await login(parsedParams.data);

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
});

export default router;
