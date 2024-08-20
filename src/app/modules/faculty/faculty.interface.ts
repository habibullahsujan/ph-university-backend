import { Types } from 'mongoose';

type TFacultyName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export interface IFaculty {
  id: string;
  userId: Types.ObjectId;
  name: TFacultyName;
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  designation: string;
  profileImg?: string;
  isDeleted: boolean;
}
