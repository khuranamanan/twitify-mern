import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { dbConnect } from "./db/dbConnect.js";
import { authRouter } from "./routes/authRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import Post from "./models/posts.js";
import { postsRouter } from "./routes/postsRouter.js";

const PORT = process.env.PORT || 5000;
const app = express();

dbConnect();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
  console.log(`Request Received: ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Twitify Backend");
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
