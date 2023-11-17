import type { IsValid } from "./types.server";

const hasLength = (fieldText: string, atLeast: number = 1) => {
  return fieldText?.length >= atLeast;
};

const atMost = (fieldText: string, _atMost: number = 32) => {
  return fieldText.length <= _atMost;
};

const isAlphaNum = (fieldText: string) => {
  return /^[A-Za-z0-9_]*$/.test(fieldText);
};

const isEmail = (fieldText: string) => {
  if (hasLength(fieldText)) {
    let emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(fieldText);
  }
  return false;
};

export const validateEmail = (email: string): IsValid => {
  if (!hasLength(email)) return "Please enter a value.";
  if (!atMost(email, 64)) return "Email is too long.";
  if (!isEmail(email)) return "Please enter a valid email address.";
};

export const validatePassword = (password: string): IsValid => {
  if (!hasLength(password)) return "Please enter a value.";
  const PASSWORD_LENGTH = parseInt(process.env.PASSWORD_LENGTH as string) || 5;
  if (!hasLength(password, PASSWORD_LENGTH)) {
    return `Password must be at least ${PASSWORD_LENGTH} characters long.`;
  }
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
  if (!hasLength(username, 3)) {
    return `Username must be at least 3 characters long.`;
  }
  if (!atMost(username)) return "Username is too long.";
  if (!isAlphaNum(username)) return "Letters, numbers, and underscores only."
};

export const validateNewLinkTitle = (newTitle: string) => {
  if (!hasLength(newTitle)) return "Please enter a value.";
};
export const validateUrl = (newUrl: string) => {
  if (!hasLength(newUrl)) return "Please enter a value.";
  if (!/^.*\..+$/.test(newUrl)) return "Please enter valid URL."
  try {
    new URL(newUrl);
    return;
  } catch {
  }
  return "Please enter valid url.";
};
