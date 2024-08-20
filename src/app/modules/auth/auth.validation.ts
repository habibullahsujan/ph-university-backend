import { string, z } from 'zod';

const authValidationSchema = z.object({
  body: z.object({
    id: string({ required_error: 'Id is required.' }),
    password: string({ required_error: 'Password is required.' }),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: string({ required_error: 'Old password is required.' }),
    newPassword: string({ required_error: 'New password is required.' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required.' }),
  }),
});
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User id is required.' }),
  }),
});
const resetPasswordValidationSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User id is required.' }),
    newPassword: z.string({ required_error: 'New password is required.' }),
  }),
});

export const AuthValidation = {
  authValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
