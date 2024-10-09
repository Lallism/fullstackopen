import { useState } from 'react';
import { NewDiaryEntry } from '../types';

export interface EntryFormProps {
  addEntry: (entry: NewDiaryEntry) => void;
}

const EntryForm = (props: EntryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry = { date, visibility, weather, comment };

    props.addEntry(newEntry);

    setDate('');
    setComment('');
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <form>
        <div>
          <label htmlFor="date">date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          visibility
          <input
            type="radio"
            name="visibility"
            id="great"
            onChange={() => setVisibility('great')}
          />
          <label htmlFor="great">great</label>
          <input
            type="radio"
            name="visibility"
            id="good"
            onChange={() => setVisibility('good')}
          />
          <label htmlFor="good">good</label>
          <input
            type="radio"
            name="visibility"
            id="ok"
            onChange={() => setVisibility('ok')}
          />
          <label htmlFor="ok">ok</label>
          <input
            type="radio"
            name="visibility"
            id="poor"
            onChange={() => setVisibility('poor')}
          />
          <label htmlFor="poor">poor</label>
        </div>
        <div>
          weather
          <input
            type="radio"
            name="weather"
            id="sunny"
            onChange={() => setWeather('sunny')}
          />
          <label htmlFor="sunny">sunny</label>
          <input
            type="radio"
            name="weather"
            id="rainy"
            onChange={() => setWeather('rainy')}
          />
          <label htmlFor="rainy">rainy</label>
          <input
            type="radio"
            name="weather"
            id="cloudy"
            onChange={() => setWeather('cloudy')}
          />
          <label htmlFor="cloudy">cloudy</label>
          <input
            type="radio"
            name="weather"
            id="stormy"
            onChange={() => setWeather('stormy')}
          />
          <label htmlFor="stormy">stormy</label>
          <input
            type="radio"
            name="weather"
            id="windy"
            onChange={() => setWeather('windy')}
          />
          <label htmlFor="windy">windy</label>
        </div>
        <div>
          <label htmlFor="comment">comment</label>
          <input
            type="text"
            id="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button onClick={handleSubmit}>add</button>
      </form>
    </div>
  );
};

export default EntryForm;
