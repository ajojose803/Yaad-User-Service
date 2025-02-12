import RegisterUseCase from "../useCases/userRegistrationUseCase";
import { ServerUnaryCall, sendUnaryData, Metadata } from "@grpc/grpc-js";

const registerUseCase = new RegisterUseCase();

export default class RegisterController {
  registerUser = async (
    call: ServerUnaryCall<
      {
        name: string;
        email: string;
        phone: string;
        password: string;
        userImage: string;
        otp: string;
      },
      any
    >,
    callback: sendUnaryData<{
      message: string;
      token?: string;
      _id?: string;
      name?: string;
      image?: string;
      email?: string;
    }>
  ) => {
    console.log("Incoming gRPC Request to RegisterUser:");
    console.log("Request Data:", call.request);

    const { name, email, password, phone, userImage, otp } = call.request;
    try {
      const response = await registerUseCase.registerUser(
        name,
        email,
        password,
        phone,
        userImage,
        otp
      );
      //console.log(`Response message`,response.message)
      if (response.message !== "Success") {
        return callback(null, { message: response.message });
      }
      const metadata = new Metadata();
      metadata.add(
        "Set-Cookie",
        `refreshToken=${response.refreshToken}; HttpOnly; Secure; Path=/; SameSite=Strict`
      );
      console.log("User Registered Successfully", metadata, response);
      callback(
        null,
        {
          message: "Success",
          _id: response._id,
          name: response.name,
          email: response.email,
          image: response.image,
          token: response.token,
        },
        metadata
      );
    } catch (error) {
      console.error(`Signup Failed:`, error);
      callback(null, { message: (error as Error).message });
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
      const response = await registerUseCase.signupOtp(name, email);
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
      const response = await registerUseCase.resendOtp(name, email);
      console.log("otp response", response);
      callback(null, response);
    } catch (error) {
      console.error("Otp sending failed:", error);
      callback(null, { error: (error as Error).message });
    }
  };
}
