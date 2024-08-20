import express, { NextFunction, Request, Response } from 'express';
import { userControllers } from './user.controllers';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';
import Auth from '../../middlewares/auth';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();
router.post(
  '/create-student',
  upload.single('file'),
  (req:Request,res:Response,next:NextFunction)=>{
    req.body=JSON.parse(req.body.data)
    next()
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);
router.post(
  '/create-faculty',
  validateRequest(facultyValidations.facultyCreateValidationSchema),
  userControllers.createFaculty,
);
router.post(
  '/create-admin',
  validateRequest(adminValidations.adminCreateValidationSchema),
  userControllers.createAdmin,
);
router.post(
  '/change-status/:id',
  Auth('admin'),
  validateRequest(UserValidation.userStatusUpdateValidationSchema),
  userControllers.changeStatus,
);

router.get('/me', Auth('admin', 'faculty', 'student'), userControllers.getMe);

export const UserRoutes = router;
