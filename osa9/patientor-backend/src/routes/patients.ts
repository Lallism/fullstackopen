import express, { NextFunction, Request, Response } from 'express';
import z from 'zod';
import patientService from '../services/patientService';
import {
  Patient,
  NewPatient,
  NonSensitivePatient,
  Entry,
  NewEntry
} from '../types';
import { newEntrySchema, newPatientSchema } from '../utils';

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send(error.format());
  } else {
    next(error);
  }
};

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getPatients());
});

router.get('/:id', (req: Request<{ id: string }>, res: Response<Patient>) => {
  res.send(patientService.getPatientById(req.params.id));
});

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.send(addedPatient);
  }
);

router.post(
  '/:id/entries',
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
    const addedEntry = patientService.addEntry(req.params.id, req.body);
    res.send(addedEntry);
  }
);

router.use(errorMiddleware);

export default router;
