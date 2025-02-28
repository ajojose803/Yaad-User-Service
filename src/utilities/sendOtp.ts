import { otpSetData } from "../infrastructure/services/redisClient";
import generateOtp from "../infrastructure/services/generateOTP";
import { sendMail } from "../infrastructure/services/sendMail";

interface SendOtpParams {
    email:string,
    name:string,
}

export const sendOtp = async ({email,name}: SendOtpParams): Promise<string> => {
    try{
        const otp:string = generateOtp();
        const subject:string = "OTP Verfication";
        const text:string = `Hello ${name}, \n\n\Thank you for registering with Yaad, your OTP is ${otp}\n\nHave a nice day!!!`;
        await sendMail(email,subject, text);
        await otpSetData(email, otp);
        console.log("OTP sent: ", otp);
        return 'success'

    } catch(error){
        console.error("Error sending OTP: ", error);
        return "failed to send OTP.";
    }
}