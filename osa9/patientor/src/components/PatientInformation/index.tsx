import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import patientService from '../../services/patients';
import { useEffect, useState } from 'react';
import { Diagnosis, Entry, Patient } from '../../types';
import PatientEntry from './PatientEntry';
import EntryForm from './EntryForm';

interface Props {
  diagnoses: Diagnosis[];
}

const PatientInformation = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const [entries, setEntries] = useState<Entry[]>();

  const { id } = useParams() as { id: string };

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getById(id);
      setPatient(patient);
      setEntries(patient.entries);
    };
    fetchPatient();
  }, [id]);

  const addEntry = (entry: Entry) => {
    setEntries(entries?.concat(entry));
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
        {patient?.name}
      </Typography>
      <Typography>Gender: {patient?.gender}</Typography>
      <Typography>Ssn: {patient?.ssn}</Typography>
      <Typography>Occupation: {patient?.occupation}</Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        Entries
      </Typography>
      <EntryForm patientId={id} addEntry={addEntry} diagnoses={diagnoses} />
      {entries?.map((entry) => (
        <PatientEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientInformation;
