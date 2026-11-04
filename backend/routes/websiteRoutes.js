const express = require('express');
const router = express.Router();
const {
  getWebsites,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  permanentDeleteWebsite,
  markAsOld,
  restoreWebsite,
  getStats,
} = require('../controllers/websiteController');

router.get('/', getWebsites);
router.get('/stats', getStats);
router.post('/', createWebsite);
router.put('/:id', updateWebsite);
router.patch('/:id/delete', deleteWebsite);
router.patch('/:id/restore', restoreWebsite);
router.patch('/:id/mark-old', markAsOld);
router.delete('/:id/permanent', permanentDeleteWebsite);

module.exports = router;