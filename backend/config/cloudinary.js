const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Same settings as the old CloudinaryStorage params
const uploadOptions = {
  folder: 'website-manager/logos',
  resource_type: 'image',
  allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
  transformation: [{ width: 200, height: 200, crop: 'limit' }],
};

// Uploads a file buffer (from multer memory storage) to Cloudinary
const uploadToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { ...uploadOptions, ...options },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

module.exports = { cloudinary, uploadToCloudinary };