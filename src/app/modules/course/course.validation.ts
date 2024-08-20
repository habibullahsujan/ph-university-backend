import { z } from 'zod';

const preRequisiteCoursesSchema = z.object({
  course: z.string().optional(),
  isDeleted: z.boolean().optional().default(false),
});

const courseCreateValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required.').trim(),
    prefix: z.string().optional(),
    code: z.number().min(1, 'Code is required.'),
    credits: z.number().min(1, 'Credits is required.'),
    isDeleted: z.boolean().optional(),
    preRequisiteCourses: z.array(preRequisiteCoursesSchema).optional(),
  }),
});

const preRequisiteCoursesUpdateSchema = z.object({
  course: z.string().optional(),
  isDeleted: z.boolean().optional().default(false),
});

const courseUpdateValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required.').trim().optional(),
    prefix: z.string().optional(),
    code: z.number().min(1, 'Code is required.').optional(),
    credits: z.number().min(1, 'Credits is required.').optional(),
    isDeleted: z.boolean().optional(),
    preRequisiteCourses: z.array(preRequisiteCoursesUpdateSchema).optional(),
  }),
});

const facultiesValidationSchema = z.object({
  body: z.object({
    course: z.string().optional(),
    faculties: z.array(z.string()),
  }),
});

export const CourseValidations = {
  courseCreateValidationSchema,
  courseUpdateValidationSchema,
  facultiesValidationSchema
};
