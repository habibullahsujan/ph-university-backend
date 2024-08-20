import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { IAuth } from './auth.interface';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { issueJWTToken } from './auth.utils';
import jwt from 'jsonwebtoken';
import { sendMail } from '../../utils/sendMail';

const loginUser = async (payload: Partial<IAuth>) => {
  //check the user is exist or not
  const user = await User.isUserExist(payload?.id as string);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is not exist');
  }

  //check the user is deleted or not
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }
  //check the user is blocked or not
  const isBlocked = user?.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  if (
    !(await User.isPasswordMatched(payload.password as string, user.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid password');
  }
  //create access_token and refresh_token

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = issueJWTToken(
    jwtPayload,
    config.secretKey as string,
    config.jwt_secret_expires_in as string,
  );
  const refreshToken = issueJWTToken(
    jwtPayload,
    config.jwt_refresh_secret_key as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changeUserPassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExist(userData?.userId);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is not exist');
  }

  //check the user is deleted or not
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }
  //check the user is blocked or not
  const isBlocked = user?.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid password');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );
  await User.findOneAndUpdate(
    { id: userData.userId, role: userData.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    config.jwt_refresh_secret_key as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  const user = await User.isUserExist(userId);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is not exist');
  }

  //check the user is deleted or not
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }
  //check the user is blocked or not
  const isBlocked = user?.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  const passwordChangedTime = await User.isJWTIssuedBeforePasswordChange(
    user.passwordChangedAt as Date,
    iat as number,
  );

  if (user.passwordChangedAt && passwordChangedTime) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to perform this operation!',
    );
  }
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = issueJWTToken(
    jwtPayload,
    config.secretKey as string,
    config.jwt_secret_expires_in as string,
  );

  return { accessToken };
};

const forgetPassword = async (userId: string) => {
  const user = await User.isUserExist(userId);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is not exist');
  }

  //check the user is deleted or not
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }
  //check the user is blocked or not
  const isBlocked = user?.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = issueJWTToken(
    jwtPayload,
    config.secretKey as string,
    '30m',
  );
  const passwordResetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${accessToken}`;
  sendMail(user.email, 'Mr', passwordResetUILink);

};


const resetPassword=async(userData:{userId:string,newPassword:string},token:string)=>{
  const user = await User.isUserExist(userData?.userId);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is not exist');
  }

  //check the user is deleted or not
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }
  //check the user is blocked or not
  const isBlocked = user?.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }
  const decoded= jwt.verify(token,config.secretKey as string)as JwtPayload

  if(decoded.userId!==userData.userId){
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid token');
  }

  const newHashedPassword = await bcrypt.hash(
    userData.newPassword,
    Number(config.bcrypt_salt_round),
  );
  await User.findOneAndUpdate(
    { id: decoded.userId, role: decoded.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
}

export const authServices = {
  loginUser,
  changeUserPassword,
  refreshToken,
  forgetPassword,
  resetPassword
};
