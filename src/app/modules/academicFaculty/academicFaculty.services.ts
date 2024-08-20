import { IAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: IAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};
const getSingleAcademicFaculty = async (id:string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};
const getAllAcademicFaculty = async () => {
  const result = await AcademicFaculty.find({});
  return result;
};
const updateAcademicFaculty = async (id:string,payload: IAcademicFaculty) => {
  const result = await AcademicFaculty.findByIdAndUpdate(id, payload);
  return result;
};

const deleteAcademicFaculty = async(id:string)=>{
  const result = await AcademicFaculty.findByIdAndDelete(id);
  return result;
}
export const academicFacultyServices = {
    createAcademicFacultyIntoDB,
    getSingleAcademicFaculty,
    getAllAcademicFaculty,
    updateAcademicFaculty,
    deleteAcademicFaculty
}
