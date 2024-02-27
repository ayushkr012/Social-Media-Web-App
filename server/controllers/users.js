import User from "../models/User.js";

/* Get User details  */

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get User Friends */

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    /* Get all friends */
    // we iterate the user friends list and check they exist in database or not then we get the details of each friend
    /*  friends: {
       type: Array,
       default: [],
    }, */
    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Update User Friend */

export const addRemoveFriend = async (req, res) => {
  try {
    // we get the user id and friend id from the request params
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // here we check the friendId is already in the user friends list or not
    // if yes then we remove it else we add it to the list
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    // after saving we return the updated friends list of the user
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
