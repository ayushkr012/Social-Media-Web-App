import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
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
} = authSlice.actions;
export default authSlice.reducer;
