import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/authRouter.js";
import messageRouter from "./routes/messageRouter.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Logging
app.use(morgan(":status :method :url :response-time[2] ms"));

app.use("/auth", authRouter);
app.use("/messages", messageRouter);

export default app;
