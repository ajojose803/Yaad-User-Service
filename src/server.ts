import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import "dotenv/config";
import connectDB from "./config/mongo";

import RegisterController from "./controllers/registerController";

const registerController = new RegisterController();

connectDB();

const PROTO_PATH = path.resolve(__dirname, "./proto/user.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;

if (
  !grpcObject.user ||
  !grpcObject.user.User ||
  !grpcObject.user.User.service
) {
  console.error("Failed to load the User service from the proto file.");
  process.exit(1);
}

const server = new grpc.Server();

server.addService(grpcObject.user.User.service, {
    SignupOtp:registerController.signupOtp,
    ResendOtp: registerController.resendOtp,
    RegisterUser: registerController.registerUser,
})

const SERVER_ADDRESS = process.env.GRPC_SERVER_PORT || "50001";
const Domain =
  process.env.NODE_ENV === "dev"
    ? process.env.DEV_DOMAIN
    : process.env.PRO_DOMAIN_USER;
console.log(Domain);

server.bindAsync(
  `${Domain}:${SERVER_ADDRESS}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(`Failed to bind server: ${err}`);
      return;
    }
    console.log(`gRPC server running at ${port}`);
  }
);
