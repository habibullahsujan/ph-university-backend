import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { academicFacultyControllers } from './academicFaculty.controllers';
import Auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.const';
const router = express.Router();

router.post(
  '/create-academic-faculty',
  Auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(AcademicFacultyValidation.academicFacultyCreateValidation),
  academicFacultyControllers.createAcademicFaculty,
);

router.get('/', academicFacultyControllers.getAllAcademicFaculties);
router.get('/:id', academicFacultyControllers.getSingleAcademicFaculty);
router.patch(
  '/:id',
  Auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(AcademicFacultyValidation.academicFacultyUpdateValidation),
  academicFacultyControllers.updateAcademicFaculty,
);
router.delete(
  '/:id',
  Auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  academicFacultyControllers.deleteAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
