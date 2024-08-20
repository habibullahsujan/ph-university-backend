/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { IStudent } from './student.interface';

import { searchableQuery } from './student.constant';
import QueryBuilder from '../../query/QueryBuilder';

const getAllStudentIntoDB = async (query: Record<string, any>) => {


  // let searchTerm = '';
  // const queryObj = { ...query };
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm;
  // }
  // const searchQuery = Student.find({
  //   $or: ['email', 'name.firstName', 'presentAddress'].map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page','fields'];
  // excludeFields.map((field) => delete queryObj[field]);
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //       model: 'AcademicFaculty',
  //     },
  //   });

  // let sort = '-createdAt';
  // if (query.sort) {
  //   sort = query.sort as string;
  // }
  // const sortQuery = filterQuery.sort(sort);
  // let limit = 1;
  // let page = 1;
  // let skip = 0;
  // if (query.limit) {
  //   limit = Number(query.limit);
  // }
  // if (query.page) {
  //   page = query.page;
  //   skip = Number(page - 1) * limit;
  // }
  // const paginateQuery = sortQuery.skip(skip);
  // const limitQuery = paginateQuery.limit(limit);
  // let fields = '__v';
  // if (query.fields) {
  //   fields = query.fields.split(',').join(' ');
  // }
  // const fieldsQuery = await limitQuery.select(fields);
  // return fieldsQuery;

  const studentsData = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
          model: 'AcademicFaculty',
        },
      }),
    query,
  )
    .search(searchableQuery)
    .filter()
    .sort()
    .paginate()
    .fieldsLimit();
  const result = await studentsData.modelQuery;
  return result;
};

const getASingleStudentIntoDB = async (id: string) => {
  const result = await Student.findById(id);
  return result;
};
const deleteASingleStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Student delete operation failed!',
      );
    }
    const deletedUser = await User.findByIdAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'User delete operation failed!',
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Delete operation failed!');
  }
};

const updateStudentFromDB = async (id: string, payload: Partial<IStudent>) => {
  const { name, guardian, localGuardian, ...restData } = payload;

  const transformedStudentData: Record<string, unknown> = { ...restData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      transformedStudentData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      transformedStudentData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian)) {
    for (const [key, value] of Object.entries(localGuardian)) {
      transformedStudentData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(
    { id },
    transformedStudentData,
    { new: true },
  );
  return result;
};

export const studentServices = {
  getAllStudentIntoDB,
  getASingleStudentIntoDB,
  deleteASingleStudentFromDB,
  updateStudentFromDB,
};
