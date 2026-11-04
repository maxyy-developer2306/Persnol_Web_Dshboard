const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const {
  uploadLogo,
  createWebsiteWithLogo,
  updateWebsiteWithLogo,
} = require('../controllers/uploadController');

const router = express.Router();

const upload = multer({ storage });

router.post('/upload-logo', upload.single('logo'), uploadLogo);
router.post('/websites-with-logo', upload.single('logo'), createWebsiteWithLogo);
router.put('/websites-with-logo/:id', upload.single('logo'), updateWebsiteWithLogo);

module.exports = router;