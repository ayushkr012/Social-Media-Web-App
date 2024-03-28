import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  feedback,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router();

/*READ*/
userRoutes.get("/:id", verifyToken, getUser);
userRoutes.get("/:id/friends", verifyToken, getUserFriends);

/*UPDATE*/
userRoutes.patch("/:id/:friendId", verifyToken, addRemoveFriend);

/*Feedback*/
userRoutes.post("/feedback", verifyToken, feedback);

export default userRoutes;
