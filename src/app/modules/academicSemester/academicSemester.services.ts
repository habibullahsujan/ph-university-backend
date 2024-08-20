import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemesterNameCodeMapper } from './academicSemester.constants';
import { IAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemester = async (
  academicSemesterData: IAcademicSemester,
) => {
  if (
    AcademicSemesterNameCodeMapper[academicSemesterData.name] !==
    academicSemesterData.code
  ) {
    throw new AppError(httpStatus.FORBIDDEN,'Invalid semester name or code');
  }
  const result = await AcademicSemester.create(academicSemesterData);
  return result;
};

const getAllAcademicSemester = async () => {
  const result = await AcademicSemester.find({});
  return result;
};


const getSingleAcademicSemester = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};


const updateSingleAcademicSemester = async (
  id: string,
  data: Partial<IAcademicSemester>,
) => {
  const result = await AcademicSemester.findByIdAndUpdate(id, data);
  return result;
};


export const academicSemesterServices = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
};
