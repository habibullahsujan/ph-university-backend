import { z } from 'zod';

// Define the IFaculty schema
const FacultyNameSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: 'Last name is required' }),
});

const facultyCreateValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    faculty: z.object({
      name: FacultyNameSchema,
      gender: z.enum(['male', 'female']),
      dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }), // You might want to add a regex pattern to validate the date format
      email: z.string().email({ message: 'Invalid email address' }),
      contactNo: z.string().min(1, { message: 'Contact number is required' }), // You might want to add a regex pattern to validate the contact number format
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency contact number is required' }), // Same as contactNo, consider adding validation
      presentAddress: z
        .string()
        .min(1, { message: 'Present address is required' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address is required' }),
      designation: z.string().min(1, { message: 'Designation is required' }),
      profileImg: z.string().optional(),
      isDeleted: z.boolean(),
    }),
  }),
});

const facultyNameUpdateValidationSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

const facultyUpdateValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    faculty: z.object({
      name: facultyNameUpdateValidationSchema,
      gender: z.enum(['male', 'female']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      designation: z.string().optional(),
      profileImg: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const facultyValidations = {
  facultyCreateValidationSchema,
  facultyUpdateValidationSchema
};
