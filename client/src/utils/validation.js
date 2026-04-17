export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, message: 'Email is required.' };
  if (!re.test(email)) return { valid: false, message: 'Email format is invalid.' };
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Password is required.' };
  if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters.' };
  return { valid: true };
};

export const validateName = (name) => {
  if (!name) return { valid: false, message: 'Name is required.' };
  if (name.trim().length < 2) return { valid: false, message: 'Name must be at least 2 characters.' };
  return { valid: true };
};

export const validatePrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return { valid: false, message: 'Price must be a valid number.' };
  if (num <= 0) return { valid: false, message: 'Price must be greater than 0.' };
  return { valid: true };
};

export const validateStock = (stock) => {
  const num = Number(stock);
  if (isNaN(num)) return { valid: false, message: 'Stock must be a valid number.' };
  if (num < 0) return { valid: false, message: 'Stock cannot be negative.' };
  return { valid: true };
};
