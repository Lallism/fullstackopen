import { useEffect, useState } from 'react';
import { DiaryEntry, NewDiaryEntry } from './types';
import Entries from './components/Entries';
import EntryForm from './components/EntryForm';
import { createEntry, getAllEntries } from './services/entries';
import axios from 'axios';

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    getAllEntries().then((data) => setEntries(data));
  }, []);

  const addEntry = async (diaryEntry: NewDiaryEntry) => {
    try {
      const returnedEntry = await createEntry(diaryEntry);
      setEntries(entries.concat(returnedEntry));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setNotification(error.response?.data);
        setTimeout(() => setNotification(''), 5000);
      }
    }
  };

  return (
    <div>
      <EntryForm addEntry={addEntry} />
      {notification.length > 0 && (
        <p style={{ color: 'red' }}>{notification}</p>
      )}
      <Entries entries={entries} />
    </div>
  );
}

export default App;
