const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let adminHash = null;

const initAdminHash = async () => {
  if (process.env.ADMIN_PASSWORD) {
    adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  }
};

initAdminHash();

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!adminHash) {
      return res.status(500).json({ success: false, message: 'Server not configured' });
    }

    const isMatch = await bcrypt.compare(password, adminHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: 'admin', username: process.env.ADMIN_USERNAME },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Login successful',
      user: { id: 'admin', username: process.env.ADMIN_USERNAME },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
  });
  return res.json({ success: true, message: 'Logged out' });
};

exports.me = (req, res) => {
  if (!process.env.ADMIN_USERNAME) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  return res.json({
    success: true,
    user: { id: 'admin', username: process.env.ADMIN_USERNAME },
  });
};