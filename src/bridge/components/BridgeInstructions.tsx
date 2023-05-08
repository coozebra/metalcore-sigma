import styled from 'styled-components';

import { H2, OL } from 'shared/text';
import { TABS } from 'bridge/enums/tabs';

interface IBridgeInstructionsProps {
  tab: number;
}

export const BridgeInstructions = ({ tab }: IBridgeInstructionsProps) => {
  let subheader = 'deposit';

  if (tab === TABS.WITHDRAW) {
    subheader = 'withdraw';
  }

  return (
    <BridgeInstructions.Wrapper>
      <BridgeInstructions.Header>
        instructions <small>({subheader})</small>
      </BridgeInstructions.Header>
      <BridgeInstructions.OL>
        {tab === TABS.DEPOSIT && (
          <>
            <li>
              <p>Connect your wallet.</p>
              <p>
                <small>
                  <u>Note 1:</u> This is the wallet where you will be transferring tokens out of and
                  it should match the wallet used to receive the tokens.
                </small>
              </p>
            </li>
            <li>
              Input the token amount you want to transfer and click &lsquo;Deposit Tokens&rsquo;.
            </li>
            <li>
              When prompted, review the values and confirm the transaction within your wallet.
            </li>
            <li>
              <p>
                Once the tokens are sent, you will be prompted to switch your wallet over to the
                receiving chain.
              </p>
              <p>
                <small>
                  <u>Note 1:</u> If you are resuming the transfer process and have already sent
                  tokens, click on the withdraw tab to proceed.
                </small>
              </p>
              <p>
                <small>
                  <u>Note 2:</u> Please take into consideration that the whole transfer process
                  takes two transactions:{' '}
                  <u>the first on the source chain, and the second on the receiving chain.</u>
                </small>
              </p>
            </li>
          </>
        )}
        {tab === TABS.WITHDRAW && (
          <>
            <li>
              <p>
                Ensure you are on the receiving chain. If you previously sent tokens that have not
                been withdrawn, the transaction id and token amount will be filled automatically.
              </p>
              <p>
                <small>
                  <u>Note 1:</u> If the transaction id and token amount are not filled
                  automatically, you can find them on your wallet activity or through the source
                  chain&rsquo;s block scanner directly.
                </small>
              </p>
              <p>
                <small>
                  <u>Note 2:</u> If manually inputting token amount please make sure that the amount
                  to withdraw (including decimals) matches the amount sent.
                </small>
              </p>
            </li>
            <li>
              Click &lsquo;Withdraw Tokens&rsquo; and when prompted, review the values and confirm
              the transaction within your wallet. When this transaction is processed, your tokens
              will be transferred from the bridge to your wallet.
            </li>
          </>
        )}
      </BridgeInstructions.OL>
    </BridgeInstructions.Wrapper>
  );
};

BridgeInstructions.Wrapper = styled.div`
  width: 100%;
`;

BridgeInstructions.Header = styled(H2)`
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.green};
  font-weight: 600;
  padding-bottom: 14px;
`;

BridgeInstructions.OL = styled(OL)`
  margin-left: 1.1em;
`;
