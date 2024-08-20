import { Types } from 'mongoose';

type TAdminName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export interface IAdmin {
  id: string;
  userId: Types.ObjectId;
  name: TAdminName;
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  managementDepartment:string;
  designation: string;
  profileImg?: string;
  isDeleted: boolean;
}
