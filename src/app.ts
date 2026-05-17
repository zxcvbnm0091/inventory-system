import express from "express";
import cookieParser from "cookie-parser";
import Apiroutes from "./routes/index.route";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api", Apiroutes);

export default app;
