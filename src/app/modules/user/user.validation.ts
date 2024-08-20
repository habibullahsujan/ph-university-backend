import { z } from "zod";

const userValidationSchema = z.object({
    password: z.string().min(1, "Password is required").max(20,'Password should not exceeded 20 characters'),
  });

const userStatusUpdateValidationSchema=z.object({
  body: z.object({
    status: z.enum(['in-progress', 'blocked']),
  })
 });

  export  const UserValidation={
    userValidationSchema,
    userStatusUpdateValidationSchema
  }