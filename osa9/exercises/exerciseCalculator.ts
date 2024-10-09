interface Exercise {
  target: number;
  days: number[];
}

interface ExerciseResults {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
}

const parseArgsExercise = (args: string[]): Exercise => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const days = args.splice(3).map((hours) => Number(hours));

  if (isNaN(Number(args[2]))) {
    throw new Error('Provided values were not numbers!');
  }

  days.forEach((hours) => {
    if (isNaN(hours)) {
      throw new Error('Provided values were not numbers!');
    }
  });

  return { target: Number(args[2]), days };
};

const calculateRating = (average: number, target: number): number => {
  if (average < target * 0.75) {
    return 1;
  }
  if (average < target * 1.25) {
    return 2;
  }
  return 3;
};

const calculateRatingDescription = (rating: number): string => {
  switch (rating) {
    case 1:
      return 'maybe next time';

    case 2:
      return 'decent';

    case 3:
      return 'good job';

    default:
      return 'invalid rating (1-3)';
  }
};

const calculateExercises = (
  dailyExercises: number[],
  target: number
): ExerciseResults => {
  const periodLength: number = dailyExercises.length;
  const trainingDays: number = dailyExercises.filter(
    (hours) => hours > 0
  ).length;
  const average: number =
    dailyExercises.reduce((total, hours) => total + hours) /
    dailyExercises.length;
  const success: boolean = average >= target;
  const rating: number = calculateRating(average, target);
  const ratingDescription: string = calculateRatingDescription(rating);
  const results: ExerciseResults = {
    periodLength,
    trainingDays,
    target,
    average,
    success,
    rating,
    ratingDescription
  };
  return results;
};

if (require.main === module) {
  try {
    const { target, days } = parseArgsExercise(process.argv);
    console.log(calculateExercises(days, target));
  } catch (error) {
    let errorMessage = 'Something bad happened';
    if (error instanceof Error) {
      errorMessage += 'Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

export default calculateExercises;
