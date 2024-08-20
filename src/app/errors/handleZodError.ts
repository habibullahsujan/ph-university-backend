import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../interface/error.interface";

const handleZodError = (err: ZodError):TGenericErrorResponse => {
  const errorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: 'Validation error',
    errorSources,
  };
};

export default handleZodError;
