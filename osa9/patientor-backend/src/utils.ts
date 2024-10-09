import { Gender, HealthCheckRating } from './types';
import z from 'zod';

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string()
});

const newBaseEntrySchema = z.object({
  description: z.string().min(1, 'Description required'),
  date: z.string().date(),
  specialist: z.string().min(1, 'Specialist required'),
  diagnosisCodes: z.string().array().optional()
});

const newHealthCheckEntrySchema = newBaseEntrySchema.extend({
  healthCheckRating: z.nativeEnum(HealthCheckRating, {
    errorMap: (issue, ctx) => {
      switch (issue.code) {
        case 'invalid_enum_value':
          return { message: 'Invalid healthcheck rating (0-3)' };
        case 'invalid_type':
          return { message: 'Invalid healthcheck rating (0-3)' };
        default:
          return { message: ctx.defaultError };
      }
    }
  }),
  type: z.literal('HealthCheck')
});

const newHospitalEntrySchema = newBaseEntrySchema.extend({
  discharge: z.object({
    date: z.string().date('Invalid discharge date'),
    criteria: z.string().min(1, 'Criteria required')
  }),
  type: z.literal('Hospital')
});

const newOccupationalHealthcareEntrySchema = newBaseEntrySchema.extend({
  employerName: z.string().min(1, 'Employer name required'),
  sickLeave: z
    .object({
      startDate: z.string().date('Invalid sickleave start date'),
      endDate: z.string().date('Invalid sickleave end date')
    })
    .optional(),
  type: z.literal('OccupationalHealthcare')
});

export const newEntrySchema = z.union([
  newHealthCheckEntrySchema,
  newHospitalEntrySchema,
  newOccupationalHealthcareEntrySchema
]);
