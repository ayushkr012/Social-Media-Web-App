import mongoose from "mongoose";
const { Schema } = mongoose;

const FeedBack = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  feedback: {
    type: String,
    required: true,
    trim: true,
  },
});

const UserFeedBack = mongoose.model("UserFeedBack", FeedBack);
export default UserFeedBack;
