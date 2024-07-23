import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import connectDB from "./config/db.js";
import msg from "./routes/msg.js";
import conversation from "./routes/conversation.js";
import { generateSignature } from "./controllers/cloudinaryUpload.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();
const app = express();

/* CONFIGURATION  when we use type=module */

// these below 3 lines are required for only advertisement widget and linkedin and twitterIcon
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/* DataBase Connection */
const PORT = process.env.PORT || 5001;
connectDB();

/* Cloudinary Configuration when user upload image or videos */
app.post("/uploadfile", generateSignature);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/message", msg);
app.use("/conversation", conversation);

/* SOCKET.IO Part */
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     // origin: "http://localhost:3000",
//     // origin: "https://social-media-web-app-mu.vercel.app",
//   },
// });

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
  },
});

//Add this before the app.get() block
io.on("connection", (socket) => {
  console.log(`${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

io.on("connection", (socket) => {
  console.log("A client connected");

  let users = [];

  const addUser = (userData, socketId) => {
    !users.some((user) => user._id == userData._id) &&
      users.push({ ...userData, socketId });
    console.log(userData);
  };

  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  /* ADD Some Dummy DATA ONE TIME  */
  // User.insertMany(users);
  // Post.insertMany(posts);
});

server.listen(9000, () => {
  console.log("HTTP server is running on port 9000");
});
