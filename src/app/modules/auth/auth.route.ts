import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { authControllers } from './auth.controllers';
import Auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.const';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.authValidationSchema),
  authControllers.loginUser,
);

router.post(
  '/change-password',
  Auth(USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  authControllers.changeUserPassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);
router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  authControllers.forgetPassword,
);
router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  authControllers.resetPassword,
);
export const AuthRoutes = router;
