import { useState, useEffect } from 'react';

// Works like useState, but the value is also saved in localStorage under `key`,
// so it survives a page refresh. `initialValue` is used when nothing is saved
// yet, or when the saved value cannot be read.
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  // save whenever the value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked (e.g. some private windows): keep working in memory
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
