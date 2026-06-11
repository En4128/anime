import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { ApiError } from '../utils/apiError.js';
import { signToken } from '../utils/token.js';
import { USER_ROLES } from '../constants/roles.js';

export const AuthService = {
  register: async ({ username, email, password }) => {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already in use');
    }
    const hashed = await hashPassword(password);
    const user = await UserRepository.create({ username, email, password: hashed, role: USER_ROLES.USER });
    return AuthService.buildAuthPayload(user);
  },

  login: async ({ email, password }) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    return AuthService.buildAuthPayload(user);
  },

  buildAuthPayload: (user) => {
    const token = signToken({ sub: user._id, role: user.role });
    return {
      token,
      user: user.toPublic(),
    };
  },

  getProfile: async (userId) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    return user.toPublic();
  },
};

