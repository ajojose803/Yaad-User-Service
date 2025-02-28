import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { IAuthService } from "../../core/domain/interfaces/IAuthService"; 

export class AuthService implements IAuthService {
  async createToken(
    clientId: ObjectId | string,
    role: string,
    expire: string
  ): Promise<string> {
    try{
        const jwtSecretKey: string = process.env.USER_SECRET_KEY || 'yaad';
        const payload = {
            clientId: clientId,
            role:role,
        };
        const token = jwt.sign(payload, jwtSecretKey, {expiresIn: expire});
        return token;
    } catch(error){
        console.error(error);
        return "Error in creating token"
    }
  }
};
