import express from 'express';
import { academicSemesterControllers } from './academicSemester.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(academicSemesterValidation.academicSemesterValidationSchema),
  academicSemesterControllers.createAcademicSemester,
);

router.get('/', academicSemesterControllers.getAllAcademicSemesters);
router.get('/:id', academicSemesterControllers.getSingleAcademicSemester);
router.patch(
  '/:id',
  validateRequest(
    academicSemesterValidation.academicSemesterUpdateValidationSchema,
  ),
  academicSemesterControllers.updateSingleAcademicSemester,
);

export const AcademicSemesterRoutes = router;
