import styled from 'styled-components';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { Button } from 'shared/components/Button';

export const ConnectWalletButton = ({ className }: { className?: string }) => {
  const { connecting, showModal } = useWeb3();

  return (
    <ConnectWalletButton.Button
      className={className}
      slanted
      primary
      disabled={connecting}
      onClick={showModal}
    >
      Connect to wallet
    </ConnectWalletButton.Button>
  );
};

ConnectWalletButton.Button = styled(Button)`
  width: 280px;
  height: 32px;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  line-height: 16px;
  font-family: 'syncopate';
  letter-spacing: 0.065em;

  &:disabled {
    opacity: 0.5;
  }
`;
