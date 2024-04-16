import { cloudinary } from "../utils/cloudinary.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import dataUri from "datauri/parser.js";
const parser = new dataUri();
const uploadImage = catchAsync(async (req, res, next) => {
  let cloudinaryResponse;

  if (req.file) {
    // Convert buffer to data URL ( because cloudinary expects a data URL not a buffer data )
    const dataUri = parser.format(req.file.originalname, req.file.buffer);

    cloudinaryResponse = await cloudinary.uploader.upload(dataUri.content, {
      upload_preset: "trials",
    });

    // Set the imageUrl in the request object
    req.imageUrl = cloudinaryResponse?.url;
  } else {
    return next(new AppError("Please provide a file", 400));
  }

  next(); // Call next middleware
});

export default uploadImage;
