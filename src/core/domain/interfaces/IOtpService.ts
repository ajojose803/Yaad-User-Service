export interface IOtpService {
  sendOtp(name: string, email: string): Promise<string>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
}
