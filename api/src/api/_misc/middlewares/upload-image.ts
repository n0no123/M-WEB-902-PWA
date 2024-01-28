import multer from "multer";
import {Request} from "express";
import {env} from "../../../misc/env";
import path from "path";

const storage = multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
        callback(null, env.upload_path);
    },
    filename(req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    storage
});

export default upload;
