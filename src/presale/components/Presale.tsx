import styled, { css } from 'styled-components';
import Image from 'next/image';
import { useState, useEffect, useRef, MutableRefObject, useCallback } from 'react';
import { formatUnits } from '@ethersproject/units';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import getConfig from 'next/config';

import { H2, Text } from 'shared/text';
import { Button } from 'shared/components/Button';
import { PresaleStats } from 'presale/components/PresaleStats';
import { Countdown } from 'shared/components/Countdown';
import { usePresale } from 'presale/providers/PresaleProvider';
import { IReceipt } from 'contracts/types/Receipt';
import { Modal } from 'shared/components/Modal';
import { PRESALE_TRANSACTION_STATUS } from 'shared/enums/TransactionStatus';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { formatExplorerLink } from 'web3/utils';
import { STORAGE } from 'shared/enums/storage';
import { Loader } from 'shared/components/Loader';
import { ConnectWalletButton } from 'web3/components/ConnectWalletButton';
import { ProgressBar } from 'shared/components/ProgressBar';
import { parseBalance } from 'web3/utils';
import { Contracts } from 'shared/components/Contracts';
import { Contract } from 'shared/components/Contract';
import { SaleStep } from 'sale/enums/SaleStep';
import { Timeline } from 'shared/components/Timeline';
import { getMintNFTValidationSchema } from 'shared/utils/validations';
import { isExpired } from 'shared/utils/date';
import {
  useSaleMaxMintable,
  useSaleMaxMintPerAddress,
  useSaleMintedPresale,
  useSalePrice,
  useSaleStep,
  useSaleTotalMinted,
} from 'sale/hooks';

export const Presale = () => {
  const presaleRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { chainId, connected, library } = useWeb3();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { publicRuntimeConfig } = getConfig();

  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [soldOut, setSoldOut] = useState(false);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState('');
  const [presaleOpen, setPresaleOpen] = useState(false);

  const INITIAL_VALUES = { count: 1, terms: false };
  const PRESALE_CONTRACT = publicRuntimeConfig.PRESALE_CONTRACT_ADDRESS as string;
  const PRESALE_START_DATE = publicRuntimeConfig.PRESALE_START_DATE as string;

  const {
    getTransactionReceipt,
    purchase,
    purchaseConfirmedDispatcher,
    purchaseErrorDispatcher,
    purchaseSuccessDispatcher,
    transaction,
    waitForPurchaseTransaction,
    whitelist,
  } = usePresale();

  const { data: presalePricePerNFT = 0 } = useSalePrice(PRESALE_CONTRACT);
  const { data: saleStep } = useSaleStep(PRESALE_CONTRACT);
  const { data: totalPresaleNFTCount } = useSaleMaxMintable(PRESALE_CONTRACT);
  const { data: totalPresaleMintedNFTCount } = useSaleTotalMinted(PRESALE_CONTRACT);
  const { data: presaleMaxMintPerAddress } = useSaleMaxMintPerAddress(PRESALE_CONTRACT);
  const { data: userPresaleMintedAmount = 0 } = useSaleMintedPresale(PRESALE_CONTRACT);
  const { data: userMaxPresaleNFTPerWallet = 0 } = useSaleMaxMintPerAddress(PRESALE_CONTRACT);

  const isWhitelisted = !!whitelist?.signature;
  const isMaxed = userPresaleMintedAmount >= presaleMaxMintPerAddress;

  const canPurchase =
    !isMaxed &&
    !soldOut &&
    presaleOpen &&
    isWhitelisted &&
    saleStep === SaleStep.PRESALE &&
    transaction.status !== PRESALE_TRANSACTION_STATUS.CONFIRMED &&
    transaction.status !== PRESALE_TRANSACTION_STATUS.PURCHASING;

  let displayBalancePricePerNFT = parseBalance(presalePricePerNFT || 0);

  if (displayBalancePricePerNFT === '0.0000') {
    displayBalancePricePerNFT = '0';
  }

  let mintButtonLabel = 'mint nft';

  if (isMaxed && userPresaleMintedAmount !== 0 && presaleMaxMintPerAddress !== 0) {
    mintButtonLabel = 'max nfts minted';
  } else if (soldOut) {
    mintButtonLabel = 'sold out';
  }

  const handleFormChange = event => {
    const amount = event?.target?.value;
    const max = userMaxPresaleNFTPerWallet - userPresaleMintedAmount;

    setTotalPurchaseAmount(
      amount <= max ? parseBalance(amount * (presalePricePerNFT as number)) : '0',
    );
  };

  const handleMint = useCallback(async () => {
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

    const NFT_COUNT = 1;

    if (transaction.status === PRESALE_TRANSACTION_STATUS.PURCHASING) return;

    setShowModal(true);

    try {
      await purchase(NFT_COUNT, parseFloat(formatUnits(presalePricePerNFT, 18)));
    } catch (error: any) {
      purchaseErrorDispatcher(undefined, error?.message);
    }
  }, [executeRecaptcha]);

  const handleModalCloseClick = () => {
    setShowModal(false);
  };

  /**
   * NOTE: the user initiated a purchase but left the site. This allows them
   * to start where they left off
   */
  useEffect(() => {
    const hash = Cookie.get(STORAGE.PRESALE_TX_HASH);

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
    const totalNFTs = totalPresaleNFTCount?.toNumber() || 0;
    const totalMintedNFTs = totalPresaleMintedNFTCount?.toNumber() || 0;

    if (totalMintedNFTs >= totalNFTs && totalNFTs !== 0) {
      setSoldOut(true);
    }
  }, [totalPresaleNFTCount, totalPresaleMintedNFTCount]);

  useEffect(() => {
    switch (transaction.status) {
      case PRESALE_TRANSACTION_STATUS.PURCHASING:
        setProgress(33);
        break;
      case PRESALE_TRANSACTION_STATUS.CONFIRMED:
        setProgress(66);
        break;
      case PRESALE_TRANSACTION_STATUS.PURCHASED:
        setProgress(100);
        break;
      default:
        break;
    }
  }, [transaction.status]);

  useEffect(() => {
    setTotalPurchaseAmount(parseBalance(presalePricePerNFT || 0));
  }, [presalePricePerNFT]);

  useEffect(() => {
    if (isExpired(PRESALE_START_DATE)) {
      setPresaleOpen(true);
      return;
    }

    const interval = setInterval(() => {
      setPresaleOpen(isExpired(PRESALE_START_DATE));

      if (isExpired(PRESALE_START_DATE)) {
        clearInterval(interval);
        return;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Presale.Wrapper>
      <Timeline type="presale" />
      <Presale.BodyWrapper>
        <PresaleStats />
        <Countdown
          {...(!presaleOpen && {
            endDate: PRESALE_START_DATE,
            label: 'presale opens in',
          })}
          scrollToLabel="Buy NFTs Below"
          scrollTo={presaleRef.current}
        />
        <Presale.Contracts>
          {chainId ? (
            <>
              <Contract
                label="Presale Contract"
                address={publicRuntimeConfig.PRESALE_CONTRACT_ADDRESS as string}
                chainId={chainId}
              />
              <Contract
                label="NFT Contract"
                address={publicRuntimeConfig.ASSET_CONTRACT_ADDRESS as string}
                chainId={chainId}
              />
            </>
          ) : (
            <Presale.ContractText>
              Please connect your wallet to view contracts.
            </Presale.ContractText>
          )}
        </Presale.Contracts>
      </Presale.BodyWrapper>

      <Presale.NFTWrapper ref={presaleRef}>
        <Presale.NFTCardWrapper>
          <Image src="/nft-infantry.png" height="400" width="400" alt="" />
          <Presale.EthText>
            <Image src="/icons/eth-icon.png" height="15" width="15" alt="eth" />
            {displayBalancePricePerNFT}&nbsp;eth per nft
          </Presale.EthText>
        </Presale.NFTCardWrapper>

        {connected ? (
          <Formik
            enableReinitialize
            initialValues={INITIAL_VALUES}
            onSubmit={handleMint}
            key="presale"
            validationSchema={getMintNFTValidationSchema({
              max: userMaxPresaleNFTPerWallet - userPresaleMintedAmount,
            })}
          >
            {({ isSubmitting, isValid, errors }) => (
              // NOTE: disabled for free mint
              // <Presale.Form onChange={handleFormChange}>
              //   <Presale.Input
              //     id="count"
              //     name="count"
              //     autoComplete="off"
              //     $error={!!errors.count}
              //   />
              //   <Presale.ErrorMessage>{errors?.count}</Presale.ErrorMessage>
              <Presale.Form>
                <Presale.TermsLabel>
                  <Field type="checkbox" name="terms" />
                  &nbsp; I agree to the&nbsp;
                  <Presale.Link
                    aria-label="terms of service"
                    href="https://cdn.metalcore.gg/legal/v1.1_MetalCore_NFT_TCs_for_Websites.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    terms of service
                  </Presale.Link>
                  &nbsp;and the&nbsp;
                  <Presale.Link
                    aria-label="privacy policy"
                    href="https://www.metalcoregame.com/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    privacy policy
                  </Presale.Link>
                  .
                </Presale.TermsLabel>
                <Presale.ErrorMessage>{errors?.terms}</Presale.ErrorMessage>
                <Presale.NFTButton
                  {...{
                    primary: canPurchase,
                    secondary: !canPurchase || !isValid || isSubmitting,
                  }}
                  slanted
                  disabled={!canPurchase || !isValid || isSubmitting}
                  type="submit"
                >
                  <Presale.NFTButtonIcon
                    src="/icons/nft-icon.svg"
                    height="15"
                    width="15"
                    alt="nft"
                  />
                  &nbsp;{mintButtonLabel}
                </Presale.NFTButton>
              </Presale.Form>
            )}
          </Formik>
        ) : (
          <Presale.ConnectWalletButtonWrapper>
            <ConnectWalletButton />
          </Presale.ConnectWalletButtonWrapper>
        )}
      </Presale.NFTWrapper>
      {showModal && (
        <Presale.Modal onClose={handleModalCloseClick}>
          <Presale.ModalWrapper
            $centered={
              transaction.status === PRESALE_TRANSACTION_STATUS.PURCHASING ||
              transaction.status === PRESALE_TRANSACTION_STATUS.CONFIRMED
            }
          >
            <Presale.ModalBody>
              <Presale.ProgressBar
                progress={progress}
                errors={transaction.status === PRESALE_TRANSACTION_STATUS.ERROR}
              />

              {transaction.status === PRESALE_TRANSACTION_STATUS.PURCHASING && (
                <>
                  <Presale.ModalHeader>Initiating Transaction</Presale.ModalHeader>
                  <Presale.ModalLoader>
                    <Loader />
                  </Presale.ModalLoader>
                  <Presale.ModalText>
                    Please confirm the transaction within your wallet so we can create the NFT(s) in
                    your wallet.
                  </Presale.ModalText>
                </>
              )}
              {transaction.status === PRESALE_TRANSACTION_STATUS.CONFIRMED && (
                <>
                  <Presale.ModalHeader>Waiting For Confirmation</Presale.ModalHeader>
                  <Presale.ModalLoader>
                    <Loader />
                  </Presale.ModalLoader>
                  <Presale.ModalText>
                    Please do not refresh or close the page while we wait for the transaction to be
                    confirmed in Etherscan so we can finish generating the NFT(s) in your wallet.
                    This may take a few minutes.
                  </Presale.ModalText>
                  {transaction.hash && (
                    <Presale.ModalLink
                      href={formatExplorerLink({
                        type: 'transaction',
                        data: [chainId, transaction.hash],
                      })}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Click here to view the status of your transaction.
                    </Presale.ModalLink>
                  )}
                </>
              )}
              {transaction.status === PRESALE_TRANSACTION_STATUS.PURCHASED && (
                <>
                  <Presale.ModalHeader>Confirmation Complete!</Presale.ModalHeader>
                  <Presale.ModalText>
                    Congrats! You are now an owner of one of the unique infantry from METALCORE. You
                    can check your wallet to see the NFT(s) address.
                  </Presale.ModalText>

                  {transaction.hash && (
                    <Presale.ModalLink
                      href={formatExplorerLink({
                        type: 'transaction',
                        data: [chainId, transaction.hash],
                      })}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Click here to view your transaction.
                    </Presale.ModalLink>
                  )}
                </>
              )}
              {transaction.status === PRESALE_TRANSACTION_STATUS.ERROR && (
                <>
                  <Presale.ModalHeader>Transaction Failed</Presale.ModalHeader>
                  {transaction.error?.message && (
                    <Presale.ModalText>{transaction.error?.message}</Presale.ModalText>
                  )}
                  <Presale.ModalText>
                    If you are in need support feel free to{' '}
                    <Presale.ModalLink
                      href="mailto:inquiries@metalcoregame.com"
                      aria-label="get in touch"
                    >
                      get in touch
                    </Presale.ModalLink>{' '}
                    with us.
                  </Presale.ModalText>
                  {transaction.error?.cause && (
                    <Presale.ModalLink
                      href={formatExplorerLink({
                        type: 'transaction',
                        data: [chainId, transaction.error?.cause],
                      })}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Click here to view more details about your transaction.
                    </Presale.ModalLink>
                  )}
                </>
              )}
            </Presale.ModalBody>
            <Presale.ModalFooter>
              {transaction.status === PRESALE_TRANSACTION_STATUS.ERROR && (
                <Presale.ModalButton primary onClick={handleMint}>
                  try again
                </Presale.ModalButton>
              )}

              {transaction.status === PRESALE_TRANSACTION_STATUS.PURCHASED && (
                <Presale.NFTLink href="/nfts" aria-label="nfts">view nfts</Presale.NFTLink>
              )}

              {(transaction.status === PRESALE_TRANSACTION_STATUS.ERROR ||
                transaction.status === PRESALE_TRANSACTION_STATUS.PURCHASED) && (
                <Presale.ModalButton ghost onClick={handleModalCloseClick}>
                  close
                </Presale.ModalButton>
              )}
            </Presale.ModalFooter>
          </Presale.ModalWrapper>
        </Presale.Modal>
      )}
    </Presale.Wrapper>
  );
};

Presale.Wrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.darkBlack};
`;

Presale.Row = styled.div`
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

Presale.BodyWrapper = styled(Presale.Row)`
  padding: 20px 2%;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-direction: column-reverse;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    align-items: center;
  }
`;

Presale.NFTWrapper = styled(Presale.Row)`
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

Presale.Form = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

Presale.Label = styled.label`
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

Presale.Input = styled(Field)<{ $error: boolean }>`
  height: 50px;
  width: 100px;
  text-align: center;
  border: none;
  outline: none;
  margin-bottom: 10px;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }

  ${({ $error }) =>
    $error &&
    css`
      border: 2px solid ${({ theme }) => theme.colors.red};
    `}
`;

Presale.ConnectWalletButtonWrapper = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

Presale.ErrorMessage = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  text-transform: none;
  height: 19px;
`;

Presale.NFTButton = styled(Button)`
  width: 260px;
  font-weight: 600;
`;

Presale.NFTButtonIcon = styled(Image)`
  filter: brightness(0) saturate(100%);
`;

Presale.NFTCardWrapper = styled.div`
  position: relative;
`;

Presale.EthText = styled(Text)`
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

Presale.NFTPriceSummary = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

Presale.Modal = styled(Modal)`
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 90vw;
    height: 90vh;
  }
`;

Presale.ModalWrapper = styled.div<{ $centered: boolean }>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 20px 50px;
  text-align: center;
  background-image: url(/modal-frame.png);
  background-size: 100% 100%;

  ${({ $centered }) =>
    $centered &&
    css`
      justify-content: center;

      @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
        align-items: center;
      }
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 20px;
  }
`;

Presale.ProgressBar = styled(ProgressBar)`
  margin-bottom: 10px;
`;

Presale.ModalHeader = styled(H2)`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding-bottom: 10px;
  -webkit-text-stroke: 1px ${({ theme }) => theme.colors.green};
  -webkit-text-fill-color: ${({ theme }) => theme.colors.black}; ;
`;

Presale.ModalBody = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

Presale.ModalLoader = styled.div`
  height: 50px;
`;

Presale.ModalFooter = styled.div`
  display: flex;
  justify-content: center;
`;

Presale.ModalButton = styled(Button)`
  width: 160px;
  flex-grow: 0;
  margin: 0 20px;
  font-weight: 600;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    margin: 0 10px;
  }
`;

Presale.ModalText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
  padding-bottom: 10px;
  text-align: center;
`;

Presale.ModalLink = styled(Link)`
  color: ${({ theme }) => theme.colors.green};
  text-transform: none;
  text-decoration: underline;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }
`;

Presale.NFTLink = styled(Link)`
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

Presale.ModalCountdown = styled(Countdown)`
  border-bottom: none;

  > h2:first-child {
    display: none;
  }
`;

Presale.Error = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  padding-top: 5px;
`;

Presale.Contracts = styled(Contracts)`
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding-top: 12px;
  }
`;

Presale.ContractText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  font-size: 16px;
`;

Presale.TermsLabel = styled.label`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding: 10px 0;
`;

Presale.Link = styled.a`
  color: ${({ theme }) => theme.colors.white};
  text-transform: lowercase;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }
`;
