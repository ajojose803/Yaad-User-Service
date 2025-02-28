import { Container } from "inversify";
import TYPES from "./types";
import RegisterUseCase  from "./core/useCases/userRegistrationUseCase";
import  RegisterController from "./app/controllers/registerController";
import UserRepository  from "./data/repositories/UserRepository";
import { AuthService } from "./app/middleware/AuthService"; 
import { OtpService } from "./infrastructure/services/OtpService";
import { IUserRepository } from "./core/domain/interfaces/IUserRepository";
import { IAuthService } from "./core/domain/interfaces/IAuthService";
import { IOtpService } from "./core/domain/interfaces/IOtpService";

const container = new Container();

// Bind interfaces to concrete implementations
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IOtpService>(TYPES.OtpService).to(OtpService);

// Bind use cases & controllers
container.bind<RegisterUseCase>(TYPES.RegisterUseCase).to(RegisterUseCase);
container.bind<RegisterController>(TYPES.RegisterController).to(RegisterController);

export default container;
