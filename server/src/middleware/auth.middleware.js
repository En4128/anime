import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/token.js';
import { ApiError } from '../utils/apiError.js';
import { UserRepository } from '../repositories/user.repository.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }
    const token = header.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await UserRepository.findById(decoded.sub);
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token');
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Insufficient permissions'));
    }
    return next();
  };

