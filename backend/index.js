require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { dbConnect } = require("./src/db/dbConnect.js");
const { authRouter } = require("./src/routes/authRouter.js");
const { usersRouter } = require("./src/routes/usersRouter.js");
const Post = require("./src/models/posts.js");
const { postsRouter } = require("./src/routes/postsRouter.js");

const PORT = process.env.PORT || 5000;
const app = express();

dbConnect();

app.use(express.json());
app.use(cors({ origin: "https://twitify-mern.vercel.app" }));
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

module.exports = app;
