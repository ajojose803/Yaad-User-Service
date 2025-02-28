import UserRepository from '../../data/repositories/UserRepository';
import bcrypt from '../../infrastructure/services/brcypt';
import { UpdateUserRequest, IUser } from '../../utilities/interface';
import { comparePassword } from '../../utilities/passwordCompare';

const userRepository = new UserRepository();

export default class UserUseCase {
  getUser = async (id: string) => {
    try {
      const user = await userRepository.findById(id);
      if (user) {
        return { message: 'success', user };
      } else {
        return { message: 'No User Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  updateUser = async (id: string, updates: Partial<UpdateUserRequest>) => {
    try {
      const user = (await userRepository.findById(id)) as IUser;
      if (user) {
        const response = await userRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'UserUpdated') {
          const user = (await userRepository.findById(id)) as IUser;
          return { message: 'success', name: user.name, phone: user.phone, userImage: user.userImage};
        } else {
          return { message: 'User Not Updated' };
        }
      }
      return { message: 'User does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  changePassword = async (
    id: string,
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        return { message: 'No User Found' };
      }
      const isMatch = await comparePassword(currentPassword, user.password as string);
      if (!isMatch) {
        return { message: 'Entered current password is invalid' };
      }
      const hashedPass = await bcrypt.securePassword(newPassword);
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
  };

  isBlocked = async (id: string) => {
    try {
      const user = await userRepository.find(id);
      if (user?.accountStatus === 'Blocked') {
        return { message: 'Blocked' };
      } else if (user?.accountStatus === 'UnBlocked') {
        return { message: 'UnBlocked' };
      } else {
        return { message: 'No User Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getUsers = async () => {
    try {
      const users = await userRepository.findAll();
      if (users && users.length > 0) {
        return { users };
      } else {
        return { message: 'No Users Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  blockUser = async (id: string, accountStatus: string) => {
    try {
      const user = (await userRepository.findById(id)) as IUser;
      if (user) {
        const updates: { [key: string]: any } = {};
        if (accountStatus === 'Blocked') {
          updates.accountStatus = 'Blocked';
        }
        if (accountStatus === 'UnBlocked') {
          updates.accountStatus = 'UnBlocked';
        }
        const response = await userRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'UserUpdated') {
          return { message: 'success' };
        } else {
          return { message: 'Request Failed' };
        }
      }
      return { message: 'Expert does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getUserData = async () => {
    try {
      const users = await userRepository.getUserCountAndGrowthRate();
      if (users) {
        return users;
      } else {
        return { message: 'No Users Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };
}