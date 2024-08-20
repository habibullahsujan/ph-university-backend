import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error.interface';

const handleValidationError = (err: mongoose.Error.ValidationError):TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (er: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: er?.path,
        message: err?.message,
      };
    },
  );

  return {
    statusCode: 400,
    message: 'Validation error',
    errorSources,
  };
};

export default handleValidationError;
