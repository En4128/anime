import { StatsService } from '../services/stats.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res) => {
  const stats = await StatsService.getDashboardMetrics();
  return successResponse(res, { data: stats });
};

