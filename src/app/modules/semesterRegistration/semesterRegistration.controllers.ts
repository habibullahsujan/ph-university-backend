import httpStatus from 'http-status';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { semesterRegistrationServices } from './semesterRegistration.services';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const semesterRegistrationData = req.body;

  const result =
    await semesterRegistrationServices.createSemesterRegistrationIntoDB(
      semesterRegistrationData,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration successfully created',
    data: result,
  });
});

const getAllRegisteredSemesters = catchAsync(async (req, res) => {
  const result = await semesterRegistrationServices.getAllRegisteredSemesters(
    req.params,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registered Semesters data retrieved successfully!',
    data: result,
  });
});
const getSingleRegisteredSemester = catchAsync(async (req, res) => {
  const result = await semesterRegistrationServices.getSingleRegisteredSemester(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registered Semester data retrieved successfully!',
    data: result,
  });
});

const updateRegisteredSemester = catchAsync(async (req, res) => {
  const updatedData = req.body;
  const { id } = req.params;
  const result = await semesterRegistrationServices.updateRegisteredSemester(
    id,
    updatedData,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registered Semester updated!',
    data: result,
  });
});

export const semesterRegistrationControllers = {
  createSemesterRegistration,
  getAllRegisteredSemesters,
  getSingleRegisteredSemester,
  updateRegisteredSemester,
};
