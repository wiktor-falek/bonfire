import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";
import messagesRouter from "./routes/messagesRouter.js";
import channelsRouter from "./routes/channelsRouter.js";
import relationshipsRouter from "./routes/relationshipsRouter.js";

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
app.use("/api/users", usersRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/channels", channelsRouter);
app.use("/api/relationships", relationshipsRouter);

export default app;
