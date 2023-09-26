import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

export function logInService(username, password) {
  return axios.post(`${URL}/auth/login`, { username, password });
}

export function signUpService(username, password, firstName, lastName) {
  return axios.post(`${URL}/auth/signup`, {
    username,
    password,
    firstName,
    lastName,
  });
}

export function bookmarkPostService(postId, token) {
  return axios.post(
    `${URL}/users/bookmark/${postId}`,
    {},
    {
      headers: {
        authorization: token,
      },
    }
  );
}

export function removeBookmarkPostService(postId, token) {
  return axios.post(
    `${URL}/users/remove-bookmark/${postId}`,
    {},
    {
      headers: {
        authorization: token,
      },
    }
  );
}
