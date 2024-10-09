import { v1 as uuid } from 'uuid';
import patientData from '../data/patients-full';
import { NonSensitivePatient, NewPatient, Patient, NewEntry } from '../types';
import { newPatientSchema } from '../utils';

const patients: Patient[] = patientData.map((patient) => {
  const newPatient = newPatientSchema.parse(patient) as Patient;
  newPatient.id = patient.id;
  newPatient.entries = patient.entries;
  return newPatient;
});

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatientById = (id: string): Patient => {
  const patient = patients.find((patient) => patient.id === id);
  if (patient) {
    return patient;
  }
  throw new Error('Patient not found');
};

const addPatient = (patient: NewPatient) => {
  const newPatient = { id: uuid(), entries: [], ...patient };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry) => {
  const newEntry = { id: uuid(), ...entry };
  patients.find((patient) => patient.id === id)?.entries.push(newEntry);
  return newEntry;
};

export default { getPatients, getPatientById, addPatient, addEntry };
