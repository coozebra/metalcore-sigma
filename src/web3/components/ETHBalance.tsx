import styled from 'styled-components';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { useETHBalance } from 'web3/hooks/useETHBalance';
import { formatExplorerLink, parseBalance, shortenHex } from 'web3/utils';
import { Button } from 'shared/components/Button';
import { A, H3 } from 'shared/text';
import { ConnectWalletButton } from 'web3/components/ConnectWalletButton';

export const ETHBalance = ({ className }: { className?: string }) => {
  const { account, chainId, ENS } = useWeb3();
  const { data } = useETHBalance();

  if (typeof account !== 'string') {
    return <ETHBalance.ConnectWalletButton />;
  }

  return (
    <div className={className}>
      <A
        href={formatExplorerLink({
          type: 'account',
          data: [chainId, account],
        })}
        target="_blank"
        rel="noreferrer"
      >
        <ETHBalance.Button ghost slanted>
          <>
            <ETHBalance.Balance>{parseBalance(data ?? 0)} eth</ETHBalance.Balance>

            <ETHBalance.Account>{ENS || `${shortenHex(account, 4)}`}</ETHBalance.Account>
          </>
        </ETHBalance.Button>
      </A>
    </div>
  );
};

ETHBalance.Button = styled(Button)`
  > button {
    height: 32px;
  }
`;

ETHBalance.Text = styled(H3)`
  font-weight: 700;
  font-size: 14px;
  margin-right: 20px;
  text-transform: uppercase;
  line-height: 16px;
  font-family: 'syncopate';
`;

ETHBalance.Balance = styled(ETHBalance.Text)`
  color: ${({ theme }) => theme.colors.white};
`;

ETHBalance.Account = styled(ETHBalance.Text)`
  color: ${({ theme }) => theme.colors.green};
`;

ETHBalance.ConnectWalletButton = styled(ConnectWalletButton)`
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    margin-left: 5%;
  }
`;
