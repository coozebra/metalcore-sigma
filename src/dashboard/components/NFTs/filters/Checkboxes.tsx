import { useState } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';

import { IFilters, IFilterOptions } from 'dashboard/components/NFTs/filters/types';
import { Button } from 'shared/components/Button';
import { Text } from 'shared/text';

export const Checkboxes = ({ values, handleSelected, trait, filters }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Checkboxes.Wrapper>
      <Checkboxes.Button onClick={toggleOpen}>
        <Text>{trait}</Text>
        <Checkboxes.ButtonIcon
          $isOpen={isOpen}
          alt=""
          width="22"
          height="20"
          src="/icons/dropdown.svg"
        />
      </Checkboxes.Button>
      <Checkboxes.Values $isOpen={isOpen}>
        {values.map(value => {
          const checked = Boolean(filters?.has(value));

          return (
            <Checkboxes.Checkbox
              $checked={checked}
              key={`${trait}-${value}`}
              htmlFor={`${trait}-${value}`}
              onClick={() => handleSelected({ trait, value })}
            >
              <Text>{value}</Text>
              <input checked={checked} readOnly id={`value-${trait}-${value}`} type="checkbox" />
              {checked && (
                <Checkboxes.CheckedIcon alt="" src="icons/checkmark.svg" width="24" height="24" />
              )}
            </Checkboxes.Checkbox>
          );
        })}
      </Checkboxes.Values>
      {isOpen && <Checkboxes.Separator />}
    </Checkboxes.Wrapper>
  );
};

Checkboxes.Wrapper = styled.div`
  display: grid;
  grid-auto-rows: min-content;
  padding-right: 24px;
`;

Checkboxes.Button = styled(Button)`
  background: rgba(0, 0, 0, 0);
  display: grid;
  grid-template-columns: 1fr 24px;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 22px 0;
  height: 74px;

  ${Text} {
    font-size: 30px;
    line-height: 30px;
    text-transform: none;
    font-weight: 600;
    text-align: start;
    color: ${({ theme }) => theme.colors.white};
  }
`;

Checkboxes.ButtonIcon = styled(Image)<{ $isOpen: boolean }>`
  ${({ $isOpen }) =>
    $isOpen &&
    css`
      tranform: rotate(90deg);
    `}
`;

Checkboxes.Values = styled.div<{ $isOpen: boolean }>`
  display: grid;
  height: 0;
  overflow: hidden;
  gap: 24px;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      height: initial;
      overflow: initial;
    `}
`;

Checkboxes.CheckedIcon = styled(Image)``;

Checkboxes.Checkbox = styled.label<{ $checked: boolean }>`
  width: 100%;
  height: 24px;
  display: grid;
  grid-template-columns: 1fr 24px;
  position: relative;
  cursor: pointer;

  ${Text} {
    font-size: 20px;
    line-height: 24px;
    text-transform: none;
    font-weight: 600;
    text-align: start;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.white};
  }

  input {
    opacity: 0;
    position: absolute;
    right: 0;
    height: 24px;
    width: 24px;
    cursor: pointer;
  }

  ::before {
    content: '';
    position: absolute;
    right: 0;
    cursor: pointer;
    height: 24px;
    width: 24px;
    background: ${({ $checked, theme }) => ($checked ? theme.colors.green : theme.colors.gray)};
    border-radius: 4px;
  }

  ${Checkboxes.CheckedIcon} {
    z-index: 1;
    position: absolute;
    right: 0;
  }

  :hover {
    ::before {
      background: ${({ theme }) => theme.colors.green};
    }
  }
`;

Checkboxes.Separator = styled.div`
  width: 100%;
  background: #ffffff;
  height: 3px;
  border-radius: 3px;
  margin-top: 24px;
`;
