import { studentServices } from './student.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllUser = catchAsync(async (req, res) => {

  const students = await studentServices.getAllStudentIntoDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students data get successfully',
    data: students,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const id = req.params.id;

  const student = await studentServices.getASingleStudentIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data get successfully',
    data: student,
  });
});

const deleteSingleStudent = catchAsync(async (req, res) => {
  const id = req.params.id;

  const student = await studentServices.deleteASingleStudentFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data deleted successfully',
    data: student,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { student } = req.body;
  const result = await studentServices.updateStudentFromDB(id, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully successfully.',
    data: result,
  });
});
export const studentControllers = {
  getAllUser,
  getSingleStudent,
  deleteSingleStudent,
  updateStudent
};
