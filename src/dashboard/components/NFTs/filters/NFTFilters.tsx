import styled from 'styled-components';

import { ISelected, IDropdownOption } from 'dashboard/components/NFTs/filters/types';
import { filters } from 'dashboard/components/NFTs/filters/constants/filters';
import { Dropdown } from 'dashboard/components/NFTs/filters/Dropdown';
import { Checkboxes } from 'dashboard/components/NFTs/filters/Checkboxes';

export interface IProps {
  selected: ISelected;
  handleSelected: (arg0?: any) => void;
}

export const NFTFilters = ({ selected, handleSelected }: IProps) => {
  return (
    <NFTFilters.Wrapper>
      {filters.map(({ trait, values, type }) =>
        type === 'dropdown' ? (
          <Dropdown
            key={`NFTFilters-${trait}`}
            values={values as IDropdownOption[]}
            handleSelected={handleSelected}
            trait={trait}
            filters={selected?.get(trait)}
          />
        ) : (
          <Checkboxes
            key={`NFTFilters-${trait}`}
            values={values}
            handleSelected={handleSelected}
            trait={trait}
            filters={selected?.get(trait)}
          />
        ),
      )}
    </NFTFilters.Wrapper>
  );
};

NFTFilters.Wrapper = styled.div`
  display: grid;
  grid-auto-rows: min-content;
  overflow-y: auto;
  height: 100%;
`;
