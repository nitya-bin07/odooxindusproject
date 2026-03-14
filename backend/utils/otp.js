/**
 * Generate a random 6-digit OTP string.
 */
export const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * Return a Date object `minutes` from now.
 */
export const otpExpiry = (minutes = parseInt(process.env.OTP_EXPIRES_MINUTES) || 10) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d;
};
