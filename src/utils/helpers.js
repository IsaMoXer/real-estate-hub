export function validateEmailFormat(email) {
  // This regex pattern checks for a basic email format:
  // - One or more characters before the @ symbol
  // - Followed by @ symbol
  // - Followed by one or more characters
  // - Followed by a dot
  // - Followed by 2 to 4 characters for the top-level domain
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;
  return emailRegex.test(email);
}

export function validatePasswordFormat(password) {
  // This function checks if the password meets the following criteria:
  // - At least 8 characters long
  // - Contains at least one uppercase letter
  // - Contains at least one lowercase letter
  // - Contains at least one number
  // - Contains at least one special character

  if (password.length < 8) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);

  return hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
}
