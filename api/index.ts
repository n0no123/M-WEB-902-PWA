import datasource from "./src/misc/datasource";
import server from "./src/api/server";
import {env} from "./src/misc/env";
import {mkdir} from "fs/promises";

const main = async () => {
    await mkdir(env.upload_path, {recursive: true});
    await datasource.initialize();
    await datasource.synchronize();
    server.listen(
        env.api.port,
        () => {
            console.log(`Server is listening on port ${env.api.port}`);
        }
    );
};

main().catch(err => {
    console.log(err);
    process.exit(1);
});
