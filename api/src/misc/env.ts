const ensureEnv = (envKey: string) => {
    const value = process.env[envKey];
    if (!value) {
        throw new Error(`Environment variable ${envKey} is not set`);
    }
    return value;
}

export const env = {
    db: {
        host: ensureEnv('DB_HOST'),
        port: parseInt(ensureEnv('DB_PORT')),
        username: ensureEnv('DB_USERNAME'),
        password: ensureEnv('DB_PASSWORD'),
        database: ensureEnv('DB_NAME'),
    },
    api: {
        port: parseInt(ensureEnv('API_PORT')),
    },
    token: {
        secret: ensureEnv('TOKEN_SECRET'),
        expirationTime: ensureEnv('TOKEN_EXPIRATION_TIME'),
    },
    vapid: {
        publicKey: ensureEnv('VAPID_PUBLIC_KEY'),
        privateKey: ensureEnv('VAPID_PRIVATE_KEY'),
    },
    upload_path: ensureEnv('UPLOAD_PATH'),
}
