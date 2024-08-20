import express from 'express';
import { offeredCourseControllers } from './offeredCourse.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';

const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.offeredCourseCreateValidation),
  offeredCourseControllers.createOfferedCourse,
);

export const OfferedCourseRoutes = router;
