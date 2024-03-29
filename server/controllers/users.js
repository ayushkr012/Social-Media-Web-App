import User from "../models/User.js";
import nodemailer from "nodemailer";
import UserFeedBack from "../models/UserFeedBack.js";

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
    // return the all friends details of the current user after adding or removing the friend
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

/* -----------------   Feedback  -------------------- */

export const feedback = async (req, res) => {
  try {
    const { firstName, lastName, email, feedback } = req.body;
    console.log(email);

    if (!firstName || !lastName || !email || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // type: "login",
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

const mailOptions = {
  from: process.env.EMAIL,
  to: email,
  subject: `Thank You for Your Feedback on Connectify`,
  html: `
    <html>
      <head>
        <style>
          /* Add your CSS styles here */
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            border: 1px solid #e9e9e9;
            border-radius: 5px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #007bff;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            color: #ffffff;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            color: #6c757d;
          }
          .content {
            padding: 20px;
          }
          p {
            margin-bottom: 15px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Thank You for Your Feedback</h2>
          </div>
          <div class="content">
            <p>Hi ${firstName} ${lastName},</p>
            <p>Thank you for taking the time to share your feedback with us. We greatly appreciate your input and are always striving to improve Connectify to better meet the needs of our users.</p>
            <p>Your feedback is invaluable to us, and we want to assure you that it has been received and will be carefully reviewed by our team. We take every comment seriously as we continue to enhance the user experience on our platform.</p>
            <p>If you have any further thoughts or suggestions, please do not hesitate to reach out to us. We are here to listen and eager to hear more from you.</p>
            <p>Thank you once again for your feedback and for being a valued member of Connectify community.</p>
          </div>
          <div class="footer">
            <p>About | Accessibility | Help Center</p>
            <p>Privacy & Terms | Ad Choices | Advertising</p>
            <p>Business Services | Get the Connectify app</p>
            <p>Connectify Corporation © 2024</p>
          </div>
        </div>
      </body>
    </html>
  `,
};

    const existingFeedback = await UserFeedBack.findOne({ email });

    if (existingFeedback) {
      existingFeedback.feedback = feedback;
      await existingFeedback.save();
    } else {
      const newFeedback = new UserFeedBack({
        firstName,
        lastName,
        email,
        feedback,
      });
      await newFeedback.save();
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to send feedback. Please try again later.",
        });
      }
      res.status(200).json({
        success: true,
        message: "Thank you for your feedback. We will get back to you soon.",
      });
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
