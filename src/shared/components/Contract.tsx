import styled from 'styled-components';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';

import { Link, Text } from 'shared/text';
import { formatExplorerLink, shortenHex } from 'web3/utils';
import { CheckmarkIcon } from 'shared/components/CheckmarkIcon';

interface IContractProps {
  label: string;
  address: string;
  chainId: number;
}

export const Contract = ({ label, address, chainId }: IContractProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleContractCopy = () => {
    setHasCopied(true);

    setTimeout(() => setHasCopied(false), 3000);
  };

  return (
    <Contract.Title>
      {label}:
      <Contract.ContractWrapper>
        <CopyToClipboard text={address} onCopy={handleContractCopy}>
          {hasCopied ? (
            <Contract.Checkmark />
          ) : (
            <Contract.Copy src="/icons/copy-icon.png" height="25" width="25" alt="copy" />
          )}
        </CopyToClipboard>
        <Contract.Contract
          href={formatExplorerLink({
            type: 'account',
            data: [chainId, address],
          })}
          target="_blank"
          rel="noreferrer"
        >
          {shortenHex(address as string)}
        </Contract.Contract>
      </Contract.ContractWrapper>
    </Contract.Title>
  );
};

Contract.ContractWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
  height: 25px;
  position: relative;
`;

Contract.Title = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;

  &:first-child {
    padding-bottom: 30px;
  }
`;

Contract.Value = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  font-weight: 600;
`;

Contract.Contract = styled(Link)`
  color: ${({ theme }) => theme.colors.green};
  text-decoration: underline;
  font-size: 16px;
  letter-spacing: 2px;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    text-align: center;
  }
`;

Contract.Checkmark = styled(CheckmarkIcon)`
  transform: scale(0.15);
  position: absolute;
  left: -52px;
  top: -39px;
`;

Contract.Copy = styled(Image)`
  cursor: pointer;
`;
