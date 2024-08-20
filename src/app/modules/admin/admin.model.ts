import { Schema, model, Types } from 'mongoose';

// Define the TAdminName schema
const adminNameSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
});

// Define the IAdmin schema
const adminSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  name: { type: adminNameSchema, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  dateOfBirth: { type: String, required: true }, // Consider changing to Date type if storing actual Date objects
  email: { type: String, required: true, unique: true },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  managementDepartment: { type: String, required: true },
  designation: { type: String, required: true },
  profileImg: { type: String, required: false },
  isDeleted: { type: Boolean, required: true, default: false },
});

// Create the model
export const Admin = model('Admin', adminSchema);
