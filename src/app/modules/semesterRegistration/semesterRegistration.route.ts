import express from 'express';
import { semesterRegistrationControllers } from './semesterRegistration.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidationSchema } from './semesterRegistration.validation';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidationSchema.createSemesterRegistration,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);

router.get('/', semesterRegistrationControllers.getAllRegisteredSemesters);
router.get('/:id', semesterRegistrationControllers.getSingleRegisteredSemester);
router.patch('/:id', semesterRegistrationControllers.updateRegisteredSemester);

export const SemesterRegistrationRoutes = router;
