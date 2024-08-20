import { IAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";


const createAcademicDepartmentIntoDB = async (payload: IAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};
const getSingleAcademicDepartment = async (id:string) => {
  const result = await AcademicDepartment.findById(id).populate('academicFaculty');
  return result;
};
const getAllAcademicDepartment = async () => {
  
  const result = await AcademicDepartment.find({}).populate('academicFaculty');
  return result;
};
const updateAcademicDepartment = async (id:string,payload: IAcademicDepartment) => {
  const result = await AcademicDepartment.findByIdAndUpdate(id, payload,{new:true});
  return result;
};

const deleteAcademicDepartment = async(id:string)=>{
  const result = await AcademicDepartment.findByIdAndDelete(id);
  return result;
}
export const academicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getSingleAcademicDepartment,
    getAllAcademicDepartment,
    updateAcademicDepartment,
    deleteAcademicDepartment
}
