// import { cloudinary } from "../utils/cloudinary.js";
// import { AppError } from "../utils/appError.js";
// import { catchAsync } from "../utils/catchAsync.js";
// import dataUri from "datauri/parser.js";
// const parser = new dataUri();
// const uploadImage = catchAsync(async (req, res, next) => {
//   let cloudinaryResponse;

//   if (req.file) {
//     // Convert buffer to data URL ( because cloudinary expects a data URL not a buffer data )
//     const dataUri = parser.format(req.file.originalname, req.file.buffer);

//     cloudinaryResponse = await cloudinary.uploader.upload(dataUri.content, {
//       upload_preset: "trials",
//     });

//     // Set the imageUrl in the request object
//     req.imageUrl = cloudinaryResponse?.url;
//   } else {
//     return next(new AppError("Please provide a file", 400));
//   }

//   next(); // Call next middleware
// });

// export default uploadImage;

import DataUri from "datauri/parser.js";
import { cloudinary } from "../utils/cloudinary.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import multer from "multer";

const parser = new DataUri();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/avif"
  )
    cb(null, true); // this means file should be accepted
  else cb(null, false); // this means file should not be accepted
};

const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory buffer
  limits: {
    fileSize: 1024 * 1024 * 10, // Limit file size to 10 MB
  },
  fileFilter: fileFilter,
});

const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please provide a file", 400));
  }

  try {
    // Convert buffer to data URL
    const dataUri = parser.format(req.file.originalname, req.file.buffer);
    console.log(dataUri);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      dataUri.content,
      {
        upload_preset: "trials",
      }
    );

    console.log("cloudinaryResponse", cloudinaryResponse.url);
    // Set the imageUrl in the request object
    req.imageUrl = cloudinaryResponse.url;

    next(); // Call next middleware
  } catch (error) {
    console.log("Error uploading image to Cloudinary", error);
    return next(new AppError("Error uploading image to Cloudinary", 500));
  }
});

export { upload, uploadImage };
