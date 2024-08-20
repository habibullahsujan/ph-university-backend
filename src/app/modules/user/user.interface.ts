/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLES } from './user.const';

export interface IUser {
  id: string;
  password: string;
  email:string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'superAdmin'|'admin' | 'student' | 'faculty';
  isDeleted: boolean;
  status: 'in-progress' | 'blocked';
}

export interface UserModel extends Model<IUser> {
  // myStaticMethod(): number;
  isUserExist(id: string): Promise<IUser>;
  isPasswordMatched(
    newPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isUserDeleted(id: string): Promise<IUser>;
  isJWTIssuedBeforePasswordChange(passwordChangedTime:Date, jwtIssuedTime:number): boolean;
}

export type TUserRoles = keyof typeof USER_ROLES;
