export interface IAuthService {
    createToken(userId: string, role: string, expiresIn: string): Promise<string>;
  }
  