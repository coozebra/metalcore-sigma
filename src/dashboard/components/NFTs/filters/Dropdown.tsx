import { useState } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import isEqual from 'lodash.isequal';

import { IFilters, IDropdownOption } from 'dashboard/components/NFTs/filters/types';
import { Button } from 'shared/components/Button';
import { Text } from 'shared/text';

interface IProps {
  values: IDropdownOption[];
  handleSelected: (arg0?: any) => void;
  trait: string;
  filters?: IFilters;
}

export const Dropdown = ({ values, handleSelected, trait, filters }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const { label } =
    values.find(({ value }) => isEqual(new Set(value), new Set(filters))) ?? values[0];

  const handleClick = ({ trait, value }) => {
    toggleOpen();
    handleSelected({ trait, value, type: 'dropdown' });
  };

  return (
    <Dropdown.Wrapper $isOpen={isOpen}>
      <Dropdown.Button onClick={toggleOpen}>
        <Text>{label}</Text>
        <Image alt="" width="22" height="20" src="/icons/down-chevron.svg" />
      </Dropdown.Button>
      <Dropdown.Options $isOpen={isOpen}>
        {values.map(({ value, label: optionLabel }) =>
          optionLabel === label ? null : (
            <Dropdown.Option
              key={`${trait}-dropdown-${optionLabel}`}
              onClick={() => handleClick({ trait, value })}
            >
              <Text>{optionLabel}</Text>
            </Dropdown.Option>
          ),
        )}
      </Dropdown.Options>
    </Dropdown.Wrapper>
  );
};

Dropdown.Wrapper = styled.div<{ $isOpen: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.green};
  border-radius: 4px;
  width: 150px;
  position: relative;
  background: ${({ theme }) => theme.colors.darkGreenBackground};

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      border-radius: 4px 4px 0 0;
      border-bottom: none;
      width: 150px;
    `};
`;

Dropdown.Button = styled(Button)`
  background: rgba(0, 0, 0, 0);
  display: grid;
  grid-template-columns: 1fr 16px;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: ${({ theme }) => theme.colors.darkGreenBackground};

  ${Text} {
    font-size: 16px;
    line-height: 20px;
    text-transform: none;
    font-weight: 700;
    text-align: start;
    color: ${({ theme }) => theme.colors.green};
  }
`;

Dropdown.Options = styled.div<{ $isOpen: boolean }>`
  height: 0;
  position: absolute;
  overflow: hidden;
  left: -1px;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      height: initial;
    `};
`;

Dropdown.Option = styled(Dropdown.Button)`
  width: 150px;
  border: 1px solid ${({ theme }) => theme.colors.green};
  border-top: none;
  border-radius: 0 0 4px 4px;

  :not(:last-child) {
    border-radius: 0;
    border-bottom: none;
  }
`;
