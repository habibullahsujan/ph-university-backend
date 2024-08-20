import { model, Schema } from 'mongoose';
import { IAcademicFaculty } from './academicFaculty.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicFacultySchema = new Schema<IAcademicFaculty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

academicFacultySchema.pre('save', async function (next) {
  const isExist = await AcademicFaculty.findOne({ name: this.name });
  if (isExist) throw new AppError(httpStatus.FORBIDDEN,'Faculty already exists');

  next();
});
academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  const id=this.getQuery()
  const isExist = await AcademicFaculty.findOne(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND,'Faculty is not exists');
  next();
});

export const AcademicFaculty = model('AcademicFaculty', academicFacultySchema);
