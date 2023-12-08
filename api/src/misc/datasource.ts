import {DataSource} from "typeorm";
import {env} from "./env";
import {User} from "../models/user";

const datasource = new DataSource({
    type: "postgres",
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    synchronize: true,
    logging: "all",
    entities: [
        User
    ]
});

export default datasource;
