import User from "../entities/user";
import { RegisterUser, UserInterface } from "../utilities/interface";

export default class UserRepository {
  findByEmail = async (email: string): Promise<UserInterface | null> => {
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
}
