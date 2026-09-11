export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'member' | 'trainer' | 'staff';
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    rfidTag?: string;
    avatar?: string;
  };
  token: string;
}
