import { Schema, model } from 'mongoose';
import { IFaculty } from './faculty.interface';

// Define the TFacultyName schema
const FacultyNameSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
});

// Define the IFaculty schema
const facultySchema = new Schema<IFaculty>({
  id: { type: String, required: true, unique: true },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User',
  },
  name: { type: FacultyNameSchema, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  dateOfBirth: { type: String, required: true }, // Consider changing to Date type if storing actual Date objects
  email: { type: String, required: true },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
    required: true,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
    required: true,
  },
  designation: { type: String, required: true },
  profileImg: { type: String, required: false },
  isDeleted: { type: Boolean, required: true, default: false },
});

export const Faculty = model('faculty', facultySchema);
