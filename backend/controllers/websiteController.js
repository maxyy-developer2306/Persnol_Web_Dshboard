const Website = require('../models/Website');
const { encrypt, decrypt } = require('../utils/encrypt');

exports.getWebsites = async (req, res) => {
  try {
    const { status, search, sort } = req.query;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    } else {
      filter.status = { $nin: ['deleted', 'old'] };
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const websites = await Website.find(filter).sort(sortOption);

    const result = websites.map((w) => ({
      id: w._id,
      name: w.name,
      url: w.url,
      logo: w.logo,
      username: w.username,
      password: decrypt(w.password),
      status: w.status,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));

    return res.json({ success: true, websites: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createWebsite = async (req, res) => {
  try {
    const { name, url, logo, username, password } = req.body;

    if (!name || !url || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const website = await Website.create({
      name,
      url,
      logo: logo || '',
      username,
      password: encrypt(password),
      status: 'active',
    });

    return res.status(201).json({ success: true, website: website });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, logo, username, password } = req.body;

    const website = await Website.findById(id);
    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }

    const updateData = {
      name,
      url,
      logo: logo || '',
      username,
    };

    if (password) {
      updateData.password = encrypt(password);
    }

    const updated = await Website.findByIdAndUpdate(id, updateData, { new: true });

    return res.json({ success: true, website: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.deleteWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const website = await Website.findByIdAndUpdate(
      id,
      { status: 'deleted' },
      { new: true }
    );
    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }
    return res.json({ success: true, message: 'Website deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.restoreWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const website = await Website.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true }
    );
    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }
    return res.json({ success: true, message: 'Website restored to active', website });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.permanentDeleteWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const website = await Website.findByIdAndDelete(id);
    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }
    return res.json({ success: true, message: 'Website permanently deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.markAsOld = async (req, res) => {
  try {
    const { id } = req.params;
    const website = await Website.findByIdAndUpdate(
      id,
      { status: 'old' },
      { new: true }
    );
    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }
    return res.json({ success: true, message: 'Website marked as old', website });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Website.countDocuments();
    const active = await Website.countDocuments({ status: 'active' });
    const deleted = await Website.countDocuments({ status: 'deleted' });
    const old = await Website.countDocuments({ status: 'old' });

    return res.json({
      success: true,
      stats: { total, active, deleted, old },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};