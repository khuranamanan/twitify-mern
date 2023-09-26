import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import {
  createPostHandler,
  deletePostHandler,
  dislikePostHandler,
  editPostHandler,
  getAllPostsHandler,
  getAllUserPostsHandler,
  getPostByIdHandler,
  likePostHandler,
} from "../controllers/postsController.js";
const postsRouter = express.Router();

postsRouter.get("/", getAllPostsHandler);

postsRouter.post("/", authenticateToken, createPostHandler);

postsRouter.post("/edit/:postId", authenticateToken, editPostHandler);

postsRouter.get("/:postId", getPostByIdHandler);

postsRouter.delete("/:postId", authenticateToken, deletePostHandler);

postsRouter.get("/user/:username", getAllUserPostsHandler);

// like/dislike routes

postsRouter.post("/like/:postId", authenticateToken, likePostHandler);

postsRouter.post("/dislike/:postId", authenticateToken, dislikePostHandler);

export { postsRouter };
