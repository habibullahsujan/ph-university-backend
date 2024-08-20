import { IFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';

const getAllFacultiesIntoDB = async () => {
  const res = await Faculty.find({})
    .populate('userId')
    .populate('academicDepartment')
    .populate('academicFaculty');
  return res;
};

const getSingleFacultyIntoDB = async (id: string) => {
  const res = await Faculty.findById(id)
    .populate('userId')
    .populate('academicDepartment')
    .populate('academicFaculty');
  return res;
};

const updateAFacultyToDB = async (id: string, payload: Partial<IFaculty>) => {
  const res = await Faculty.findByIdAndUpdate(id, payload);
  return res;
};

const deleteAFacultyToDB = async (id: string) => {
  const res = await Faculty.findByIdAndDelete(id);
  return res;
};

export const facultyServices = {
  getAllFacultiesIntoDB,
  getSingleFacultyIntoDB,
  updateAFacultyToDB,
  deleteAFacultyToDB,
};
