import { z } from 'zod';

const academicDepartmentCreateValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic department name is required',
    }),
    academicFaculty:z.string({required_error:'Academic faculty is required'})
  }),
});
const academicDepartmentUpdateValidation = z.object({
  body: z.object({
    name: z
      .string()
      .optional(),
  }),
  academicFaculty:z.string().optional()
});

export const AcademicDepartmentValidation = {
    academicDepartmentCreateValidation,
    academicDepartmentUpdateValidation

};
