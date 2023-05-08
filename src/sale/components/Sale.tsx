import { useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useState, useEffect, MutableRefObject, useCallback } from 'react';
import { formatUnits } from '@ethersproject/units';
import Cookie from 'js-cookie';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import getConfig from 'next/config';

import { Text, Link } from 'shared/text';
import { Button } from 'shared/components/Button';
import { Contracts } from 'shared/components/Contracts';
import { Contract } from 'shared/components/Contract';
import { Countdown } from 'shared/components/Countdown';
import { PlusMinusInput } from 'shared/components/PlusMinusInput';
import { SalesProgressModal } from 'shared/components/SalesProgressModal';
import { SaleStats } from 'sale/components/SaleStats';
import { useSale } from 'sale/providers/SaleProvider';
import { IReceipt } from 'contracts/types/Receipt';
import { SALES_TRANSACTION_STATUS } from 'shared/enums/TransactionStatus';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { STORAGE } from 'shared/enums/storage';
import { ConnectWalletButton } from 'web3/components/ConnectWalletButton';
import { getMintNFTValidationSchema } from 'shared/utils/validations';
import { parseBalance } from 'web3/utils';
import { isExpired } from 'shared/utils/date';
import { SaleStep } from 'sale/enums/SaleStep';
import { Timeline } from 'shared/components/Timeline';
import {
  useSaleMaxMintable,
  useSaleMaxMintPerAddress,
  useSaleMaxMintPerTx,
  useSaleMinted,
  useSalePrice,
  useSaleStep,
  useSaleTotalMinted,
} from 'sale/hooks';

export const Sale = () => {
  const salesRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { chainId, connected, library } = useWeb3();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { publicRuntimeConfig } = getConfig();

  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState('');
  const [soldOut, setSoldOut] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);

  const INITIAL_VALUES = { count: 1, terms: false };
  const SALE_CONTRACT = publicRuntimeConfig.SALE_CONTRACT_ADDRESS as string;
  const SALE_START_DATE = publicRuntimeConfig.SALE_START_DATE as string;
  const TOTAL_INFANTRY_PUBLIC_SALE_NFTS = 1000;

  const {
    getTransactionReceipt,
    purchase,
    purchaseConfirmedDispatcher,
    purchaseErrorDispatcher,
    purchaseSuccessDispatcher,
    transaction,
    waitForPurchaseTransaction,
  } = useSale();

  const { data: saleStep } = useSaleStep(SALE_CONTRACT);
  const { data: salePricePerNFT = 0 } = useSalePrice(SALE_CONTRACT);
  const { data: maxSaleMintPerTx = 0 } = useSaleMaxMintPerTx(SALE_CONTRACT);
  const { data: totalSaleNFTCount } = useSaleMaxMintable(SALE_CONTRACT);
  const { data: totalSaleMintedNFTCount } = useSaleTotalMinted(SALE_CONTRACT);
  const { data: saleMaxMintPerAddress } = useSaleMaxMintPerAddress(SALE_CONTRACT);
  const { data: userSaleMintedAmount = 0 } = useSaleMinted(SALE_CONTRACT);

  const isMaxed = userSaleMintedAmount >= saleMaxMintPerAddress;

  const canPurchase =
    !isMaxed &&
    !soldOut &&
    saleOpen &&
    saleStep === SaleStep.SALE &&
    transaction.status !== SALES_TRANSACTION_STATUS.CONFIRMED &&
    transaction.status !== SALES_TRANSACTION_STATUS.PURCHASING;

  let displayBalancePricePerNFT = parseBalance(salePricePerNFT || 0);

  if (displayBalancePricePerNFT === '0.0000') {
    displayBalancePricePerNFT = '0';
  }

  let mintButtonLabel = 'mint nft';

  if (isMaxed && userSaleMintedAmount !== 0 && saleMaxMintPerAddress !== 0) {
    mintButtonLabel = 'max nfts minted';
  } else if (soldOut) {
    mintButtonLabel = 'sold out';
  }

  const handleFormChange = event => {
    const amount = event?.target?.value;

    setTotalPurchaseAmount(
      amount <= maxSaleMintPerTx ? parseBalance(amount * (salePricePerNFT as number)) : '0',
    );
  };

  const handleMint = useCallback(
    async values => {
      if (!executeRecaptcha) {
        purchaseErrorDispatcher(undefined, 'Execute recaptcha not yet available');
        return;
      }

      const token = await executeRecaptcha('mint');

      const verification: any = await axios.post('/api/v1/bot', { token });

      if (!verification?.data?.verified) {
        purchaseErrorDispatcher(undefined, 'Did not pass recaptcha.');
        return;
      }

      if (transaction.status === SALES_TRANSACTION_STATUS.PURCHASING) {
        return;
      }

      setShowModal(true);

      try {
        await purchase(parseInt(values.count, 16), parseFloat(formatUnits(salePricePerNFT, 18)));
      } catch (error: any) {
        purchaseErrorDispatcher(undefined, error?.message);
      }
    },
    [executeRecaptcha],
  );

  const handleModalCloseClick = () => {
    setShowModal(false);
  };

  /**
   * NOTE: the user initiated a purchase but left the site. This allows them
   * to start where they left off
   */
  useEffect(() => {
    const hash = Cookie.get(STORAGE.SALE_TX_HASH);

    const setTransactionProgress = async () => {
      try {
        const receipt: null | IReceipt = await getTransactionReceipt(hash);

        switch (receipt?.status) {
          case null:
            setShowModal(true);
            purchaseConfirmedDispatcher(hash);
            waitForPurchaseTransaction(hash);
            break;
          case 0:
            setShowModal(true);
            purchaseErrorDispatcher(hash);
            break;
          case 1:
            setShowModal(true);
            purchaseSuccessDispatcher();
            break;
          default:
            break;
        }
      } catch (error) {
        console.log('error: ', error);
      }
    };

    if (hash && library) {
      setTransactionProgress();
    }
  }, [library]);

  useEffect(() => {
    const totalMintedNFTs = totalSaleMintedNFTCount?.toNumber() || 0;

    if (totalMintedNFTs >= TOTAL_INFANTRY_PUBLIC_SALE_NFTS) {
      setSoldOut(true);
    }
  }, [totalSaleNFTCount, totalSaleMintedNFTCount]);

  useEffect(() => {
    switch (transaction.status) {
      case SALES_TRANSACTION_STATUS.PURCHASING:
        setProgress(33);
        break;
      case SALES_TRANSACTION_STATUS.CONFIRMED:
        setProgress(66);
        break;
      case SALES_TRANSACTION_STATUS.PURCHASED:
        setProgress(100);
        break;
      default:
        break;
    }
  }, [transaction.status]);

  useEffect(() => {
    setTotalPurchaseAmount(parseBalance(salePricePerNFT || 0));
  }, [salePricePerNFT]);

  useEffect(() => {
    if (isExpired(SALE_START_DATE)) {
      setSaleOpen(true);
      return;
    }

    const interval = setInterval(() => {
      setSaleOpen(isExpired(SALE_START_DATE));

      if (isExpired(SALE_START_DATE)) {
        clearInterval(interval);
        return;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Sale.Wrapper>
      <Timeline type="sale" />
      <Sale.BodyWrapper>
        <SaleStats />
        <Countdown scrollToLabel="Buy NFTs Below" scrollTo={salesRef.current} />
        <Sale.Contracts>
          {chainId ? (
            <>
              <Contract
                label="Sale Contract"
                address={publicRuntimeConfig.SALE_CONTRACT_ADDRESS as string}
                chainId={chainId}
              />
              <Contract
                label="NFT Contract"
                address={publicRuntimeConfig.ASSET_CONTRACT_ADDRESS as string}
                chainId={chainId}
              />
            </>
          ) : (
            <Sale.ContractText>Please connect your wallet to view contracts.</Sale.ContractText>
          )}
        </Sale.Contracts>
      </Sale.BodyWrapper>

      <Sale.NFTWrapper ref={salesRef}>
        <Sale.NFTCardWrapper>
          <Image src="/nft-infantry.png" height="400" width="400" alt="" />
          <Sale.EthText>
            <Image src="/icons/eth-icon.png" height="15" width="15" alt="eth" />
            {displayBalancePricePerNFT}&nbsp;eth per nft
          </Sale.EthText>
        </Sale.NFTCardWrapper>

        {/* NOTE: disabled for free mint */}
        {/* <Sale.NFTPriceSummary>
          total cost:&nbsp;
          <Image src="/icons/eth-icon.png" height="15" width="15" alt="eth" />
          {totalPurchaseAmount}
        </Sale.NFTPriceSummary> */}

        {connected ? (
          <Formik
            enableReinitialize
            initialValues={INITIAL_VALUES}
            onSubmit={handleMint}
            validationSchema={getMintNFTValidationSchema({
              max: maxSaleMintPerTx,
            })}
            key="sale"
          >
            {({ errors, isSubmitting, isValid, values, setFieldValue }) => {
              const isDisabled = !canPurchase || !isValid || isSubmitting;

              return (
                <Sale.Form onChange={handleFormChange}>
                  {/* NOTE: disabled for free mint */}
                  {/* <PlusMinusInput
                    value={values.count}
                    name="count"
                    increase={() => setFieldValue('count', (Number(values.count) || 0) + 1)}
                    decrease={() => setFieldValue('count', (Number(values.count) || 0) - 1)}
                    max={maxSaleMintPerTx}
                    hasError={!!errors.count}
                  />
                  <Sale.ErrorMessage>{errors?.count}</Sale.ErrorMessage> */}
                  <Sale.TermsLabel>
                    <Field type="checkbox" name="terms" />
                    &nbsp; I state that I have read the&nbsp;
                    <Sale.Link
                      aria-label="terms of service"
                      href="https://cdn.metalcore.gg/legal/v1.1_MetalCore_NFT_TCs_for_Websites.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      terms of service
                    </Sale.Link>
                    &nbsp;and the&nbsp;
                    <Sale.Link
                      aria-label="privacy policy"
                      href="https://www.metalcoregame.com/privacy-policy"
                      target="_blank"
                      rel="noreferrer"
                    >
                      privacy policy
                    </Sale.Link>
                    .
                  </Sale.TermsLabel>
                  <Sale.ErrorMessage>{errors?.terms}</Sale.ErrorMessage>
                  <Sale.NFTButton
                    primary={canPurchase}
                    secondary={isDisabled}
                    slanted
                    disabled={isDisabled}
                    type="submit"
                  >
                    <Sale.NFTButtonIcon
                      src="/icons/nft-icon.svg"
                      height="15"
                      width="15"
                      alt="nft"
                    />
                    &nbsp;{mintButtonLabel}
                  </Sale.NFTButton>
                </Sale.Form>
              );
            }}
          </Formik>
        ) : (
          <Sale.ConnectWalletButtonWrapper>
            <ConnectWalletButton />
          </Sale.ConnectWalletButtonWrapper>
        )}
      </Sale.NFTWrapper>
      {showModal && (
        <SalesProgressModal
          close={handleModalCloseClick}
          progress={progress}
          status={transaction.status}
          hash={transaction.hash}
          errorMessage={transaction.error?.message}
          errorCause={transaction.error?.cause}
          retry={handleMint}
        />
      )}
    </Sale.Wrapper>
  );
};

Sale.Wrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.darkBlack};
`;

Sale.Row = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-direction: column;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    flex-wrap: wrap;
  }
`;

Sale.BodyWrapper = styled(Sale.Row)`
  padding: 20px 2%;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-direction: column-reverse;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    align-items: center;
  }
`;

Sale.NFTWrapper = styled(Sale.Row)`
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  background-image: url('/presale/earth-background.png');
  background-size: cover;
  background-position: 50% 25%;
  height: 100vh;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    padding: 0 15px;
  }
`;

Sale.Form = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

Sale.Label = styled.label`
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  padding-top: 10px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    font-size: 20px;
  }
`;

Sale.ConnectWalletButtonWrapper = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

Sale.ErrorMessage = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  text-transform: none;
  height: 19px;
`;

Sale.NFTButton = styled(Button)`
  width: 260px;
  font-weight: 600;
`;

Sale.NFTButtonIcon = styled(Image)`
  filter: brightness(0) saturate(100%);
`;

Sale.NFTCardWrapper = styled.div`
  position: relative;
`;

Sale.EthText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`;

Sale.NFTPriceSummary = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

Sale.NFTLink = styled(Link)`
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.green};
  font-weight: 600;
  width: 125px;
  margin: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  text-align: center;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.black};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    margin: 0 10px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 150px;
  }
`;

Sale.Error = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  padding-top: 5px;
`;

Sale.Contracts = styled(Contracts)`
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding-top: 12px;
  }
`;

Sale.ContractText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  font-size: 16px;
`;

Sale.TermsLabel = styled.label`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding: 10px 0;
`;

Sale.Link = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: lowercase;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }
`;
