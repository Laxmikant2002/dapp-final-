// Store OTPs in memory (for development)
const otpStore = new Map();
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const generateOTP = () => {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email) => {
  try {
    const otp = generateOTP();
    
    // Store OTP with timestamp
    otpStore.set(email, {
      otp,
      timestamp: Date.now()
    });

    // Send OTP to backend API
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }

    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      throw new Error('No OTP found for this email');
    }

    // Check if OTP has expired
    const now = Date.now();
    if (now - storedData.timestamp > OTP_EXPIRY_TIME) {
      otpStore.delete(email);
      throw new Error('OTP has expired');
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // Clear the OTP after successful verification
    otpStore.delete(email);
    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}; 