import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { academicDepartmentServices } from "./academicDepartment.services";


const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartmentData = req.body;
  const result =
    await academicDepartmentServices.createAcademicDepartmentIntoDB(academicDepartmentData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty data successfully created',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result = await academicDepartmentServices.getAllAcademicDepartment();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department data retrieved successfully.',
    data: result,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await academicDepartmentServices.getSingleAcademicDepartment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty data retrieved successfully.',
    data: result,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const academicDepartmentData = req.body;
  const result = await academicDepartmentServices.updateAcademicDepartment(id,academicDepartmentData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty data updated successfully.',
    data: result,
  });
});

const deleteAcademicDepartment= catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await academicDepartmentServices.deleteAcademicDepartment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty deleted successfully.',
    data: result,
  });
});

export const academicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
    deleteAcademicDepartment,
};
