import { IOtpService } from "../../core/domain/interfaces/IOtpService"; 
import { sendOtp } from "../../utilities/sendOtp";  // Function to send OTP via email/SMS
import { getOtpByEmail } from "../../infrastructure/services/redisClient"; // Fetch OTP from Redis
import crypto from "crypto";

export class OtpService implements IOtpService {
  async sendOtp(name: string, email: string): Promise<string> {
    return sendOtp({ email, name });  // Send OTP using email service
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await getOtpByEmail(email); // Retrieve OTP from Redis
    return storedOtp !== null && crypto.timingSafeEqual(Buffer.from(storedOtp), Buffer.from(otp));
  }
}
