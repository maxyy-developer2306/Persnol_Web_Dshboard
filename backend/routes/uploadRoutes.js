const express = require('express');
const multer = require('multer');
const { uploadToCloudinary } = require('../config/cloudinary');
const {
  uploadLogo,
  createWebsiteWithLogo,
  updateWebsiteWithLogo,
} = require('../controllers/uploadController');

const router = express.Router();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Keep the file in memory (Vercel has a read-only filesystem)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // Vercel body limit is about 4.5MB
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only jpg, png, webp and gif images are allowed'));
    }
    cb(null, true);
  },
});

// Uploads req.file.buffer to Cloudinary and sets the same fields
// that multer-storage-cloudinary used to set, so controllers keep working
const sendToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return next(); // No logo sent, let the controller decide

    const result = await uploadToCloudinary(req.file.buffer);

    req.file.path = result.secure_url; // Logo URL
    req.file.filename = result.public_id; // Cloudinary public id
    next();
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    res.status(500).json({ success: false, message: 'Logo upload failed' });
  }
};

router.post('/upload-logo', upload.single('logo'), sendToCloudinary, uploadLogo);
router.post(
  '/websites-with-logo',
  upload.single('logo'),
  sendToCloudinary,
  createWebsiteWithLogo
);
router.put(
  '/websites-with-logo/:id',
  upload.single('logo'),
  sendToCloudinary,
  updateWebsiteWithLogo
);

module.exports = router;