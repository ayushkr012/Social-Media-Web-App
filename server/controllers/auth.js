import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* Register a New User */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !picturePath ||
      // !friends ||
      !location ||
      !occupation
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    /* Hash the user password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: 0, // Math.floor(Math.random() * 10000),
      impressions: 0, // Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "Registration Successful! ",
      savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* Login a User */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found! Please Continue to Register",
      });
    }
    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    // Create and assign a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    return res
      .status(200)
      .json({ success: true, message: "Login Successfull!", user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
