import { ObjectId } from "mongodb"; 
import auth from "../middleware/auth";

export default class AdminController {
    loginAdmin = async (call: { request: { email: string; password: string } }, callback: (error: any, response: any) => void) => {
        try {
            const { email, password } = call.request;
            console.log('Admin Login:', email, password);
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
            if (email === adminEmail && password === adminPassword) {
                const token = await auth.createToken(new ObjectId(), 'ADMIN', '3d');
                callback(null, {
                  message: 'Success',
                  name: adminEmail,
                  token,
                });
              } else {
                callback(null, { message: 'Invalid Credentials' });
              }
        } catch (error) {
            console.error('Admin Login failed:', error);
            callback(null, { error: (error as Error).message });
        }
    }
}