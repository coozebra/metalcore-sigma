import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import ScrollContainer from 'react-indiana-drag-scroll';
import Image from 'next/image';

import { useAPIAssets } from 'dashboard/hooks/useAPIAssets';
import { NFTCard, PlaceholderCard } from 'dashboard/components/NFTs/NFTCard';
import { NFTFilters } from 'dashboard/components/NFTs/filters/NFTFilters';
import { useFilters } from 'dashboard/components/NFTs/filters/hooks/useFilters';
import { useSearch } from 'shared/hooks/useSearch';
import { INFT } from 'dashboard/types/NFT';
import { EagerLoadList } from 'shared/components/EagerLoadList';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';
import { Loader } from 'shared/components/Loader';
import { Button } from 'shared/components/Button';
import { Text, H2, H3 } from 'shared/text';

export const NFTsGallery = ({ NFTs }: { NFTs: INFT[] }) => {
  const [list, setList] = useState<INFT[]>([]);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

  const storage = useLocalStorage('transferingNFTs');

  const toggleFilters = () => setFiltersOpen(!filtersOpen);

  const { data: NFTList, isLoading } = useAPIAssets({
    fallbackData: NFTs,
  });

  const handleTransfer = (NFT: INFT) => {
    const storageList = storage?.value ?? [];
    const list = NFTList.filter(APINFT => APINFT.id !== NFT.id);

    setList([NFT, ...list]);
    storage?.update([NFT, ...storageList]);
  };

  useEffect(() => {
    if (storage?.value?.length) {
      const updatedTransfering = storage.value.filter(NFT => {
        const APINFT = NFTList.find(({ id }) => id === NFT.id);
        return !APINFT || APINFT?.attributes.status !== NFT.transferingDirection;
      });

      const list = NFTList.filter(NFT => !updatedTransfering.find(({ id }) => id === NFT.id));

      setList([...updatedTransfering, ...list]);
      storage?.update(updatedTransfering);
    } else if (NFTList.length) {
      setList(NFTList);
    }
  }, [NFTList]);

  const {
    data: filteredData,
    selected,
    handleSelected,
    handleRemove,
    clear: clearFilters,
  } = useFilters({ NFTs: list });

  const data = useSearch({ data: filteredData, attribute: 'attributes.name', query });

  const resetFilters = () => {
    clearFilters();
    setQuery('');
  };

  return (
    <NFTsGallery.Wrapper>
      <NFTsGallery.NFTFilters $open={filtersOpen}>
        <NFTsGallery.NFTFiltersBackground />
        <NFTsGallery.FiltersTitle>
          <H3>Filters</H3>
          <NFTsGallery.Button ghost onClick={toggleFilters}>
            <Image alt="" width="22" height="20" src="/icons/filter.svg" />
          </NFTsGallery.Button>
        </NFTsGallery.FiltersTitle>
        <NFTsGallery.NFTFiltersWrapper>
          <NFTFilters selected={selected} handleSelected={handleSelected} />
        </NFTsGallery.NFTFiltersWrapper>
      </NFTsGallery.NFTFilters>
      <NFTsGallery.SearchFiltersWrapper>
        <NFTsGallery.SearchWrapper $filtersOpen={filtersOpen}>
          {!filtersOpen && (
            <NFTsGallery.FiltersButton ghost onClick={toggleFilters}>
              <Image alt="" width="22" height="20" src="/icons/filter.svg" />
            </NFTsGallery.FiltersButton>
          )}
          <NFTsGallery.Search $isSearching={isSearching}>
            <label htmlFor="search">
              <Image alt="" src="/icons/search-dark.svg" width="20" height="20" />
            </label>
            <input
              onFocus={() => setIsSearching(true)}
              onBlur={() => setIsSearching(false)}
              id="search"
              onChange={({ target: { value } }) => setQuery(value)}
              disabled={isLoading}
              value={query}
              placeholder="Search by name..."
            />
          </NFTsGallery.Search>
        </NFTsGallery.SearchWrapper>
        <NFTsGallery.Separator />
        <NFTsGallery.SelectedWrapper>
          {Boolean(query) && (
            <NFTsGallery.Query>
              <Text>{query}</Text>
            </NFTsGallery.Query>
          )}
          <NFTsGallery.Selected hideScrollbars>
            {selected &&
              Array.from(selected.entries()).map(([trait, value]) =>
                Array.from(value).map(value =>
                  typeof value === 'string' ? (
                    <NFTsGallery.RemoveFilter
                      key={`${trait}-${JSON.stringify(value)}-NFTsGallery.RemoveFilter`}
                      primary
                      onClick={() => handleRemove({ trait, value })}
                    >
                      {value} <Image alt="" width="24" height="24" src="icons/close-dark.svg" />
                    </NFTsGallery.RemoveFilter>
                  ) : null,
                ),
              )}
          </NFTsGallery.Selected>
          {Boolean(selected?.size || query) && (
            <NFTsGallery.ResetFilters ghost onClick={resetFilters}>
              Clear All
            </NFTsGallery.ResetFilters>
          )}
        </NFTsGallery.SelectedWrapper>
      </NFTsGallery.SearchFiltersWrapper>
      {isLoading && (
        <NFTsGallery.Loader>
          <Loader />
        </NFTsGallery.Loader>
      )}
      {Boolean(!isLoading && !data?.length) && (
        <NFTsGallery.EmptyState>
          <Text>No NFTs to display</Text>
        </NFTsGallery.EmptyState>
      )}
      {Boolean(!isLoading && data?.length) && (
        <NFTsGallery.List>
          <>
            {/* TODO: replace EagerLoadList with https://www.npmjs.com/package/react-virtualized [currently does not work properly on react 17] */}
            {/* might be interesting to consider pagination if thumbnails are not provided */}
            <EagerLoadList visibleItems={9}>
              {data?.map(NFT => (
                <NFTCard
                  handleTransfer={handleTransfer}
                  key={`locked-nft-${NFT.tokenId}-${NFT?.transferingDirection}-${NFT?.attributes.status}`}
                  NFT={NFT}
                />
              ))}
              <PlaceholderCard />
            </EagerLoadList>
          </>
        </NFTsGallery.List>
      )}
    </NFTsGallery.Wrapper>
  );
};

NFTsGallery.Wrapper = styled.div`
  display: grid;
  max-width: 2560px;
  align-content: center;
  justify-content: center;
  width: 100%;
  padding: 24px 4px 0 0;
  grid-column-gap: 24px;
  height: 100%;
  grid-template-columns: min-content 1fr;
  grid-template-rows: 146px 1fr;
`;

NFTsGallery.SearchFiltersWrapper = styled.div`
  display: grid;
  grid-template-rows: 54px 3px 48px;
  width: 100%;
  gap: 16px;
  max-width: 1368px;
  justify-self: center;
`;

NFTsGallery.SearchWrapper = styled.div<{ $filtersOpen }>`
  display: grid;
  grid-template-columns: 54px 360px;
  gap: 16px;

  ${({ $filtersOpen }) =>
    $filtersOpen &&
    css`
      grid-template-columns: 360px;
    `}
`;

NFTsGallery.Search = styled.div<{ $isSearching: boolean }>`
  background: #f5f9fd;
  width: 360px;
  display: grid;
  grid-gap: 16px;
  padding: 14px 22px;
  grid-template-columns: 20px 1fr;
  align-items: center;
  height: 54px;
  border-radius: 4px;

  ${({ $isSearching, theme }) =>
    $isSearching &&
    css`
      box-shadow: 0 0 0 1px ${theme.colors.green};
    `}

  label {
    height: 20px;
    width: 20px;
  }

  input {
    background: #f5f9fd;
    outline: none;
    border: none;
    font-family: 'Rajdhani';
    font-weight: 700;
    font-size: 20px;
    color: ${({ theme }) => theme.colors.black};

    &:placeholder {
      font-size: 20px;
      color: #9a9a9a;
    }
  }
`;

NFTsGallery.Separator = styled.div`
  width: 100%;
  background: #ffffff;
  height: 3px;
  border-radius: 3px;
`;

NFTsGallery.SelectedWrapper = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  align-items: center;
`;

NFTsGallery.Query = styled.div`
  max-width: 280px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-right: 3px solid ${({ theme }) => theme.colors.white};
  padding-right: 3px;

  ${Text} {
    font-family: 'Rajdhani';
    font-size: 20px;
    line-height: 26px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.white};
  }
`;

NFTsGallery.Selected = styled(ScrollContainer)`
  cursor: pointer;
  display: grid;
  max-width: 636px;
  grid-auto-flow: column;
  overflow-y: auto;
  grid-auto-columns: min-content;
  gap: 24px;
`;

NFTsGallery.ResetFilters = styled(Button)`
  border: none;
  padding: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
  font-family: 'Rajdhani';
  letter-spacing: 0.085em;
  width: 84px;
`;

NFTsGallery.RemoveFilter = styled(Button)`
  display: grid;
  grid-template-columns: max-content 24px;
  gap: 8px;
  padding: 12px;
  font-family: 'Rajdhani';
  height: 48px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.black};
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: none;
`;

NFTsGallery.FiltersButton = styled(Button)`
  width: 54px;
  height: 54px;
  border-radius: 4px;
  padding: 0;
  border: none;
  background: ${({ theme }) => theme.colors.darkGreen};

  :hover {
    background: ${({ theme }) => theme.colors.black};
  }
`;

NFTsGallery.NFTFiltersBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: ${({ theme }) => theme.colors.darkGreen};
  mix-blend-mode: overlay;
  width: 0;
  height: 100%;
  transition: width 35ms ease;
`;

NFTsGallery.NFTFilters = styled.div<{ $open: boolean }>`
  display: grid;
  position: relative;
  grid-template-rows: 30px 1fr;
  grid-gap: 22px;
  width: 0;
  height: 100%;
  overflow-y: auto;
  padding: 0;
  overflow-x: hidden;
  transition: width 35ms ease, padding 35ms ease;
  grid-row: 1 / span 2;
  grid-column: 1;

  ${({ $open }) =>
    $open &&
    css`
      width: 346px;
      padding: 36px 24px;
      padding-right: 0;

      ${NFTsGallery.NFTFiltersBackground} {
        width: 100%;
      }
    `}
`;

NFTsGallery.FiltersTitle = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px;
  height: 30px;
  padding-right: 24px;
  z-index: 2;

  ${H3} {
    line-height: 30px;
    font-size: 30px;
    text-transform: none;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.white};
  }
`;

NFTsGallery.Button = styled(Button)`
  margin: 0;
  padding: 0;
  border: none;
  height: 30px;
  cursor: pointer;
`;

NFTsGallery.NFTFiltersWrapper = styled.div`
  overflow-y: auto;
  z-index: 1;
`;

NFTsGallery.Title = styled(H2)`
  color: #ffffff;
  text-transform: none;
  font-size: 40px;
  font-weight: 700;
  text-align: center;
`;

NFTsGallery.Loader = styled.div`
  display: grid;
  align-content: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

NFTsGallery.EmptyState = styled(NFTsGallery.Loader)`
  ${Text} {
    text-transform: none;
    color: ${({ theme }) => theme.colors.green};
  }
`;

NFTsGallery.List = styled.div`
  overflow-y: scroll;
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 1368px;
  max-height: 1600px;
  margin: 0 auto;
  grid-row: 2;
  grid-column: 2;
`;
