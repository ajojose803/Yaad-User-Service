export interface IUserRepository {
    findByEmail(email: string): Promise<any>;
    saveUser(user: any): Promise<any>;
  }
  