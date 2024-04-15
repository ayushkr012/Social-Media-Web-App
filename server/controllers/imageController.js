import { upload } from "../utils/multer.js";
import { cloudinary } from "../utils/cloudinary.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import fs from "fs"; // Import the fs module

const uploadImage = catchAsync(async (req, res, next) => {
  let cloudinaryResponse;

  if (req.file) {
    cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "trials",
    });

    // Set the imageUrl in the request object
    req.imageUrl = cloudinaryResponse?.url;

    // Remove the image from local storage after uploading to cloudinary
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error removing image from local storage:", err);
      } else {
        console.log("Image removed from local storage");
      }
    });
  } else {
    return next(new AppError("Please provide a file", 400));
  }

  next(); // Call next middleware
});

export default uploadImage;



// const uploadImage = catchAsync(async (req, res, next) => {
//   let cloudinaryResponse;

//   if (req.file) {
//     cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
//       upload_preset: "cloudinary_trials",
//     });
//   } else {
//     return next(new AppError("Please provide a file", 400));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       imageUrl: cloudinaryResponse?.url,
//     },
//   });
// });