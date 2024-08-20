import { z } from 'zod';
import { AcademicSemesterCode, AcademicSemesterName, Months } from './academicSemester.constants';


// Define the IAcademicSemester validation schema
const academicSemesterValidationSchema = z.object({
 body:z.object({
  name: z.enum([...AcademicSemesterName] as [string,...string[]], {
    required_error: 'Name is required',
  }),
  code: z.enum([...AcademicSemesterCode] as [string,...string[]], { required_error: 'Code is required' }),
  year: z.string({ required_error: 'Year is required' }),
  startMonth: z.enum([...Months]as [string,...string[]], { required_error: 'Start month is required' }),
  endMonth: z.enum([...Months]as [string,...string[]], { required_error: 'End month is required' }),
 })
});

// Define the IAcademicSemester validation schema
const academicSemesterUpdateValidationSchema = z.object({
 body:z.object({
  name: z.enum([...AcademicSemesterName] as [string,...string[]]).optional(),
  code: z.enum([...AcademicSemesterCode] as [string,...string[]]).optional(),
  year: z.string({ required_error: 'Year is required' }).optional(),
  startMonth: z.enum([...Months]as [string,...string[]]).optional(),
  endMonth: z.enum([...Months]as [string,...string[]]).optional(),
 })
});

export const academicSemesterValidation = {
  academicSemesterValidationSchema,
  academicSemesterUpdateValidationSchema
};
