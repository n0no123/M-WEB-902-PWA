import multer from "multer";
import {Request} from "express";
import {env} from "../../../misc/env";

const mimeTypes = ['image/jpeg', 'image/png'];

const mimeTypeToExtension = {
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


const storage = multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
        callback(null, env.upload_path);
    },
    filename(req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
        if (!mimeTypes.includes(file.mimetype)) {
            callback(new Error(`Invalid mime type ${file.mimetype}`), "");
        } else {
            callback(null, Date.now() + mimeTypeToExtension[file.mimetype as keyof typeof mimeTypeToExtension]);
        }
    }
});

const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    storage
});

export default upload;
