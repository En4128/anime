export class ApiError extends Error {
  constructor(statusCode = 500, message = 'Something went wrong', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const throwIf = (condition, statusCode, message) => {
  if (condition) {
    throw new ApiError(statusCode, message);
  }
};

