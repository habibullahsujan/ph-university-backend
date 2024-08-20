import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { offeredCourseServices } from './offeredCourse.services';

const createOfferedCourse = catchAsync(async (req, res) => {
  const offeredCourseData = req.body;
  const result =
    await offeredCourseServices.createOfferedCourseIntoDB(offeredCourseData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course created successfully',
    data: result,
  });
});

export const offeredCourseControllers = { createOfferedCourse };
