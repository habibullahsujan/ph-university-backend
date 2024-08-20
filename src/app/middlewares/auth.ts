import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRoles } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const Auth = (...userRoles: TUserRoles[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    //check the token is given or not
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    //check the token is valid or not
    const decoded = jwt.verify(token, config.secretKey as string) as JwtPayload;

    const { role, userId, iat } = decoded;

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
    if (!userRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to perform this operation!',
      );
    }
    const passwordChangedTime = await User.isJWTIssuedBeforePasswordChange(
      user.passwordChangedAt as Date,
      iat as number,
    );

    if (
      user.passwordChangedAt &&
      passwordChangedTime
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to perform this operation!',
      );
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default Auth;
