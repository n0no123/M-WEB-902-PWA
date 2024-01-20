import { Request, Response, NextFunction } from 'express';
import {User} from "../../../models/user";
import {decode} from "jsonwebtoken";
import datasource from "../../../misc/datasource";

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

const parseAuthorizationHeader = (optional: boolean) => async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        if (optional) {
            next();
            return;
        }
        res.status(401).json({ message: 'Missing authorization header' });
        return;
    }
    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer') {
        res.status(401).json({ message: 'Invalid authorization header' });
        return;
    }
    if (!token) {
        res.status(401).json({ message: 'Missing token' });
        return;
    }
    const userId = decode(token);

    if (!userId || typeof userId !== 'object' || typeof userId.id !== 'string') {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    const user = await datasource.getRepository(User).findOne({
        where: {id: userId.id},
        relations: ["ratings", "cookbook", "myRecipes"]
    }, );

    if (!user) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    req.user = user;
    next();
}

export default parseAuthorizationHeader;
