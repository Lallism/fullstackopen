import express from 'express';
import qs from 'qs';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();

app.use(express.json());

app.set('query parser', (str: string) => qs.parse(str));

app.get('/hello', (_req, res) => {
  res.send('Hello full stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: 'malformatted parameters' });
  }
  const bmi = calculateBmi(height, weight);
  res.send({ weight, height, bmi });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (daily_exercises === undefined || target === undefined) {
    res.status(400).send({ error: 'missing parameters' });
  }

  if (isNaN(Number(target)) || !Array.isArray(daily_exercises)) {
    res.status(400).send({ error: 'malformatted parameters' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  daily_exercises.forEach((hours: number) => {
    if (isNaN(hours)) {
      res.status(400).send({ error: 'malformatted parameters' });
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const thingy = calculateExercises(daily_exercises, target);
  res.send(thingy);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
