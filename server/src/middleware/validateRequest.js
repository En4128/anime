import { ApiError } from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

export const validateRequest =
  (schema) =>
  (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod validation error
        const messages = error.errors.map((e) => {
          const path = e.path.join('.');
          return `${path}: ${e.message}`;
        });
        next(new ApiError(StatusCodes.BAD_REQUEST, messages.join(', ')));
      } else {
        next(error);
      }
    }
  };

