import { model, Schema } from 'mongoose';
import { IAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<IAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  { timestamps: true },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isExist = await AcademicDepartment.findOne({ name: this.name });
  if (isExist) throw new AppError(httpStatus.BAD_REQUEST,'Academic Department is already exists.');
  next();
});
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const id=this.getQuery()
  const isExist = await AcademicDepartment.findOne(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND,'Academic Department is not exists.');
  next();
});

export const AcademicDepartment = model(
  'AcademicDepartment',
  academicDepartmentSchema,
);
