const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

router.post('/send-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    await emailService.sendOTP(email, otp);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in send-otp route:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

module.exports = router; 