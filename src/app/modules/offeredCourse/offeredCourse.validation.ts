import { z } from 'zod';

const timeValidationSchema=z.string().refine(
  (time) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  },
  {
    message: "The Start time format is not correct is will be 'HH':'MM'",
  },
)
const offeredCourseCreateValidation = z.object({
  body: z
    .object({
      academicDepartment: z.string(),
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum(['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'])),
      startTime:timeValidationSchema,
      endTime:timeValidationSchema
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return start < end;
      },
      { message: 'End time should be greater than Start time!' },
    ),
});

const offeredCourseUpdateValidation = z.object({
  body: z.object({
    faculty: z.string(),
    maxCapacity: z.number(),
    days: z
      .array(z.enum(['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']))
      ,
    startTime: timeValidationSchema,
    endTime: timeValidationSchema,
  }).refine(
    (body) => {
      const start = new Date(`1970-01-01T${body.startTime}:00`);
      const end = new Date(`1970-01-01T${body.endTime}:00`);
      return start < end;
    },
    { message: 'End time should be greater than Start time!' },
  ),
});

export const OfferedCourseValidations = {
  offeredCourseCreateValidation,
  offeredCourseUpdateValidation,
};
