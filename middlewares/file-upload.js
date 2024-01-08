const multer = require("multer");
const uuid = require("uuid");
const uniqueId = uuid.v4();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(file);
      cb(null, "uploads/prod-images");
    },
    filename: (req, file, cb) => {
      console.log(file);
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uniqueId + "." + ext);
    },
  }),

  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error);
  },
});

module.exports = fileUpload;
