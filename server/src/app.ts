import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/authRouter.js";
import messagesRouter from "./routes/messagesRouter.js";
import usersRouter from "./routes/usersRouter.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(":status :method :url :response-time[2] ms"));

// Routers
app.use("/auth", authRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/users", usersRouter);

export default app;
