import AuthService  from '../../app/middleware/AuthService'; '../../app/middleware/AuthService';
import UserRepository from '../../data/repositories/UserRepository';
import bcrypt from '../../infrastructure/services/brcypt';
import { getOtpByEmail } from '../../infrastructure/services/redisClient';
import { IUser, UpdateUserRequest, } from '../../utilities/interface';
import { comparePassword } from '../../utilities/passwordCompare';
import { sendOtp } from '../../utilities/sendOtp';

const userRepository = new UserRepository();

export default class LoginUseCase {
  loginUser = async (email: string, password: string) => {
    try {
      const user = (await userRepository.findByEmail(email)) as IUser;
      if (!user) {
        return { message: 'UserNotFound' };
      }
      const isMatch = await comparePassword(password, user.password as string);
      if (!isMatch) {
        return { message: 'passwordNotMatched' };
      }
      if (user.accountStatus === 'Blocked') {
        return { message: 'blocked' };
      }
      const accessToken = await AuthService.createToken(user._id.toString(),user.role, '15m');
      const refreshToken = await AuthService.createToken(user._id.toString(),user.role,  '7d');
      console.log(`User in db: ${user}`);
      console.log(user._id,user.name,
        accessToken,
        refreshToken, user.userImage,user.email,user.phone,)
      return {
        message: 'Success',
        _id: user._id,
        name: user.name,
        accessToken,
        refreshToken,
        image: user.userImage,
        email: user.email,
        phone: user.phone,
      };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  googleLoginUser = async (email: string) => {
    try {
      const user = (await userRepository.findByEmail(email)) as IUser;
      if (!user) {
        return { message: 'UserNotFound' };
      }
      if (user.accountStatus === 'Blocked') {
        return { message: 'blocked' };
      }

      const accessToken = await AuthService.createToken(user._id.toString(),user.role,  '15m');
      const refreshToken = await AuthService.createToken(user._id.toString(),user.role,  '7d');
      return {
        message: 'Success',
        name: user.name,
        accessToken,
        _id: user._id,
        refreshToken,
        image: user.userImage,
        email: user.email,
        phone: user.phone,
      };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  forgotPassOtp = async ( email: string) => {
    try {
      const user = (await userRepository.findByEmail(email)) as IUser;
      const name = user.name
      if (user) {
        const response = await sendOtp({email, name}) 
        return {message: response}
      }
      return {message: 'User Does not Exist'}
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  otpVerify = async ( email: string, otp: string) => {
    try {
      const storedOtp = await getOtpByEmail(email)
      console.log(storedOtp,'stored')
      console.log(otp,'otp')
      console.log(email,'email')
      if(storedOtp === null || storedOtp.toString() !== otp.toString()) {
        console.log("OTP does not match or is not found.")
        return {message: 'OTP does not match or is not found.'}
      }
      const user = (await userRepository.findByEmail(email)) as IUser;
      if (user) {
        return { message: 'success' };
      } else {
        return {message: 'User does Not Exist'}
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  updatePassword  = async (
    email:string,
    password: string
  ) => {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return { message: 'No User Found' };
      }
      const id = user?._id.toString()
      const hashedPass = await bcrypt.securePassword(password);
      const updates = { password: hashedPass };
      const response = await userRepository.findByIdAndUpdate(id, updates);
      if (response.message === 'UserUpdated') {
        console.log('Password changed successfully');
        return { message: 'success' };
      } else {
        return { message: 'User Not Updated' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  }
}