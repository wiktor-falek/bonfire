import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import {
  authRouter,
  usersRouter,
  messagesRouter,
  channelsRouter,
  relationsRouter,
  verifyRouter,
} from "./routes/index.js";
import config from "./config.js";

const app = express();
app.options(
  "*",
  cors({
    // origin: config.FRONTEND_URL
    origin: true,
    credentials: true,
  })
);

// Middlewares
app.use(
  cors({
    // origin: config.FRONTEND_URL
    origin: true,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(":status :method :url :response-time[2] ms"));

// Routers
app.use("/auth", authRouter);
app.use("/verify", verifyRouter);
app.use("/api/users", usersRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/channels", channelsRouter);
app.use("/api/relations", relationsRouter);

export default app;
