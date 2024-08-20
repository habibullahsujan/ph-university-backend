import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { academicDepartmentControllers } from './academicDepartment.controllers';
import Auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.const';

const router = express.Router();

router.post(
  '/create-academic-department',
  Auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(
    AcademicDepartmentValidation.academicDepartmentCreateValidation,
  ),
  academicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/',
  Auth(USER_ROLES.admin),
  academicDepartmentControllers.getAllAcademicDepartments,
);
router.get('/:id', academicDepartmentControllers.getSingleAcademicDepartment);
router.patch(
  '/:id',
  Auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(
    AcademicDepartmentValidation.academicDepartmentUpdateValidation,
  ),
  academicDepartmentControllers.updateAcademicDepartment,
);
router.delete(
  '/:id',
  Auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  academicDepartmentControllers.deleteAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
