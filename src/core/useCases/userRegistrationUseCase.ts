
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { IUserRepository } from "../../core/domain/interfaces/IUserRepository";
import { IAuthService } from "../../core/domain/interfaces/IAuthService";
import { IOtpService } from "../../core/domain/interfaces/IOtpService";

import bcrypt from "../../infrastructure/services/brcypt";
import { sendOtp } from "../../utilities/sendOtp";


@injectable()
export default class RegisterUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.OtpService) private otpService: IOtpService
  ) {}

  async signupOtp(name: string, email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (user) return { message: "User already exists" };
    
    const response = await this.otpService.sendOtp(name, email);
    return { message: response };
  }

  resendOtp = async (name: string, email: string) => {
    try {
      const response = await sendOtp({ email, name });
      return { message: response };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

 async registerUser(name: string, email: string, password: string, phone: string, userImage: string, otp: string) {
    if (!(await this.otpService.verifyOtp(email, otp))) {
      return { message: "OTP does not match or is not found" };
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) return { message: "User already exists" };

    const hashedPassword = await bcrypt.securePassword(password);
    const newUser = await this.userRepository.saveUser({ name, email, phone, password: hashedPassword, userImage });

    const token = await this.authService.createToken(newUser._id.toString(), "USER", "15m");
    const refreshToken = await this.authService.createToken(newUser._id.toString(), "USER", "7d");

    return { _id: newUser._id, name, email, phone, userImage, token, refreshToken, message: "Success" };
  }
}

