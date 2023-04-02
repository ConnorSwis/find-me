import type { IsValid } from "./types.server";

const hasLength = (fieldText: string, atLeast: number = 1) => {
  return fieldText.length >= atLeast;
};

const isEmail = (fieldText: string) => {
  if (hasLength(fieldText)) {
    let emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(fieldText);
  };
  return false;
};

const isUrl = (fieldText: string) => {
  let urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  return urlRegex.test(fieldText);
}

export const validateEmail = (email: string): IsValid => {
  if (!hasLength(email)) return "Please enter a value.";
  if (!isEmail(email)) return "Please enter a valid email address.";
};

export const validatePassword = (password: string): IsValid => {
  if (!hasLength(password)) return "Please enter a value.";
  const PASSWORD_LENGTH = parseInt(process.env.PASSWORD_LENGTH as string) || 5;
  if (!hasLength(password, PASSWORD_LENGTH)) {
    return `Password must be at least ${PASSWORD_LENGTH} characters long.`;
  };
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
) => {
  if (!hasLength(confirmPassword)) return "Please enter a value.";
  if (password !== confirmPassword) return "Passwords don't match.";
};

export const validateUsername = (username: string): IsValid => {
  if (!hasLength(username)) return "Please enter a value.";
};

export const validateNewLinkTitle = (newTitle: string) => {
  if (!hasLength(newTitle)) return "Please enter a value.";
  
};
export const validateNewLinkUrl = (newUrl: string) => {
  if (!hasLength(newUrl)) return "Please enter a value.";
  if (!isUrl(newUrl)) return "Enter valid url.";
};
