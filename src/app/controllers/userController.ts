import UserUseCase from "../../core/useCases/userUseCase";
import { UpdateUserRequest } from "../../utilities/interface";


const userUseCase = new UserUseCase()

export default class UserController {
  getUser = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id } = call.request;
      const user = await userUseCase.getUser(id);
      callback(null, user);
    } catch (error) {
      console.error('Error fetching user:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  updateUser = async (
    call: {
      request: UpdateUserRequest;
    },
    callback: (error: any, response: any) => void
  ) => {
    const { id, name, mobile, userImage } = call.request;
    const updates: Partial<UpdateUserRequest> = {};
    if (name) {
      updates.name = name;
    }
    if (mobile) {
      updates.mobile = mobile;
    }
    if (userImage) {
      updates.userImage = userImage; 
    }
    try {
      const response = await userUseCase.updateUser(id, updates);
      callback(null, response);
    } catch (error) {
      console.error('Update user failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  changePassword = async (
    call: {
      request: {
        id: string;
        currentPassword: string;
        newPassword: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id, currentPassword, newPassword } = call.request;
      const response = await userUseCase.changePassword(id, currentPassword, newPassword);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };


  isBlocked = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id } = call.request;
      const response = await userUseCase.isBlocked(id);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching user:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getUsers = async (
    call: any,
    callback: (error: any, response: any) => void
  ) => {
    try {
      const users = await userUseCase.getUsers();
      callback(null, users);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  blockUser  = async (
    call: {
      request: {
        id: string;
        accountStatus: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id, accountStatus } = call.request;
      const response = await userUseCase.blockUser(id, accountStatus);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getUserData  = async (
    call: any,
    callback: (error: any, response: any) => void
  ) => {
    try {
      const userData = await userUseCase.getUserData();
      console.log(userData)
      if ('overallCount' in userData && 'growthRate' in userData) {
        callback(null, { totalUsers: userData.overallCount, userGrowthRate: userData.growthRate });
      } else {
        callback(null, { error: userData.message });
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

}