import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  feedback,
  profileView,
  getNotification,
  updateNotificationStatus,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router();

/*READ*/
userRoutes.get("/:id", verifyToken, getUser);
userRoutes.get("/:id/friends", verifyToken, getUserFriends);

/*UPDATE*/
userRoutes.patch("/:id/:friendId", verifyToken, addRemoveFriend);

/* Update Notification and profileViewCount when SomeOne View Profile  */
userRoutes.get("/profileview/:userId/:postUserId", verifyToken, profileView);

/* Get Notification */
userRoutes.get("/notification/:userId", verifyToken, getNotification);

/* Update the Notification Status After User Read the Notification */
userRoutes.put(
  "/updateNotificationStatus/:userId/:friendId", // here friendId is the id of the user who view the profile or like the post or comment on the post etc.
  verifyToken,
  updateNotificationStatus
);

/*Feedback*/
userRoutes.post("/feedback", verifyToken, feedback);

export default userRoutes;
