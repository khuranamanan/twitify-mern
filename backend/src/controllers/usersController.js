import Post from "../models/posts.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

/**
 * This handler handles gets all users in the db.
 * send GET Request at /users
 * */

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").populate({
      path: "followers following",
      select: "_id firstName lastName username profileImg",
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * This handler handles get a user from username in the db.
 * send GET Request at /api/users/:username
 * */

async function getUserByUsername(req, res) {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username }, "-password").populate({
      path: "followers following",
      select: "_id firstName lastName username profileImg",
    });

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles updating user details.
 * send POST Request at /users/edit
 * body contains { userData }
 * */

async function editUserHandler(req, res) {
  const userId = req.user._id;
  const userData = req.body.userData;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    if (userData && userData.username && userData.username !== user.username) {
      return res.status(400).json({ errors: ["Username cannot be changed"] });
    }

    const userUpdate = { ...userData };

    if (userData && userData.password) {
      const saltRounds = await bcrypt.genSalt(10);
      userUpdate.password = await bcrypt.hash(userData.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, userUpdate, {
      new: true,
    })
      .select("-password")
      .populate({
        path: "followers following",
        select: "_id firstName lastName username profileImg",
      });

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles adding a post to user's bookmarks in the db.
 * send POST Request at /api/users/bookmark/:postId/
 * */

async function addToBookmarkHandler(req, res) {
  const userId = req.user._id;
  const postId = req.params.postId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        errors: ["user not found"],
      });
    }

    if (user.bookmarks.includes(postId)) {
      return res.status(400).json({
        errors: ["Post is already in bookmarks"],
      });
    }

    user.bookmarks.push(postId);
    await user.save();

    return res.status(200).json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles adding a post to user's bookmarks in the db.
 * send POST Request at /users/remove-bookmark/:postId/
 * */

async function removeFromBookmarkHandler(req, res) {
  const userId = req.user._id;
  const postId = req.params.postId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        errors: ["user not found"],
      });
    }

    if (!user.bookmarks.includes(postId)) {
      return res.status(400).json({
        errors: ["Post not bookmarked yet"],
      });
    }

    user.bookmarks.remove(postId);
    await user.save();

    return res.status(200).json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler gets all the user bookmarks from the db.
 * send GET Request at /api/users/bookmark/
 * */

async function getAllUserBookmarkPosts(req, res) {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate({
      path: "bookmarks",
      populate: {
        path: "user",
        select: "_id username firstName lastName profileImg",
      },
    });

    res.status(200).json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles follow action.
 * send POST Request at /api/users/follow/:followUserId/
 * */

async function followAUserHandler(req, res) {
  const { followUserId } = req.params;
  const userId = req.user._id;

  if (userId === followUserId) {
    return res.status(400).json({
      errors: ["You cannot follow yourself"],
    });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, following: { $ne: followUserId } },
      { $addToSet: { following: followUserId } },
      { new: true }
    )
      .select("-password")
      .populate({
        path: "following followers",
        select: "_id username firstName lastName profileImg",
      });

    if (!user) {
      return res.status(400).json({ errors: ["User Already following"] });
    }

    await User.findOneAndUpdate(
      { _id: followUserId, followers: { $ne: userId } },
      { $addToSet: { followers: userId } }
    );

    const users = await User.find({}, "-password").populate({
      path: "followers following",
      select: "_id username firstName lastName profileImg",
    });

    return res.status(200).json({
      user,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function unfollowAUserHandler(req, res) {
  const { unfollowUserId } = req.params;
  const userId = req.user._id;

  if (userId === unfollowUserId) {
    return res.status(400).json({
      errors: ["You cannot unfollow yourself"],
    });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, following: unfollowUserId },
      { $pull: { following: unfollowUserId } },
      { new: true }
    )
      .select("-password")
      .populate({
        path: "following followers",
        select: "_id username firstName lastName profileImg",
      });

    if (!user) {
      return res.status(400).json({ errors: ["User not currently following"] });
    }

    await User.findOneAndUpdate(
      { _id: unfollowUserId, followers: userId },
      { $pull: { followers: userId } }
    );

    const users = await User.find({}, "-password").populate({
      path: "followers following",
      select: "_id username firstName lastName profileImg",
    });

    return res.status(200).json({
      user,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export {
  getAllUsers,
  getUserByUsername,
  editUserHandler,
  addToBookmarkHandler,
  removeFromBookmarkHandler,
  getAllUserBookmarkPosts,
  followAUserHandler,
  unfollowAUserHandler,
};
