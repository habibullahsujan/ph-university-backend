import express from 'express';
import { studentControllers } from './student.controllers';
const router = express.Router();



router.get('/', studentControllers.getAllUser);
router.get('/:id', studentControllers.getSingleStudent);
router.patch('/:id',studentControllers.updateStudent);
router.delete('/:id', studentControllers.deleteSingleStudent);

export const StudentRoutes = router;
