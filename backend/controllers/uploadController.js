const { encrypt, decrypt } = require('../utils/encrypt');
const Website = require('../models/Website');

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      logoUrl: req.file.path,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

exports.createWebsiteWithLogo = async (req, res) => {
  try {
    const { name, url, username, password, status } = req.body;
    const logoUrl = req.file ? req.file.path : '';

    if (!name || !url || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const website = await Website.create({
      name,
      url,
      logo: logoUrl,
      username,
      password: encrypt(password),
      status: status || 'active',
    });

    res.status(201).json({ success: true, website });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateWebsiteWithLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, username, password } = req.body;
    const logoUrl = req.file ? req.file.path : '';

    const website = await Website.findById(id);
    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }

    const updateData = { name, url, username };
    if (logoUrl) updateData.logo = logoUrl;
    if (password) updateData.password = encrypt(password);

    const updated = await Website.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ success: true, website: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};