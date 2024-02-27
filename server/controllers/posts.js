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

    // return all the  post in database to the frontend after creating a new post
    const post = await Post.find();
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

/* GET getFeedPosts, getUserPosts, ( here we have to add the get friends post ) */

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find(); // here return all user post
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }); // here return the particular user post
    res.status(200).json(post);
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
    const friendsPosts = await Post.find({ userId: { $in: user.friends } });
    res.status(200).json(friendsPosts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // id of the post
    const { userId } = req.body; // id of the user who like the post
    const post = await Post.findById(id); //

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

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
