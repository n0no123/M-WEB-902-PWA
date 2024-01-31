import {z} from 'zod';
import {Router} from 'express';
import create from "./create";
import login from "./login"
import subscribe from "./subscribe"

import cookbookRouter from "./cookbook/_router";
import parseAuthorizationHeader from "../_misc/middlewares/parse-authorization-header";

import {Request, Response} from "express";
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
            console.log(e);
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
    }).safeParse(req.query);

    if (parsedParams.success) {
        try {
            const result = await login(parsedParams.data);

            if (result.status === 200) {
                res.status(result.status).json(result.body);
            } else {
                res.status(result.status).send(result.errorMessage);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    } else {
        res.status(400).json(parsedParams.error);
    }
});
router.post('/subscribe', parseAuthorizationHeader(false), async (req: Request, res: Response) => {
    const parsedParams = z.object({
        subscription: z.object({
            endpoint: z.string(),
            keys: z.object({
                p256dh: z.string(),
                auth: z.string(),
            }),
        }),
    }).safeParse(req.body);

    if (parsedParams.success) {
        try {
            const result = await subscribe(parsedParams.data, req.user);

            if (result.status === 200) {
                res.sendStatus(result.status)
            } else {
                res.status(result.status).send(result.errorMessage);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send();
        }
    } else {
        res.status(400).json(parsedParams.error);
    }
});

router.use('/cookbook', cookbookRouter);

export default router;
