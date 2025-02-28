import RegisterUseCase from "../../core/useCases/userRegistrationUseCase";
import { inject, injectable } from "inversify";
import TYPES from "../../types";


@injectable()
export default class RegisterController {
  constructor(@inject(TYPES.RegisterUseCase) private registerUseCase: RegisterUseCase) {}

  registerUser = async (
    call: {
      request: {
        name: string;
        email: string;
        phone: string;
        password: string;
        userImage: string;
        otp: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    const { name, email, password, phone, userImage, otp } = call.request;
    try {
      const response = await this.registerUseCase.registerUser(
        name,
        email,
        password,
        phone,
        userImage,
        otp
      );
      callback(null, response);
    } catch (error) {
      console.error('Signup failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  signupOtp = async (
    call: { request: { name: string; email: string } },
    callback: (error: any, response: any) => void
  ) => {
    console.log("Incoming gRPC Request to RegisterUser:");
    console.log("Request Data:", call.request);
    const { name, email } = call.request;
    try {
      const response = await this.registerUseCase.signupOtp(name, email);
      callback(null, response);
    } catch (error) {
      console.error("Otp sending failed:", error);
      callback(null, { error: (error as Error).message });
    }
  };

  resendOtp = async (
    call: { request: { name: string; email: string } },
    callback: (error: any, response: any) => void
  ) => {
    // console.log("")
    const { name, email } = call.request;
    try {
      console.log(`Resending otp for:`, { name, email });
      const response = await this.registerUseCase.resendOtp(name, email);
      console.log("otp response", response);
      callback(null, response);
    } catch (error) {
      console.error("Otp sending failed:", error);
      callback(null, { error: (error as Error).message });
    }
  };
}
