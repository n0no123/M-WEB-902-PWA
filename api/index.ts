import datasource from "./src/misc/datasource";
import server from "./src/api/server";
import {env} from "./src/misc/env";

const main = async () => {
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
    console.error(err);
    process.exit(1);
});
