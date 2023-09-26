import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

export function getAllUsersService() {
  return axios.get(`${URL}/users`);
}

export function followAUserService(followUserID, token) {
  return axios.post(
    `${URL}/users/follow/${followUserID}`,
    {},
    {
      headers: {
        authorization: token,
      },
    }
  );
}

export function unfollowAUserService(followUserID, token) {
  return axios.post(
    `${URL}/users/unfollow/${followUserID}`,
    {},
    {
      headers: {
        authorization: token,
      },
    }
  );
}

export function getUserByUsernameService(username) {
  return axios.get(`${URL}/users/${username}`);
}

export function editUserProfileService(userObj, token) {
  return axios.post(
    `${URL}/users/edit`,
    { userData: userObj },
    {
      headers: {
        authorization: token,
      },
    }
  );
}
