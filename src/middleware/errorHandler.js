function errorHandler(error, req, res, next) {
  console.error('[ERROR]', error.stack || error.message);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.status || error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? 'An unexpected server error occurred.' : error.message,
    ...(process.env.NODE_ENV !== 'production' ? { details: error.message } : {})
  });
}

module.exports = errorHandler;
