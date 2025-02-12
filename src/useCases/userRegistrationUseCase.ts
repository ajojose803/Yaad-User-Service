import auth from "../middleware/auth";
import UserRepository from "../repositories/userRepo";
import brcypt from "../services/brcypt";
import { getOtpByEmail } from "../services/redisClient";
import { IUser } from "../utilities/interface";
import { sendOtp } from "../utilities/sendOtp";
import crypto from "crypto"; 
import { Metadata, ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";

const userRepository = new UserRepository();

export default class RegisterUseCase {
  signupOtp = async (name: string, email: string) => {
    try {
      const user = (await userRepository.findByEmail(email)) as IUser;
      if (user) {
        // console.log("User already exists");
        return { message: "User already exists" };
      }
      const response = await sendOtp({ email, name });
      return { message: response };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  resendOtp = async (name: string, email: string) => {
    try {
      const response = await sendOtp({ email, name });
      return { message: response };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  registerUser = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    userImage: string,
    otp: string
  ) => {
    try {
      const storedOtp = await getOtpByEmail(email);
      if (storedOtp === null || !crypto.timingSafeEqual(Buffer.from(storedOtp), Buffer.from(otp))) {
        console.log(`Otp does not match  or is not found`);
        return { message: `Otp does not match  or is not found` };
      }
      // console.log("Received Mobile Number:", phone);

      const existingUser = (await userRepository.findByEmail(
        email
      )) as IUser;
      if (existingUser) {
        return { message: "User with the same email already exists" };
      }
      const hashedPassword = await brcypt.securePassword(password);
      const newUserData = {
        name,
        email,
        phone,
        password: hashedPassword,
        userImage,
      };
      
      const response = await userRepository.saveUser(newUserData);
      console.log(" Response message in RegisterUsecase",response.message)
      if ((response.message === `UserCreated`)) {
        const newUser = (await userRepository.findByEmail(email)) as IUser;
        //console.log("New User:", newUser);
        const token = await auth.createToken(
          newUser._id.toString(),
          "USER",
          "15m"
        );

        const refreshToken = await auth.createToken(
          newUser._id.toString(),
          "USER",
          "7d"
        );
        return {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          image: newUser.userImage,
          token,
          refreshToken,
          message:`Success`,
        };
      } else {
        console.error(`Error saving user:`, response);
        return { message: "UserNotCreated" };
      }
    } catch (error) {
      console.error("Error in registerUser: ", error);
      return { message: (error as Error).message };
    }
  };
}
