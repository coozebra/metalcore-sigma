import { useEffect, useState, useRef, useCallback } from 'react';
import useSWR from 'swr';
import debounce from 'lodash.debounce';

import { useWindowSize } from 'shared/hooks/useWindowSize';
import { ORDERING, IOrdering } from 'shared/enums/ordering';
import { IRanking } from 'leaderboard/types/Leaderboard';
import axios from 'axios';

interface IInitialOrdering {
  rank: IOrdering;
  points: IOrdering;
}

// API only has one ordering/sorting param, handled by `activeSort`
// this state allows us to handle visuals
const INITIAL_ORDERING: IInitialOrdering = {
  rank: ORDERING.ASC as IOrdering,
  points: ORDERING.DESC as IOrdering,
};

export interface IUseLeaderboard {
  data: Array<IRanking>;
  page: number;
  setPage: (page: number) => void;
  error: Error;
  isLoading: boolean;
  maxPages: number;
  ordering: IInitialOrdering;
  handleSort: (sortBy: string) => void;
  handleSearch: (value: string | undefined) => void;
  searchQuery?: string;
}

interface IProps {
  account?: string | null;
  initialData?: IRanking[];
}

const INITIAL_URL = '/api/v1/leaderboard?offset=0&limit=50&order=asc&sortBy=rank';

export const useLeaderboard = ({ account, initialData }: IProps): IUseLeaderboard => {
  const { isMobile } = useWindowSize();

  const [ordering, setOrdering] = useState<IInitialOrdering>(INITIAL_ORDERING);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [activeSort, setActiveSort] = useState<string>('rank');

  const limit = isMobile ? 10 : 50;
  const offset = (page - 1) * limit;
  const isSearching = !!search;

  const handleSort = (sortBy: string) => {
    const currentOrdering = ordering[sortBy];
    const newOrdering = currentOrdering === ORDERING.ASC ? ORDERING.DESC : ORDERING.ASC;

    setOrdering({ ...ordering, [sortBy]: newOrdering });
    setActiveSort(sortBy);
  };

  const searchChangeCallback = useCallback(value => {
    setSearch(value);
  }, []);

  const searchChange = useRef(
    debounce(searchQuery => searchChangeCallback(searchQuery), 500),
  ).current;

  const handleSearch = (value: string | undefined) => {
    setSearchQuery(value);
    searchChange(value);
  };

  const params =
    search || account
      ? `?search=${search?.toLowerCase()}`
      : `?offset=${offset}&limit=${limit}&order=${ordering[activeSort]}&sortBy=${activeSort}`;
  const url = `/api/v1/leaderboard${params}`;

  // TODO: replace with useSWRInfinite
  const response = useSWR(url, _url => axios.get(_url).then(res => res.data), {
    fallbackData: url === INITIAL_URL ? initialData : null,
  }) as { data: { data: Array<IRanking>; totalElements: number }; error: Error };

  const { data, error } = response;

  useEffect(() => {
    if (account) {
      setSearch(account);
    }
  }, [account]);

  useEffect(() => {
    setActiveSort('rank');
    setOrdering(INITIAL_ORDERING);
    setPage(1);
  }, [isMobile]);

  useEffect(() => {
    if (isSearching) {
      setPage(1);
    }
  }, [isSearching]);

  const maxPages = Math.ceil(data?.totalElements / limit) || 1;

  return {
    page,
    setPage,
    ordering,
    handleSort,
    searchQuery,
    handleSearch,
    error,
    data: data?.data,
    maxPages,
    isLoading: !data && !error,
  };
};
