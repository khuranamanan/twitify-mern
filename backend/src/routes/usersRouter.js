import express from "express";
import {
  addToBookmarkHandler,
  editUserHandler,
  followAUserHandler,
  getAllUserBookmarkPosts,
  getAllUsers,
  getUserByUsername,
  removeFromBookmarkHandler,
  unfollowAUserHandler,
} from "../controllers/usersController.js";
import authenticateToken from "../middleware/authenticateToken.js";
const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);

usersRouter.get("/bookmark", authenticateToken, getAllUserBookmarkPosts);

usersRouter.get("/:username", getUserByUsername);

usersRouter.post("/edit", authenticateToken, editUserHandler);

usersRouter.post("/bookmark/:postId", authenticateToken, addToBookmarkHandler);

usersRouter.post(
  "/remove-bookmark/:postId",
  authenticateToken,
  removeFromBookmarkHandler
);

usersRouter.post(
  "/follow/:followUserId",
  authenticateToken,
  followAUserHandler
);

usersRouter.post(
  "/unfollow/:unfollowUserId",
  authenticateToken,
  unfollowAUserHandler
);

export { usersRouter };
