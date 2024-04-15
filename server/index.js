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
import { register } from "./controllers/auth.js";
import { createPost, updatePost } from "./controllers/posts.js"; // Create Post and Update Post
import { verifyToken } from "./middleware/auth.js";
import uploadImage from "./controllers/imageController.js";
import { upload } from "./utils/multer.js";

import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

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

// /* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/assets");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

/* ROUTES WITH FILE */

/* --------------------------> Use Cloudinary for image store <-------------------------------*/

/*Register */
app.post("/auth/register", upload.single("picture"), uploadImage, register);

/*Create Post */
app.post(
  "/posts",
  verifyToken,
  upload.single("picture"),
  uploadImage,
  createPost
);

/*Update Post */
app.put(
  "/posts/:postId/editPost",
  verifyToken,
  upload.single("picture"), // Attach upload middleware directly to the route
  (req, res, next) => {
    // Check if picture exists in request file
    if (req.file) {
      // If picture exists, execute uploadImage middleware
      uploadImage(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: "Failed to upload picture." });
        }
        next(); // Move to the next middleware
      });
    } else {
      next(); // Move to the next middleware directly
    }
  },
  updatePost
);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  /* ADD Some Dummy DATA ONE TIME  */
  // User.insertMany(users);
  // Post.insertMany(posts);
});
