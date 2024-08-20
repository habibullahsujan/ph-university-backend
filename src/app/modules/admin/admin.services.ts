import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";


const getAllAdminsIntoDB = async () => {
  const res = await Admin.find({})
    .populate('userId')
  return res;
};

const getSingleAdminIntoDB = async (id: string) => {
  const res = await Admin.findById(id)
    .populate('userId')
  return res;
};

const updateAAdminToDB = async (id: string, payload: Partial<IAdmin>) => {
  const res = await Admin.findByIdAndUpdate(id, payload);
  return res;
};

const deleteAdminToDB = async (id: string) => {
  const res = await Admin.findByIdAndDelete(id);
  return res;
};

export const adminServices = {
  getAllAdminsIntoDB,
  getSingleAdminIntoDB,
  updateAAdminToDB,
  deleteAdminToDB
};
