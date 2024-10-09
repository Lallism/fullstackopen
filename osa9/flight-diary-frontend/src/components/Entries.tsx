import { DiaryEntry } from '../types';

interface EntriesProps {
  entries: DiaryEntry[];
}

const Entries = (props: EntriesProps) => {
  return (
    <div>
      <h2>Diary entries</h2>
      {props.entries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          visibility: {entry.visibility} <br />
          weather: {entry.weather} <br />
        </div>
      ))}
    </div>
  );
};

export default Entries;
