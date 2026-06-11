export class ApiResponse {
  constructor(success, message, data = null, meta = null) {
    this.success = success;
    this.message = message;
    if (data !== null) this.data = data;
    if (meta !== null) this.meta = meta;
  }
}

export const successResponse = (res, { message = 'Success', data = null, meta = null, statusCode = 200 }) =>
  res.status(statusCode).json(new ApiResponse(true, message, data, meta));

