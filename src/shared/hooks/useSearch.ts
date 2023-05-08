import { useEffect, useState, useCallback, useRef } from 'react';
import get from 'lodash.get';
import debounce from 'lodash.debounce';

export const useSearch = ({ data, attribute, query }) => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const searchChangeCallback = useCallback(value => {
    setSearchQuery(value);
  }, []);

  const searchChange = useRef(
    debounce(searchQuery => searchChangeCallback(searchQuery), 500),
  ).current;

  useEffect(() => {
    searchChange(query);
  }, [query]);

  return query?.length
    ? data.filter(item =>
        `${get(item, attribute)}`?.toLowerCase()?.includes(`${searchQuery}`.toLowerCase()),
      )
    : data;
};
