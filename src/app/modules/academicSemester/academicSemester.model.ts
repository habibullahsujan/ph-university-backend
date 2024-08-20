import { model, Schema } from 'mongoose';
import { IAcademicSemester } from './academicSemester.interface';
import {
  Months,
  AcademicSemesterCode,
  AcademicSemesterName,
} from './academicSemester.constants';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicSemesterSchema = new Schema<IAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterName,
      required: true,
    },
    code: {
      type: String,
      enum: AcademicSemesterCode,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  { timestamps: true },
);



academicSemesterSchema.pre('save', async function (next) {
  const isAcademicSemesterExist = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isAcademicSemesterExist) {
    throw new AppError(httpStatus.FORBIDDEN,'Academic Semester already exist');
  }
  next();
});
academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
  const id=this.getQuery()
  const isAcademicSemesterExist = await AcademicSemester.findOne(id);
  if (!isAcademicSemesterExist) {
    throw new AppError(httpStatus.FORBIDDEN,'Academic Semester is not exist');
  }
  next();
});
export const AcademicSemester = model<IAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);