import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming userId refers to the ObjectId of the user
      required: true,
    },
    read: {
      type: Boolean,
      default: false, // Initially set to false, indicating the notification has not been read
    },
    time: {
      type: Date,
      default: Date.now, // Set to the current date and time when the notification is created
    },
  },
  { _id: false }
); // You may not need _id for notification objects

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    notifications: {
      type: [notificationSchema], // Array of notification objects
      default: [],
    },
    location: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "",
    },
    viewedProfile: Number,
    impressions: Number,
    lastSeen: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
