import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  editUserProfileService,
  followAUserService,
  getAllUsersService,
  getUserByUsernameService,
  unfollowAUserService,
} from "../../services/users/usersServices";
import { updateUserObj } from "./authSlice";
import { toast } from "react-toastify";

export const getAllUsers = createAsyncThunk(
  "allUsers/getAllUsers",
  async function (_, thunkAPI) {
    try {
      const response = await getAllUsersService();
      return response.data;
    } catch (err) {
      console.log("error from getAllUsers", err);
      return thunkAPI.rejectWithValue(err.response.data.errors[0]);
    }
  }
);

export const followAUser = createAsyncThunk(
  "allUsers/followAUser",
  async function ({ followUserID, token }, thunkAPI) {
    try {
      const response = await followAUserService(followUserID, token);
      thunkAPI.dispatch(updateUserObj({ newUserObj: response.data.user }));
      return response.data;
    } catch (err) {
      console.log("error from followAuser", err);
      return thunkAPI.rejectWithValue(err.response.data.errors[0]);
    }
  }
);

export const unfollowAUser = createAsyncThunk(
  "allUsers/unfollowAUser",
  async function ({ followUserID, token }, thunkAPI) {
    try {
      const response = await unfollowAUserService(followUserID, token);
      thunkAPI.dispatch(updateUserObj({ newUserObj: response.data.user }));
      return response.data;
    } catch (err) {
      console.log("error from unfollowAuser", err);
      return thunkAPI.rejectWithValue(err.response.data.errors[0]);
    }
  }
);

export const getProfilePageUser = createAsyncThunk(
  "allUsers/getProfilePageUser",
  async function (username, thunkAPI) {
    try {
      const response = await getUserByUsernameService(username);
      return response.data;
    } catch (err) {
      console.log("error from getProfilePageUser", err);
      return thunkAPI.rejectWithValue(err.response.data.errors[0]);
    }
  }
);

export const editUserProfile = createAsyncThunk(
  "allUsers/editUserProfile",
  async function ({ userData, token }, thunkAPI) {
    try {
      const response = await editUserProfileService(userData, token);

      thunkAPI.dispatch(updateUserObj({ newUserObj: response.data.user }));
      return response.data;
    } catch (err) {
      console.log("error from editUserProfile", err);
      return thunkAPI.rejectWithValue(err.response.data.errors[0]);
    }
  }
);

const initialState = {
  allUsers: [],
  profilePageUser: null,
  profilePageUserStatus: null,
  isLoading: false,
};

export const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllUsers.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.allUsers = action.payload.users;
      state.isLoading = false;
    },
    [getAllUsers.rejected]: (state, payload) => {
      console.log("promise Rejected from getAllUsers", payload);
      state.isLoading = false;
    },

    [followAUser.pending]: (state) => {
      state.isLoading = true;
    },
    [followAUser.fulfilled]: (state, action) => {
      state.allUsers = action.payload.users;

      state.isLoading = false;
      toast.success(`Followed @${action.payload.followUser.username}`);
    },
    [followAUser.rejected]: (state, action) => {
      console.log("promise Rejected from followAUser", action.payload);
      state.isLoading = false;
      toast.error(action.payload);
    },

    [unfollowAUser.pending]: (state) => {
      state.isLoading = true;
    },
    [unfollowAUser.fulfilled]: (state, action) => {
      state.allUsers = state.allUsers = action.payload.users;

      state.isLoading = false;
      toast.success(`Unfollowed @${action.payload.followUser.username}`);
    },
    [unfollowAUser.rejected]: (state, action) => {
      console.log("promise Rejected from unfollowAUser", action.payload);
      state.isLoading = false;
      toast.error(action.payload);
    },

    [getProfilePageUser.pending]: (state) => {
      state.profilePageUserStatus = "pending";
    },
    [getProfilePageUser.fulfilled]: (state, action) => {
      state.profilePageUser = action.payload.user;
      state.profilePageUserStatus = "fulfilled";
    },
    [getProfilePageUser.rejected]: (state, action) => {
      console.log("promise Rejected from getProfilePageUser", action.payload);
      state.profilePageUserStatus = "rejected";
    },

    [editUserProfile.pending]: (state) => {
      state.isLoading = true;
    },
    [editUserProfile.fulfilled]: (state, action) => {
      state.allUsers = [...state.allUsers].map((twitifyUser) =>
        twitifyUser._id === action.payload.user._id
          ? action.payload.user
          : twitifyUser
      );
      state.isLoading = false;
      toast.success("Profile Updated");
    },
    [editUserProfile.rejected]: (state, action) => {
      console.log("promise Rejected from editUserProfile", action.payload);
      state.isLoading = false;
      toast.error(action.payload);
    },
  },
});

export default allUsersSlice.reducer;
