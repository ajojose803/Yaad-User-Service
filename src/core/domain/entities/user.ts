import mongoose, { Schema } from "mongoose";
import { IUser } from "../../../utilities/interface";

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
    },
    accountStatus: {
      type: String,
      default: "Active",
    },
    role: {
      type: String,
      default: "USER",
    },
    
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<IUser>('Users', UserSchema);

export default userModel;