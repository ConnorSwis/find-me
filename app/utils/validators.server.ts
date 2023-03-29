import type { IsValid } from "./types.server";

export const validateEmail = (email: string): IsValid => {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.length) {
    return "Please enter a value";
  };
  if (!validRegex.test(email)) {
    return "Please enter a valid email address";
  };
};

export const validatePassword = (password: string): IsValid => {
  if (password.length < 5) {
    console.log(password.length);
    return "Password must be at least 5 characters long";
  };
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if ( password !== confirmPassword ) return "Passwords don't match."
}

export const validateUsername = (username: string): IsValid => {
  if (!username.length) {
    return "Please enter a value";
  };
};
