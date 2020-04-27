class AppError extends Error {
  constructor(errorMessage, statusCode) {
    console.log(errorMessage)
    super(errorMessage);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;