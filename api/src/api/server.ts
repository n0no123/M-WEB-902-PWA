import express from "express";
import morgan from "morgan";
import accountRouter from "./account/_router";
import recipeRouter from "./recipe/_router";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use("/account", accountRouter);
app.use("/recipe", recipeRouter);

export default app;
