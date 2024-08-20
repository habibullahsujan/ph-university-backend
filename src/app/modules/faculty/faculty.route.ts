import express from 'express';
import { facultyControllers } from './faculty.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';

const router = express.Router();

router.get('/', facultyControllers.getAllFaculties);
router.get('/:id', facultyControllers.getSingleFaculty);
router.patch(
  '/:id',
  validateRequest(facultyValidations.facultyUpdateValidationSchema),
  facultyControllers.updateAFaculty,
);
router.delete('/:id', facultyControllers.deleteAFaculty);

export const FacultyRoutes = router;
