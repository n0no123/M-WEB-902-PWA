import express from "express";
import cors from "cors";
import morgan from "morgan";
import accountRouter from "./account/_router";
import recipeRouter from "./recipe/_router";
import {env} from "../misc/env";
import bodyParser from "body-parser";

const app = express();
const images = express.static(env.upload_path);

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/images", images);
app.use("/account", accountRouter);
app.use("/recipe", recipeRouter);

export default app;
