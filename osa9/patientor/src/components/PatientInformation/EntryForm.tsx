import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import patientService from '../../services/patients';
import { Diagnosis, Entry } from '../../types';
import { AxiosError } from 'axios';

interface Props {
  patientId: string;
  addEntry: (entry: Entry) => void;
  diagnoses: Diagnosis[];
}

const EntryForm = ({ patientId, addEntry, diagnoses }: Props) => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [type, setType] = useState('HealthCheck');
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickleaveStart, setSickleaveStart] = useState('');
  const [sickleaveEnd, setSickleaveEnd] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNotification('');
    setOpen(false);
  };

  const handleReset = () => {
    setNotification('');
    setDescription('');
    setDate('');
    setSpecialist('');
    setDiagnosisCodes([]);
    setHealthCheckRating('');
    setDischargeDate('');
    setDischargeCriteria('');
    setEmployerName('');
    setSickleaveStart('');
    setSickleaveEnd('');
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const newEntry = {
        description,
        date,
        specialist,
        diagnosisCodes
      };
      if (type === 'HealthCheck') {
        const returnedEntry = await patientService.createEntry(patientId, {
          type,
          healthCheckRating: Number(healthCheckRating),
          ...newEntry
        });
        addEntry(returnedEntry);
      } else if (type === 'Hospital') {
        const returnedEntry = await patientService.createEntry(patientId, {
          type,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          },
          ...newEntry
        });
        addEntry(returnedEntry);
      } else if (type === 'OccupationalHealthcare') {
        const sickLeave =
          sickleaveStart.length > 0 || sickleaveEnd.length > 0
            ? {
                startDate: sickleaveStart,
                endDate: sickleaveEnd
              }
            : undefined;
        const returnedEntry = await patientService.createEntry(patientId, {
          type,
          employerName,
          sickLeave,
          ...newEntry
        });
        addEntry(returnedEntry);
      }
      handleReset();
      handleClose();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        let errorMessage = '';
        if (data.description) {
          errorMessage += data.description._errors[0] + '; ';
        }
        if (data.date) {
          errorMessage += data.date._errors[0] + '; ';
        }
        if (data.specialist) {
          errorMessage += data.specialist._errors[0] + '; ';
        }
        if (type === 'HealthCheck' && data.healthCheckRating) {
          errorMessage += data.healthCheckRating._errors[0] + '; ';
        }
        if (type === 'Hospital' && data.discharge.criteria) {
          errorMessage += data.discharge.criteria._errors[0] + '; ';
        }
        if (type === 'Hospital' && data.discharge.date) {
          errorMessage += data.discharge.date._errors[0] + '; ';
        }
        if (type === 'OccupationalHealthcare' && data.employerName) {
          errorMessage += data.employerName._errors[0] + '; ';
        }
        if (type === 'OccupationalHealthcare' && data.sickLeave) {
          if (data.sickLeave.startDate) {
            errorMessage += data.sickLeave.startDate._errors[0] + '; ';
          }
          if (data.sickLeave.endDate) {
            errorMessage += data.sickLeave.endDate._errors[0] + '; ';
          }
        }
        setNotification(errorMessage);
      }
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Add new entry
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New healthcheck entry</DialogTitle>
        {notification.length > 0 && (
          <Alert severity="error">{notification}</Alert>
        )}
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
            <TextField
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="dense"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
            <TextField
              label="Specialist"
              fullWidth
              margin="dense"
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
            <InputLabel sx={{ mt: 1 }}>Diagnosis codes</InputLabel>
            <Select
              sx={{ minWidth: 120, maxWidth: 240 }}
              multiple
              value={diagnosisCodes}
              onChange={({ target }) =>
                setDiagnosisCodes(
                  typeof target.value === 'string'
                    ? target.value.split(', ')
                    : target.value
                )
              }
            >
              {diagnoses.map((diagnosis) => (
                <MenuItem key={diagnosis.code} value={diagnosis.code}>
                  {diagnosis.code}
                </MenuItem>
              ))}
            </Select>
            <InputLabel sx={{ mt: 1 }}>Type</InputLabel>
            <Select
              sx={{ minWidth: 240 }}
              value={type}
              onChange={({ target }) => setType(target.value)}
            >
              <MenuItem value="HealthCheck">Healthcheck</MenuItem>
              <MenuItem value="Hospital">Hospital</MenuItem>
              <MenuItem value="OccupationalHealthcare">
                Occupational healthcare
              </MenuItem>
            </Select>
            {type === 'HealthCheck' && (
              <TextField
                label="Healthcheck rating"
                fullWidth
                margin="dense"
                value={healthCheckRating}
                onChange={({ target }) => setHealthCheckRating(target.value)}
              />
            )}
            {type === 'Hospital' && (
              <>
                <InputLabel sx={{ mt: 1 }}>Discharge</InputLabel>
                <TextField
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="dense"
                  value={dischargeDate}
                  onChange={({ target }) => setDischargeDate(target.value)}
                />
                <TextField
                  label="Criteria"
                  fullWidth
                  margin="dense"
                  value={dischargeCriteria}
                  onChange={({ target }) => setDischargeCriteria(target.value)}
                />
              </>
            )}
            {type === 'OccupationalHealthcare' && (
              <>
                <TextField
                  label="Employer"
                  fullWidth
                  margin="dense"
                  value={employerName}
                  onChange={({ target }) => setEmployerName(target.value)}
                />
                <InputLabel>Sickleave</InputLabel>
                <TextField
                  label="Start date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="dense"
                  value={sickleaveStart}
                  onChange={({ target }) => setSickleaveStart(target.value)}
                />
                <TextField
                  label="End date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="dense"
                  value={sickleaveEnd}
                  onChange={({ target }) => setSickleaveEnd(target.value)}
                />
              </>
            )}
            <Button variant="contained" type="submit" sx={{ mt: 1 }}>
              Submit
            </Button>
            <Button
              variant="outlined"
              sx={{ mt: 1, ml: 1 }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EntryForm;
