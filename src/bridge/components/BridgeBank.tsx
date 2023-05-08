import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';

import { STORAGE } from 'shared/enums/storage';
import { getBridgeTxs } from 'bridge/utils/bridgeTx';
import { IReceipt } from 'contracts/types/Receipt';
import { useBridge } from 'bridge/providers/BridgeProvider';
import { BridgeDeposit } from 'bridge/components/BridgeDeposit';
import { BridgeWithdraw } from 'bridge/components/BridgeWithdraw';
import { CHAINS } from 'web3/enums/chains';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { TABS } from 'bridge/enums/tabs';
import { bridgeActions } from 'bridge/state/bridgeActions';

interface IBridgeBankProps {
  onSelect: (index: number) => void;
  tab: number;
}

export const BridgeBank = ({ onSelect, tab }: IBridgeBankProps) => {
  const { chainId, library } = useWeb3();
  const {
    displayDepositModal,
    displayWithdrawModal,
    getTransactionReceipt,
    mintConfirmed,
    mintError,
    mintSuccess,
    operators,
    depositConfirmed,
    depositError,
    depositSuccess,
    waitForHomeGateTransaction,
    waitForForeignGateTransaction,
    waitForConfirmation,
    withdrawConfirmed,
    withdrawError,
    withdrawSuccess,
  } = useBridge();

  const [fromNetwork, setFromNetwork] = useState('current network');
  const [toNetwork, setToNetwork] = useState('destination network');

  useEffect(() => {
    setFromNetwork(chainId ? CHAINS[chainId] : 'current network');

    const mainOperator = operators?.[0];

    switch (chainId) {
      case mainOperator?.homeGate?.network?.chainId:
        setToNetwork(CHAINS[mainOperator?.foreignGate?.network?.chainId || '']);
        break;
      case mainOperator?.foreignGate?.network?.chainId:
        setToNetwork(CHAINS[mainOperator?.homeGate?.network?.chainId || '']);
        break;
      default:
        setToNetwork('destination network');
        break;
    }
  }, [chainId, JSON.stringify(operators)]);

  /**
   * NOTE: the user initiated a purchase but left the site. This allows them
   * to start where they left off
   */
  useEffect(() => {
    const transactions = getBridgeTxs();

    const mintTxHash = Cookie.get(STORAGE.BRIDGE_MINT_TX_HASH);
    const depositTxHash = Cookie.get(STORAGE.BRIDGE_DEPOSIT_TX_HASH);
    const withdrawTxHash = Cookie.get(STORAGE.BRIDGE_WITHDRAW_TX_HASH);

    const setTransactionProgress = async (type: 'mint' | 'deposit' | 'withdraw', hash) => {
      try {
        const receipt: null | IReceipt = await getTransactionReceipt(hash);

        const isMint = type === 'mint';
        const isDeposit = type === 'deposit';
        const isWithdraw = type === 'withdraw';

        switch (receipt?.status) {
          // NOTE: Transaction is confirmed
          case null:
            if (isDeposit) {
              displayDepositModal();
              depositConfirmed(depositTxHash);
              waitForConfirmation({
                hash: depositTxHash,
                errorType: bridgeActions.burnError,
                successType: bridgeActions.burnSuccess,
              });
            } else if (isMint) {
              displayWithdrawModal();
              mintConfirmed(withdrawTxHash);
              waitForForeignGateTransaction(withdrawTxHash, {
                errorType: bridgeActions.mintError,
                successType: bridgeActions.mintSuccess,
              });
            } else if (isWithdraw) {
              displayWithdrawModal();
              withdrawConfirmed(withdrawTxHash);
              waitForHomeGateTransaction(withdrawTxHash, {
                errorType: bridgeActions.withdrawError,
                successType: bridgeActions.withdrawSuccess,
              });
            }
            break;

          // NOTE: Transaction has error
          case 0:
            if (isDeposit) {
              displayDepositModal();
              depositError(depositTxHash);
            } else if (isMint) {
              displayWithdrawModal();
              mintError(withdrawTxHash);
            } else if (isWithdraw) {
              displayWithdrawModal();
              withdrawError(withdrawTxHash);
            }
            break;

          // NOTE: Transaction is successful
          case 1:
            if (isDeposit) {
              displayDepositModal();
              depositSuccess();
            } else if (isMint) {
              displayWithdrawModal();
              mintSuccess();
            } else if (isWithdraw) {
              displayWithdrawModal();
              withdrawSuccess();
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('error bridging: ', error);
      }
    };

    if (mintTxHash && transactions.length > 0 && library) {
      setTransactionProgress('mint', mintTxHash);
    } else if (withdrawTxHash && transactions.length > 0 && library) {
      setTransactionProgress('withdraw', withdrawTxHash);
    } else if (depositTxHash && library) {
      setTransactionProgress('deposit', depositTxHash);
    }
  }, [library]);

  // NOTE: Existing deposit transactions, send the user to the withdraw tab
  useEffect(() => {
    const transactions = getBridgeTxs();

    if (transactions.length > 0) {
      onSelect(TABS.WITHDRAW);
    }
  }, []);

  return (
    <BridgeBank.Tabs
      selectedTabClassName="bridge-tab-selected"
      selectedTabPanelClassName="bridge-tab-panel-selected"
      onSelect={onSelect}
      selectedIndex={tab}
    >
      <BridgeBank.TabList>
        <BridgeBank.Tab>deposit</BridgeBank.Tab>
        <BridgeBank.Tab>withdraw</BridgeBank.Tab>
      </BridgeBank.TabList>

      <BridgeBank.TabPanel>
        <BridgeDeposit toNetwork={toNetwork} fromNetwork={fromNetwork} />
      </BridgeBank.TabPanel>
      <BridgeBank.TabPanel>
        <BridgeWithdraw toNetwork={toNetwork} fromNetwork={fromNetwork} />
      </BridgeBank.TabPanel>
    </BridgeBank.Tabs>
  );
};

BridgeBank.Tabs = styled(Tabs)`
  -webkit-tap-highlight-color: transparent;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 100%;
  }
`;

BridgeBank.TabList = styled(TabList)`
  margin: 0 0 10px;
  padding: 0;
`;

BridgeBank.Tab = styled(Tab)`
  border: none;
  bottom: -1px;
  cursor: pointer;
  display: inline-block;
  list-style: none;
  padding: 12px 0;
  position: relative;
  width: 200px;
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 20px;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.green};

  &.bridge-tab-selected {
    border-bottom: 1px solid ${({ theme }) => theme.colors.green};

    &:hover {
      border-bottom: 1px solid ${({ theme }) => theme.colors.white};
    }
  }

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 45%;
    margin: 0 5px;
  }
`;

BridgeBank.TabPanel = styled(TabPanel)`
  display: none;
  color: white;

  &.bridge-tab-panel-selected {
    display: block;
  }
`;
