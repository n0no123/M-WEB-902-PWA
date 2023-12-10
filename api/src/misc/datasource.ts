import {DataSource} from "typeorm";
import {env} from "./env";
import {User} from "../models/user";
import {Recipe} from "../models/recipe";
import {Ingredient} from "../models/ingredient";
import {Rating} from "../models/rating";
import {Cookbook} from "../models/cookbook";

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
        User,
        Recipe,
        Ingredient,
        Rating,
        Cookbook
    ]
});

export default datasource;
