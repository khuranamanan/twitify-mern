import Post from "../models/posts.js";

/**
 * This handler handles creating a post in the db.
 * send POST Request at /user/posts/
 * body contains {postData}
 * */

async function createPostHandler(req, res) {
  const user = req.user;

  try {
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    const { postData } = req.body;

    if (!postData) {
      return res
        .status(400)
        .json({ errors: ["Bad Request. postData not found."] });
    }

    const { content, media } = postData;

    const post = new Post({
      content,
      media: media ? media : {},
      likes: {
        likeCount: 0,
        likedBy: [],
        dislikedBy: [],
      },
      username: user.username,
      user: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await post.save();

    const populatedPosts = await Post.find().populate({
      path: "user",
      select: "_id firstName lastName username profileImg",
    });

    res.status(201).json({ posts: populatedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles updating a post in the db.
 * send POST Request at /posts/edit/:postId
 * body contains { postData }
 * */

async function editPostHandler(req, res) {
  const user = req.user;
  const postId = req.params.postId;
  const { postData } = req.body;

  if (!postData) {
    return res
      .status(400)
      .json({ errors: ["Bad Request. postdata not found."] });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ errors: ["Post not found"] });
    }

    if (post.username !== user.username) {
      return res.status(400).json({
        errors: [
          "Cannot edit a post that doesn't belong to the logged-in User",
        ],
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ errors: ["Post not found"] });
    }

    const posts = await Post.find().populate({
      path: "user",
      select: "_id firstName lastName username profileImg",
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles deleting a post in the db.
 * send DELETE Request at /posts/:postId
 * */

async function deletePostHandler(req, res) {
  const user = req.user;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ errors: ["Post not found"] });
    }

    if (post.username !== user.username) {
      return res.status(400).json({
        errors: [
          "Cannot delete a post that doesn't belong to the logged-in User",
        ],
      });
    }

    await Post.findByIdAndRemove(postId);

    const populatedPosts = await Post.find().populate({
      path: "user",
      select: "_id firstName lastName username profileImg",
    });

    res.status(201).json({ posts: populatedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles gets all posts in the db.
 * send GET Request at /posts
 * */

async function getAllPostsHandler(req, res) {
  try {
    const posts = await Post.find().populate({
      path: "user",
      select: "_id firstName lastName username profileImg",
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler gets post by postId in the db.
 * send GET Request at /posts/:postId
 * */

async function getPostByIdHandler(req, res) {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId).populate({
      path: "user",
      select: "_id firstName lastName username profileImg",
    });

    if (!post) {
      return res.status(404).json({ errors: ["Post not found"] });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler gets posts of a user in the db.
 * send GET Request at /posts/user/:username
 * */

async function getAllUserPostsHandler(req, res) {
  const username = req.params.username;

  try {
    const posts = await Post.find({ username }).populate({
      path: "user",
      select: "_id firstName lastName username profileImg",
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles liking a post in the db.
 * send POST Request at /posts/like/:postId
 * */

async function likePostHandler(req, res) {
  const user = req.user;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ errors: ["Post not found"] });
    }

    if (post.likes.likedBy.includes(user._id)) {
      return res
        .status(400)
        .json({ errors: ["Cannot like a post that is already liked"] });
    }

    post.likes.likedBy.push(user._id);
    post.likes.likeCount = post.likes.likedBy.length;

    await post.save();

    const posts = await Post.find().populate({
      path: "user",
      select: "_id firstName lastName username profileImg",
    });

    res.status(201).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles disliking a post in the db.
 * send POST Request at /posts/dislike/:postId
 * */

async function dislikePostHandler(req, res) {
  const user = req.user;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ errors: ["Post not found"] });
    }

    const userIndex = post.likes.likedBy.indexOf(user._id);

    if (userIndex === -1) {
      return res
        .status(400)
        .json({ errors: ["Cannot dislike a post that is not liked"] });
    }

    post.likes.likedBy.remove(user._id);
    post.likes.likeCount = post.likes.likedBy.length;

    await post.save();

    const posts = await Post.find().populate({
      path: "user",
      select: "_id firstName lastName username profileImg",
    });

    res.status(201).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export {
  createPostHandler,
  editPostHandler,
  deletePostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
  getAllUserPostsHandler,
  likePostHandler,
  dislikePostHandler,
};
