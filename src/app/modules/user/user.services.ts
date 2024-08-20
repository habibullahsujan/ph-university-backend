/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import generateStudentId from '../../utils/userUtils';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { IUser } from './user.interface';
import { User } from './user.model';
import mongoose from 'mongoose';
import { Faculty } from '../faculty/faculty.model';
import { IFaculty } from '../faculty/faculty.interface';
import { generateFacultyId } from '../../utils/generateFacultyId';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { generateAdminId } from '../../utils/generateAdminId';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  password: string,
  studentData: Partial<IStudent>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file:any
) => {
  // eslint-disable-next-line prefer-const
  const userData: Partial<IUser> = {};

  userData.password = password || (config.default_password as string);

  userData.role = 'student';
  userData.email = studentData.email;

  const studentAdmissionSemester = await AcademicSemester.findById(
    studentData.admissionSemester,
  );

  if (!studentAdmissionSemester) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid admission semester');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    userData.id = await generateStudentId(studentAdmissionSemester);

//send image to upload cloudinary
    const imageName=`${userData.id}${studentData.name?.firstName}`;
    const path =file.path
    const profileImg=await sendImageToCloudinary(imageName,path)




    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id;
    studentData.profileImg=profileImg;
    
    const result = await Student.create([studentData], { session });
    if (!result.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student'); // Ensure the error is rethrown so it can be handled by the caller
  }

  //generate id
};

const createFacultyIntoDB = async (
  password: string,
  facultyData: Partial<IFaculty>,
) => {
  const userData: Partial<IUser> = {};

  userData.password = password || (config.default_password as string);
  userData.role = 'faculty';
  userData.email = facultyData.email;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const lastFacultyId = await generateFacultyId();
    userData.id = lastFacultyId;
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    facultyData.id = newUser[0].id;
    facultyData.userId = newUser[0]._id;

    const newFaculty = await Faculty.create([facultyData], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty'); // Ensure the error is rethrown so it can be handled by the caller
  }
};

const createAdminIntoDB = async (
  password: string,
  adminData: Partial<IAdmin>,
) => {
  const userData: Partial<IUser> = {};

  userData.password = password || (config.default_password as string);
  userData.role = 'admin';
  userData.email = adminData.email;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const lastAdminId = await generateAdminId();
    userData.id = lastAdminId;
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    adminData.id = newUser[0].id;
    adminData.userId = newUser[0]._id;

    const newFaculty = await Admin.create([adminData], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin'); // Ensure the error is rethrown so it can be handled by the caller
  }
};

const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId });
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId });
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId });
  }

  return result;
};

const changeStatus = async (id: string, status: string) => {
  const result = await User.findByIdAndUpdate(id, { status: status },{new:true});

  return result;
};

export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
