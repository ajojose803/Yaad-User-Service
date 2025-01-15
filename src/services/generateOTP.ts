const generateOTP = ():string => {
    const otp = Math.floor(1000 + Math.random() * 9999).toString();
    return otp;
};

export default generateOTP;