const getOtp = () => {
  let otp = []

  for(i = 0; i < 6; i++) {
    otp.push(Math.floor(Math.random() * 9))
  }

  return otp.join('');
};

module.exports = getOtp;