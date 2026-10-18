const multer = require('multer');

// Sử dụng memoryStorage để lấy file buffer trực tiếp đẩy lên Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Chỉ chấp nhận file ảnh (jpeg, png, webp, gif)
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    const error = new Error('Chỉ chấp nhận file định dạng hình ảnh (jpg, png, webp)');
    error.statusCode = 400;
    cb(error, false);
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
}).single('avatar');

module.exports = { uploadAvatar };
