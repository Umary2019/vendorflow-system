export const parseApiError = (error) => {
  if (error instanceof TypeError) {
    return 'Network error - please check your connection.';
  }

  if (error.message) {
    if (error.message.includes('401') || error.message.includes('Token')) {
      return 'Session expired. Please login again.';
    }
    if (error.message.includes('403')) {
      return 'Access denied. You do not have permission.';
    }
    if (error.message.includes('404')) {
      return 'Resource not found.';
    }
    return error.message;
  }

  return 'An unexpected error occurred.';
};

export const getErrorMessage = (error, defaultMsg = 'An error occurred.') => {
  if (!error) return defaultMsg;
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return defaultMsg;
};
