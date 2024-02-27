import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
// createPost, updatePost, deletePost, likePost, getPost, getFeedPosts, getUserPosts
const postRoutes = express.Router();

/* READ */
postRoutes.get("/", verifyToken, getFeedPosts);
postRoutes.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
// the HTTP PATCH method is used to apply partial modifications to a resource.
// the HTTP PUT method is used to update am entire resource.
postRoutes.patch("/:id/like", verifyToken, likePost);

export default postRoutes;
