import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Diagnosis, Entry, HealthCheckRating } from '../../types';
import {
  AssignmentTurnedIn,
  Favorite,
  LocalHospital,
  Work
} from '@mui/icons-material';

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const healthCheckRatingColor = (healthCheckRating: HealthCheckRating) => {
  switch (healthCheckRating) {
    case HealthCheckRating.Healthy:
      return 'green';
    case HealthCheckRating.LowRisk:
      return 'gold';
    case HealthCheckRating.HighRisk:
      return 'darkorange';
    case HealthCheckRating.CriticalRisk:
      return 'red';
    default:
      const _exhaustiveCheck: never = healthCheckRating;
      return _exhaustiveCheck;
  }
};

const PatientEntry = ({ entry, diagnoses }: Props) => {
  const entryDetails = () => {
    switch (entry.type) {
      case 'Hospital':
        return (
          <>
            <LocalHospital />
            <Typography>Discharge: {entry.discharge.date}</Typography>
            <Typography> Criteria: {entry.discharge.criteria}</Typography>
          </>
        );

      case 'OccupationalHealthcare':
        return (
          <>
            <Typography>
              <Work /> {entry.employerName}
            </Typography>
            {entry.sickLeave && (
              <Typography>
                Sick leave: {entry.sickLeave?.startDate} -{' '}
                {entry.sickLeave?.endDate}
              </Typography>
            )}
          </>
        );

      case 'HealthCheck':
        return (
          <>
            <AssignmentTurnedIn />
            <Favorite
              sx={{ color: healthCheckRatingColor(entry.healthCheckRating) }}
            />
          </>
        );

      default:
        const _exhaustiveCheck: never = entry;
        return _exhaustiveCheck;
    }
  };

  return (
    <Box sx={{ border: '1px solid gray', p: 1, mt: 1, borderRadius: 2 }}>
      <Typography>{entry.date}</Typography>
      <Typography>{entry.description}</Typography>
      {entryDetails()}
      <List>
        {entry.diagnosisCodes?.map((code) => {
          const diagnosis = diagnoses.find(
            (diagnosis) => diagnosis.code === code
          );
          return (
            <ListItem key={code}>
              <ListItemText>
                {code} {diagnosis?.name}
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
      <Typography>diagnosis by {entry.specialist}</Typography>
    </Box>
  );
};

export default PatientEntry;
