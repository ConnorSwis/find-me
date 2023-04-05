export interface RegisterForm {
  email: string;
  password: string;
  username: string;
};

export interface LoginForm {
  email: string;
  password: string;
  username: string;
};

export interface NewLinkFormType {
  title: string;
  url: string;
  authorId: string
}

export type IsValid = string | undefined;