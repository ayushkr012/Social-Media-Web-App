import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
// createPost, updatePost, deletePost, likePost, getPost, getFeedPosts, getUserPosts
const postRoutes = express.Router();

/* READ */
postRoutes.get("/", verifyToken, getFeedPosts);
postRoutes.get("/:userId/posts", getUserPosts);

/* 
Express.js recognizes the route pattern defined as /posts/:userId/posts.
The colon (:) before userId indicates that userId is a route parameter.
For example, if the URL is http://example.com/posts/123/posts, then userId will be replaced with 123.
*/

/* UPDATE */
// the HTTP PATCH method is used to apply partial modifications to a resource.
// the HTTP PUT method is used to update am entire resource.
postRoutes.patch("/:id/like", verifyToken, likePost);

/*DELETE  Post */
postRoutes.delete("/:PostId/:userId", verifyToken, deletePost);
// postRoutes.delete("/:PostId/:userId/:isProfile", verifyToken, deletePost); // here we can't use :isProfile because
// we pass a boolean value it will be considered as a string so we can't use it as a route parameter we can use it as a query parameter like this {isProfile}=req.query

export default postRoutes;
