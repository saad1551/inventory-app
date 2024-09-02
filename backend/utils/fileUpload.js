const multer = require('multer');

// Define file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
    }
  })

// Specify file format that can be saved
function fileFilter (req, file, cb) {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }  
};
  
  
const upload = multer({ storage: storage, fileFilter });

// File Size Formatter
const fileSizeFormatter = (bytes, decimalPlaces = 2) => {
  if (bytes < 0) {
      throw new Error('File size cannot be negative.');
  }

  // Convert bytes to kilobytes
  const kilobytes = bytes / 1024;

  // Round to the specified number of decimal places
  return kilobytes.toFixed(decimalPlaces);
};

module.exports = { upload, fileSizeFormatter };