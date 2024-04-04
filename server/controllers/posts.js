import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE POST */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();

    // Return all posts after creating a new post
    const posts = await Post.find().sort({ _id: -1 });
    const allPosts = posts.map((post) => post.toObject()); // Convert each post to object
    res.status(201).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
/* GET getFeedPosts, getUserPosts, ( here we have to add the get friends post ) */

export const getFeedPosts = async (req, res) => {
  try {
    // const posts = await Post.find(); // Return all posts
    const posts = await Post.find().sort({ _id: -1 });
    const allPosts = posts.map((post) => post.toObject()); // Convert each post to object
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ _id: -1 }); // Return posts of a particular user
    const allPosts = posts.map((post) => post.toObject()); // Convert each post to object
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

/* in the userFeed we return only their friends and their own post not all the posts of all the user */
export const getFriendsPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const friendsPosts = await Post.find({ userId: { $in: user.friends } }); // Return posts of friends
    const allPosts = friendsPosts.map((post) => post.toObject()); // Convert each post to object
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // id of the post
    const { userId, postUserId } = req.body; // userId is the id of the user who like the post and postUserId is the id of the user who created the post
    const post = await Post.findById(id); // find the post by thier id

    // here we check if the user already liked the post or not
    const isLiked = post.likes.get(userId);

    // if the user already liked the post then we remove the like
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      // if the user not liked the post then we add the like
      post.likes.set(userId, true);
    }

    // after that we return the updated post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    //  -------------------------------------> User NOTIFICATION PART ------------------------------<

    const user = await User.findById(userId);
    const postUser = await User.findById(postUserId);

    // user not get notified when they like their own post
    if (user != postUser) {
      postUser.notifications.push({
        message: "liked your post.",
        userId: user._id, // Use the _id of the user who liked the post
      });
    }

    await postUser.save();

    // Retrieve the updated notifications for the user
    const userNotifications = await Promise.all(
      user.notifications.map(async (notification) => {
        return {
          userId: notification.userId,
          message: notification.message,
        };
      })
    );

    // Merge user details with notifications and include message
    const formattedNotifications = await Promise.all(
      userNotifications.map(async (notification) => {
        const { userId, message } = notification;

        try {
          const userDetails = await User.findById(userId);
          if (userDetails) {
            return {
              userId,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              occupation: userDetails.occupation,
              location: userDetails.location,
              picturePath: userDetails.picturePath,
              message,
            };
          } else {
            return null; // Return null if user details are not found (optional)
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          return null;
        }
      })
    );

    // Filter out null values if any
    const filteredNotifications = formattedNotifications.filter(
      (notification) => notification !== null
    );

    console.log("filteredNotifications", filteredNotifications);

    res.status(200).json({
      updatedPost: updatedPost,
      updatedNotifications: filteredNotifications,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

/* DELETE POST */

export const deletePost = async (req, res) => {
  try {
    const { PostId, userId } = req.params;
    const { isProfile } = req.query; // isProfile is a query parameter that indicates whether the user is on their profile page or not

    console.log(PostId, isProfile);
    await Post.findByIdAndDelete(PostId);

    let posts;
    if (isProfile === "true") {
      posts = await Post.find({ userId }).sort({ _id: -1 });
    } else {
      posts = await Post.find().sort({ _id: -1 });
    }
    const allPosts = posts.map((post) => post.toObject());

    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};
