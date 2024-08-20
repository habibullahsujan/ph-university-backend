import { z } from 'zod';
import { semesterRegistrationStatus } from './semesterRegistration.constants';
const createSemesterRegistration = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z.enum([...(semesterRegistrationStatus as [string, ...string[]])]),
    startDate: z.string(),
    endDate: z.string(),
    minCredit: z.number(),
    maxCredit: z.number(),
  }),
});

export const SemesterRegistrationValidationSchema = {
  createSemesterRegistration,
};
