import User from "../entities/user";
import { RegisterUser, IUser, UpdateUserRequest } from "../utilities/interface";

export default class UserRepository {
  findByEmail = async (email: string): Promise<IUser | null> => {
    try {
      const userData = await User.findOne({ email });
      return userData;
    } catch (error) {
      console.error("Error in findByEmail", (error as Error).message);
      return null;
    }
  };

  saveUser = async (userData: RegisterUser): Promise<{ message: string }> => {
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      userImage: userData.userImage,
    });

    try {
      await newUser.save();
      console.log(`User saved into the database.`);
      return { message: "UserCreated" };
    } catch (error) {
      console.error(`Error saving user:`, (error as Error).message);
      return { message: (error as Error).message };
    }
  };

  findById = async (id: string) => {
    try {
      const user = await User.findById(id)
        .select("_id name email mobile userImage password")
        .lean();
      return user;
    } catch (error) {
      console.error(`Error finding service:`, (error as Error).message);
      throw new Error(`Service search failed`);
    }
  };

  findByIdAndUpdate = async (
    id: string,
    updates: Partial<UpdateUserRequest> ,
  ): Promise<{ message: string }> => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        console.log('User not found.');
        return { message: 'User not found.' };
      }
      console.log('User updated successfully.');
      return { message: 'UserUpdated' };
    } catch (error) {
      console.error('Error updating user:', (error as Error).message);
      return { message: (error as Error).message };
    }
  };
  
  findAll = async () => {
    try {
      const users = await User.find()
      return users;
    } catch (error) {
      console.error('Error finding User: ', (error as Error).message);
      throw new Error('User search failed');
    }
  }; 


  getUserCountAndGrowthRate = async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); 
      const currentYear = currentDate.getFullYear();
      const overallCount = await User.countDocuments();
      const aggregationResult = await User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(currentYear, currentMonth - 1, 1),
              $lte: new Date(currentYear, currentMonth + 1, 0),
            }
          }
        },
        {
          $group: {
            _id: { 
              year: { $year: "$createdAt" }, 
              month: { $month: "$createdAt" }
            },
            userCount: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": -1, "_id.month": -1 }
        },
        {
          $limit: 2
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            userCount: 1
          }
        }
      ]);
      if (aggregationResult.length === 2) {
        const [currentMonthData, previousMonthData] = aggregationResult;
        const currentMonthCount = currentMonthData.userCount;
        const previousMonthCount = previousMonthData.userCount;
        const growthRate = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
        return {
          overallCount: overallCount, 
          growthRate: growthRate.toFixed(2) 
        };
      } else {
        return { overallCount: overallCount, growthRate: 0 };
      }
    } catch (error) {
      console.error('Error fetching user data: ', (error as Error).message);
      throw new Error('Failed to fetch user data');
    }
  };
}

