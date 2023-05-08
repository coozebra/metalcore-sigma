import { useState } from 'react';

function getStorageItem(key) {
  if (typeof window === 'undefined') return;
  const data = window.localStorage.getItem(key);
  return data && JSON.parse(data);
}

function setStorageItem(key, value) {
  if (typeof window === 'undefined') return;
  const data = JSON.stringify(value);
  window.localStorage.setItem(key, data);
}

function removeStorageItem(key) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}

export function useLocalStorage(key) {
  const [value, setValue] = useState(getStorageItem(key));

  const update = newValue => {
    setStorageItem(key, newValue);
    setValue(newValue);
  };

  const remove = () => {
    removeStorageItem(key);
    setValue(undefined);
  };

  return { value, update, remove };
}
