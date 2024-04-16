import multer from "multer";

/* we directly store the file in memory buffer instead of storing it in the disk in uploads folder
 and then uplaod to cloudinary */

/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});*/

const fileFilter = (req, file, cb) => {
  /* instead of specificing we allow all types of images to upload */

  // if (
  //   file.mimetype === "image/jpeg" ||
  //   file.mimetype === "image/jpg" ||
  //   file.mimetype === "image/png" ||
  //   file.mimetype === "image/webp" ||
  //   file.mimetype === "image/gif" ||
  //   file.mimetype === "image/avif"
  // )
  //   cb(null, true);
  // else cb(null, false);

  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // this means file should be accepted
  } else {
    cb(null, false); // this means file should not be accepted
  }
};

const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory buffer
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

export { upload };
