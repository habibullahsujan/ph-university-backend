import express from 'express';
import { courseControllers } from './course.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.courseCreateValidationSchema),
  courseControllers.createCourse,
);
router.get('/', courseControllers.getAllCourses);
router.get('/:id', courseControllers.getSingleCourse);
router.delete('/:id', courseControllers.deleteCourse);
router.patch(
  '/:id',
  validateRequest(CourseValidations.courseUpdateValidationSchema),
  courseControllers.updateCourse,
);
router.put(
  '/:id/assign-faculties',
  validateRequest(CourseValidations.facultiesValidationSchema),
  courseControllers.assignFaculties,
);
router.delete(
  '/:id/remove-faculties',
  validateRequest(CourseValidations.facultiesValidationSchema),
  courseControllers.removeFacultyWithCourse,  
);

export const CourseRoutes = router;
