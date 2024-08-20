import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrolledCourseServices } from './enrolledCourse.services';

const createEnrolledCourse = catchAsync(async (req, res) => {

    const userId=req.user.userId
  const result = await enrolledCourseServices.createEnrolledCourse(userId,req.body.offeredCourse);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course enrolled successfully',
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const userId=req.user.userId
  const result = await enrolledCourseServices.updateEnrolledCourseMarks(userId,req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course marks updated successfully',
    data: result,
  });
});



export const enrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks

};
