import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth";
import skinRoutes from "./routes/skin";

dotenv.config();

const app = express();

if (!process.env.MONGODB_HOST || !process.env.SECRET) process.exit();

// Database connection
mongoose
  .connect(process.env.MONGODB_HOST)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

// Settings
app.set("port", process.env.PORT || 4000);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(morgan("tiny"));

const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1"],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};
app.use(cors(corsOptions));

// Routes
app.use("/api", authRoutes);
app.use("/api", skinRoutes);

app.listen(app.get("port"), () => {
  console.log(`Listening on port ${app.get("port")}...`);
});
