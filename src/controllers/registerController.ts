import RegisterUseCase from "../useCases/userRegistrationUseCase";

const registerUseCase = new RegisterUseCase();

export default class RegisterController {
  registerUser = async (
    call: {
      request: {
        name: string;
        email: string;
        phone: string;
        password: string;
        userImage: string;
        otp: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    const { name, email, password, phone, userImage, otp } = call.request;
    try {
      const response = await registerUseCase.registerUser(
        name,
        email,
        password,
        phone,
        userImage,
        otp
      );
      callback(null, response);
    } catch (error) {
      console.error(`Signup Failed:`, error);
      callback(null, { error: (error as Error).message });
    }
  };

  signupOtp = async (
    call: { request: { name: string; email: string } },
    callback: (error: any, response: any) => void
  ) => {
    const {name, email} = call.request;
    try{
      const response = await registerUseCase.signupOtp(name, email);
      callback(null, response);
    } catch(error){
      console.error('Otp sending failed:', error);
      callback(null, {error: (error as Error).message})
    }
  };
  
  resendOtp = async( 
    call:{request: {name:string; email:string}},
    callback: (error:any, response:any) => void
  ) => {
    // console.log("")
    const {name, email} = call.request;
    try{
      console.log(`Resending otp for:`, {name, email});
      const response = await registerUseCase.resendOtp(name, email);
      console.log('otp response', response);
      callback(null, response);
    } catch(error) {
      console.error('Otp sending failed:', error);
      callback(null, {error: (error as Error).message});
    }
  } 
}
