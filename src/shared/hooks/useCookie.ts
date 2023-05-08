import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';

export function useCookie(key) {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    setValue(Cookie.get(key));
  }, []);

  const update = newValue => {
    Cookie.set(key, newValue);
    setValue(newValue);
  };

  const remove = () => {
    Cookie.remove(key);
    setValue(null);
  };

  return { value, update, remove };
}
