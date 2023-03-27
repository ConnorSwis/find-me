export interface RegisterForm {
  email: string;
  password: string;
  username: string;
}

export interface LoginForm {
  email?: string;
  password: string;
  username?: string;
}
