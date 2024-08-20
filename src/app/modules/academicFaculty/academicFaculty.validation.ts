import { z } from 'zod';

const academicFacultyCreateValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic faculty name is required',
    }),
  }),
});
const academicFacultyUpdateValidation = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Academic faculty name is required',
      })
      .optional(),
  }),
});

export const AcademicFacultyValidation = {
  academicFacultyCreateValidation,
  academicFacultyUpdateValidation,
};
