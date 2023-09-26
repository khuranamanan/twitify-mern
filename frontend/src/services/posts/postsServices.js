import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

export function getAllPostsService() {
  return axios.get(`${URL}/posts`);
}

export function createPostService(post, token) {
  return axios.post(
    `${URL}/posts`,
    {
      postData: post,
    },
    {
      headers: {
        authorization: token,
      },
    }
  );
}

export function deleteUsersPostService(postID, token) {
  return axios.delete(`${URL}/posts/${postID}`, {
    headers: {
      authorization: token,
    },
  });
}

export function editPostService(editedPost, token) {
  return axios.post(
    `${URL}/posts/edit/${editedPost._id}`,
    {
      postData: editedPost,
    },
    {
      headers: {
        authorization: token,
      },
    }
  );
}

export function likePostService(postId, token) {
  return axios.post(
    `${URL}/posts/like/${postId}`,
    {},
    {
      headers: { authorization: token },
    }
  );
}

export function unlikePostService(postId, token) {
  return axios.post(
    `${URL}/posts/dislike/${postId}`,
    {},
    {
      headers: { authorization: token },
    }
  );
}

export function getUserPostsByUsernameSercive(username) {
  return axios.get(`${URL}/posts/user/${username}`);
}
