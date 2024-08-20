import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidationSchema } from './enrolledCourse.validation';
import { enrolledCourseControllers } from './enrolledCourse.controllers';
import Auth from '../../middlewares/auth';

const router = express.Router();
router.post(
  '/create-enrolled-course',
  Auth('student'),
  validateRequest(
    EnrolledCourseValidationSchema.enrolledCourseCreateValidationSchema,
  ),
  enrolledCourseControllers.createEnrolledCourse,
);

router.patch(
  '/update-enrolled-course-marks',
  Auth('faculty'),
  validateRequest(
    EnrolledCourseValidationSchema.updateEnrolledCourseMarksSchema,
  ),
  enrolledCourseControllers.updateEnrolledCourseMarks,
);

export const EnrolledCourseRoutes = router;
