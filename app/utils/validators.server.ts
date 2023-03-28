export const validateEmail = (email: string): string | true => {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.length) {
    return `Please enter a value`;
  }
  if (!validRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return true;
};

export const validatePassword = (password: string): string | true => {
  if (password.length < 5) {
    return "Please enter a password that is at least 5 characters long";
  }
  return true;
};

export const validateUsername = (username: string): string | true => {
  if (!username.length) return `Please enter a value`;
  return true;
};