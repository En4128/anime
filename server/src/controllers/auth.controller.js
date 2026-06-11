import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/auth.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const register = async (req, res) => {
  const auth = await AuthService.register(req.body);
  return successResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Account created',
    data: auth,
  });
};

export const login = async (req, res) => {
  const auth = await AuthService.login(req.body);
  return successResponse(res, {
    message: 'Logged in',
    data: auth,
  });
};

export const profile = async (req, res) => {
  const user = await AuthService.getProfile(req.user.id);
  return successResponse(res, { data: user });
};

