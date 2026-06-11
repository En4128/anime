import { ApiError } from '../utils/apiError.js';
import { isDev } from '../config/env.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || [],
  };
  if (isDev) {
    response.stack = err.stack;
    console.error('Error:', {
      message: err.message,
      statusCode,
      path: req.path,
      method: req.method,
      stack: err.stack,
    });
  }
  res.status(statusCode).json(response);
};

