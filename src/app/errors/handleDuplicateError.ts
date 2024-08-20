/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from '../interface/error.interface';

const handleDuplicateError = (err:any): TGenericErrorResponse => {

  const match=err?.message.match(/"([^"]*)"/);
  const extractedMessage=match && match[1]
    const errorSources:TErrorSources=[
      {path:'',
        message:`${extractedMessage} is already exist.`
      }
    ]
  return {
    statusCode: 400,
    message: 'Duplicate error',
    errorSources:errorSources,
  }
};

export default handleDuplicateError;
