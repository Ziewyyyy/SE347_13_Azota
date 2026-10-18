const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload buffer ảnh lên Cloudinary
 * @param {Buffer} fileBuffer 
 * @param {string} folder 
 * @returns {Promise<string>} URL của ảnh sau khi upload
 */
const uploadToCloudinary = (fileBuffer, folder = 'azota/avatars') => {
  return new Promise((resolve, reject) => {
    //chua cau hinh
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.log('Chưa cấu hình key, sử dụng avatar mặc định.');
      return resolve('https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg');
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary };
