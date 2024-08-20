import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.services';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user login success',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changeUserPassword = catchAsync(async (req, res) => {
  const result = await authServices.changeUserPassword(req.user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully.',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token is generated.',
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {

  const {userId}=req.body

  const result = await authServices.forgetPassword(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset link is generated.',
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {


  const token=req.headers.authorization

  const result = await authServices.resetPassword(req.body,token as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully.',
    data: result,
  });
});

export const authControllers = {
  loginUser,
  changeUserPassword,
  refreshToken,
  forgetPassword,
  resetPassword
};
