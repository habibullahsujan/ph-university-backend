import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicSemesterServices } from './academicSemester.services';

const createAcademicSemester = catchAsync(async (req, res) => {
  const academicSemesterData = req.body;

  const result =
    await academicSemesterServices.createAcademicSemester(academicSemesterData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Semester created successfully',
    data: result,
  });
});


const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemester();
  sendResponse(res,{statusCode:httpStatus.OK,success:true,message:'Data retrieved successfully',data:result})
})

const getSingleAcademicSemester =catchAsync(async(req,res)=>{
  const {id}=req.params
  const result =await academicSemesterServices.getSingleAcademicSemester(id);
  sendResponse(res,{statusCode:httpStatus.OK,success:true,message:'Data retrieved successfully',data:result})
})

const updateSingleAcademicSemester = catchAsync(async(req,res)=>{
  const {id}=req.params
  const academicSemesterData=req.body
  const result= await academicSemesterServices.updateSingleAcademicSemester(id,academicSemesterData)
  sendResponse(res,{statusCode:httpStatus.OK,success:true,message:'Data retrieved successfully',data:result})
})

export const academicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
};
