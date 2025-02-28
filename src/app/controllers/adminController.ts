import { ObjectId } from "mongodb"; 
import auth from "../middleware/AuthService";
import {ServiceError, ServerUnaryCall, sendUnaryData, Metadata } from "@grpc/grpc-js";
import jwt from 'jsonwebtoken';

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


    // authInterceptor = (
    //   call: ServerUnaryCall<any, any>,
    //   methodDefinition: any,
    //   callback: sendUnaryData<any>
    // ) => {
    //   const authHeader = call.metadata.get("authorization")[0] as string | undefined;
    //   if (!authHeader) {
    //     return callback(
    //       {
    //         name: "Unauthorized",
    //         message: "No authorization token provided",
    //         code: 16, // UNAUTHENTICATED
    //         details: "",
    //         metadata: new Metadata(),
    //       } as ServiceError,
    //       null
    //     );
    //   }
    
    //   const token = authHeader.replace(/^Bearer\s/, "");
    //   try {
    //     (call.request as any).user = jwt.verify(token, process.env.JWT_SECRET!);
    //     // Proceed with the call—if using a chain, invoke next here.
    //     return callback(null, undefined);
    //   } catch {
    //     return callback(
    //       {
    //         name: "Unauthorized",
    //         message: "Invalid or expired token",
    //         code: 16,
    //         details: "",
    //         metadata: new Metadata(),
    //       } as ServiceError,
    //       null
    //     );
    //   }
    // };
}