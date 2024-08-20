import { model, Schema } from 'mongoose';
import {
  ICourse,
  TCourseFaculties,
  TPreRequisiteCourses,
} from './course.interface';

const prerequisiteCourses = new Schema<TPreRequisiteCourses>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    isDeleted: { type: Boolean, default: false },
  },
  { _id: false },
);

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    prefix: { type: String },
    code: { type: Number, required: true },
    credits: { type: Number, required: true, trim: true },
    isDeleted: { type: Boolean },
    preRequisiteCourses: [prerequisiteCourses],
  },
  { timestamps: true },
);

const courseFacultiesSchema = new Schema<TCourseFaculties>({
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  faculties: [{ type: Schema.Types.ObjectId, ref: 'Faculty' }],
});

export const CourseFaculties = model<TCourseFaculties>(
  'CourseFaculties',
  courseFacultiesSchema,
);

export const Course = model<ICourse>('Course', courseSchema);
