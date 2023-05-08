import styled, { css } from 'styled-components';
import Image from 'next/image';

import { Modal } from 'shared/components/Modal';
import { H3, Text } from 'shared/text';
import { Button } from 'shared/components/Button';
import { wallets } from 'web3/constants/wallets';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { supportedChainIds } from 'web3/constants/supportedChainIds';
import { CHAINS } from 'web3/enums/chains';

export const Web3ConnectModal = () => {
  const { hideModal, connecting, connectToWallet, hasConnector, isCorrectChain } = useWeb3();
  const hasErrors = !hasConnector || !isCorrectChain;

  return (
    <Web3ConnectModal.Wrapper onClose={hideModal} showClose={!connecting}>
      <Web3ConnectModal.Content $connecting={connecting}>
        {!hasErrors && (
          <Web3ConnectModal.WalletList>
            {wallets.map(({ title, iconUrl, connectorId }) => (
              <Web3ConnectModal.Wallet
                key={`modal-wallet-option-${title}`}
                onClick={() => connectToWallet(connectorId)}
              >
                <Web3ConnectModal.WalletImageWrapper>
                  <Image src={iconUrl} alt="" width="25" height="20" />
                </Web3ConnectModal.WalletImageWrapper>
                <Text>{title}</Text>
              </Web3ConnectModal.Wallet>
            ))}
          </Web3ConnectModal.WalletList>
        )}
        {!hasConnector && (
          <Web3ConnectModal.Error>
            <H3>No wallet detected</H3>
            <Web3ConnectModal.Text>
              We could not detect a wallet in your browser.
            </Web3ConnectModal.Text>
            <Web3ConnectModal.Text>
              Please make sure you have a wallet installed and is connected to the Ethereum network.
            </Web3ConnectModal.Text>
            <Web3ConnectModal.WalletSuggestions>
              {wallets.map(({ title, mainUrl, iconUrl }) => (
                <Web3ConnectModal.WalletSuggestion
                  href={mainUrl}
                  target="_blank"
                  key={`modal-wallet-suggestion-${title}`}
                >
                  <Web3ConnectModal.SuggestionImageWrapper>
                    <Image src={iconUrl} alt="" width="15" height="15" />
                  </Web3ConnectModal.SuggestionImageWrapper>
                  <Text>{title}</Text>
                </Web3ConnectModal.WalletSuggestion>
              ))}
            </Web3ConnectModal.WalletSuggestions>
          </Web3ConnectModal.Error>
        )}
        {!isCorrectChain && (
          <Web3ConnectModal.Error>
            <H3>Invalid chain</H3>
            <Web3ConnectModal.Text>
              You seem to be connected to an unsupported network.
            </Web3ConnectModal.Text>
            <Web3ConnectModal.Text>
              Make sure a wallet is installed and you are connected to a supported network.
            </Web3ConnectModal.Text>
            <Web3ConnectModal.Chains>
              {supportedChainIds.map(chainId => CHAINS[`${chainId}`]).join(' | ')}
            </Web3ConnectModal.Chains>
          </Web3ConnectModal.Error>
        )}
      </Web3ConnectModal.Content>
    </Web3ConnectModal.Wrapper>
  );
};

Web3ConnectModal.Wrapper = styled(Modal)`
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    height: 100%;
    width: 100%;
  }
`;

Web3ConnectModal.Content = styled.div<{ $connecting: boolean }>`
  display: grid;
  padding: 24px 48px;
  height: 100%;
  background-image: url(/modal-frame.png);
  background-size: 100% 100%;
  align-items: center;
  overflow-y: auto;

  ${({ $connecting }) =>
    $connecting &&
    css`
      opacity: 0.25;
      pointer-events: none;
    `}
`;

Web3ConnectModal.WalletList = styled.div`
  display: grid;
  justify-content: center;
  grid-auto-rows: 46px;
  grid-column-gap: 36px;
  grid-row-gap: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    grid-template-columns: repeat(2, 210px);
  }
`;

Web3ConnectModal.WalletImageWrapper = styled.div`
  display: grid;
  justify-content: center;
  height: 20px;
  width: 25px;
  justify-self: center;
`;

Web3ConnectModal.Wallet = styled(Button)`
  background-color: rgba(0, 0, 0, 0);
  background-image: url(/modal-frame.png);
  background-size: 100% 100%;
  display: grid;
  grid-template-columns: 25px 1fr;
  grid-gap: 12px;

  ${Text} {
    color: ${({ theme }) => theme.colors.green};
    text-align: start;
    text-transform: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.darkGreen};
  }
`;

Web3ConnectModal.Error = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;

  ${H3}, ${Text} {
    color: ${({ theme }) => theme.colors.green};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    height: 60%;
  }
`;

Web3ConnectModal.Chains = styled.p`
  color: ${({ theme }) => theme.colors.green};
  height: 60px;
  text-align: center;
  font-weight: 300;
  font-size: 22px;
`;

Web3ConnectModal.WalletSuggestions = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    display: flex;
  }
`;

Web3ConnectModal.SuggestionImageWrapper = styled.div`
  display: grid;
  justify-content: center;
  height: 15px;
  width: 100%;
  justify-self: center;
`;

Web3ConnectModal.WalletSuggestion = styled.a`
  text-decoration: none;
  display: grid;
  grid-template-rows: 15px max-content;

  ${Text} {
    font-size: 12px;
    text-align: center;
  }

  &:hover {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.colors.green};
  }
`;

Web3ConnectModal.Text = styled(Text)`
  text-transform: capitalize;
`;
