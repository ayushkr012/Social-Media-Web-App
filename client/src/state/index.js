import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { io } from "socket.io-client";

const initialState = {
  mode: "dark",
  user: null,
  token: null,
  socket: null,
  activeUsers: [],
  posts: [],
  chatFriend: null, // state to hold the selected chat friend
  notifications: [], // state to hold notification
  BackendUrl: "https://social-media-web-app-o59e.onrender.com",
  // BackendUrl: "http://localhost:3001",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    // when we update/set the particular post
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    //  to set the chat friend
    setChatFriend: (state, action) => {
      state.chatFriend = action.payload;
    },

    // to set notifications
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications; // set the notifications
    },
    //setting socket connection
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    //to set active users
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setChatFriend,
  setNotifications,
  setUser,
  setSocket,
  setActiveUsers,
} = authSlice.actions;

export const setConversation = async (data) => {
  try {
    await axios.post(`${initialState.BackendUrl}/conversation/add`, data);
  } catch (error) {
    console.log(
      " Error while connecting for conversation b/w user and account ",
      error.message
    );
  }
};

export const getConversation = async (data) => {
  try {
    let response = await axios.post(
      `${initialState.BackendUrl}/conversation/get`,
      data
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(
      " Error while getting conversation b/w user and account ",
      error.message
    );
  }
};

export const newMessage = async (data) => {
  try {
    await axios.post(`${initialState.BackendUrl}/message/add`, data);
  } catch (error) {
    console.log(" Error while calling newmessage api ", error.message);
  }
};

export const getMsgs = async (id) => {
  try {
    let response = await axios.get(
      `${initialState.BackendUrl}/message/get/${id}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(" Error while getting messages api ", error.message);
  }
};

export const socket = () => async (dispatch) => {
  const socket = io("ws://localhost:9000");
  dispatch(setSocket(socket));
};

export default authSlice.reducer;
