import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import {
  authRouter,
  usersRouter,
  messagesRouter,
  channelsRouter,
  relationshipsRouter,
} from "./routes/index.js";

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
