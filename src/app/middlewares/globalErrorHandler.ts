/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../interface/error.interface';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars, @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next,
) => {
  let errorCode = 500;
  let errorMessage = 'Something went wrong';

  let errorSources: TErrorSources = [{ path: '', message: '' }];

  if (err instanceof ZodError) {
    const simplifiedZodError = handleZodError(err);
    errorCode = simplifiedZodError.statusCode;
    errorMessage = simplifiedZodError.message;
    errorSources = simplifiedZodError.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedValidationError = handleValidationError(err);
    errorCode = simplifiedValidationError.statusCode | 500;
    errorMessage = simplifiedValidationError.message;
    errorSources = simplifiedValidationError.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedCastError = handleCastError(err);
    errorCode = simplifiedCastError.statusCode;
    errorMessage = simplifiedCastError.message;
    errorSources = simplifiedCastError.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedCastError = handleDuplicateError(err);
    errorCode = simplifiedCastError.statusCode;
    errorMessage = simplifiedCastError.message;
    errorSources = simplifiedCastError.errorSources;
  } else if (err instanceof AppError) {
    errorCode = err.statusCode;
    errorMessage = err.message;
    errorSources = [{ path: '', message: err.message }];
  } else if (err instanceof Error) {
    errorMessage = err.message;
    errorSources = [{ path: '', message: err.message }];
  }
  return res.status(errorCode).json({
    success: false,
    message: errorMessage,
    errorSources,
    err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
