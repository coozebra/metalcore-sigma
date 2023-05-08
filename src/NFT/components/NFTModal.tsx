import styled, { css } from 'styled-components';

import { Modal } from 'shared/components/Modal';
import { Text, H2, H3 } from 'shared/text';
import { INFT } from 'contracts/types/NFT';

interface INFTModal {
  nft?: INFT;
  onClose: () => void;
}

export const NFTModal = ({ nft, onClose }: INFTModal) => {
  const getAttribute = type => {
    const attribute = nft?.attributes?.find(attr => attr?.trait_type?.toLowerCase() === type);

    return typeof attribute?.value === 'number'
      ? attribute?.value
      : attribute?.value?.toLowerCase() || '';
  };

  const isVideo = nft?.image?.includes('.mp4');

  const rarity = getAttribute('rarity') as string;
  const combatRole = getAttribute('combat role') as string;
  const subClass = getAttribute('sub class name') as string;
  const faction = getAttribute('faction') as string;

  const weaponSlots = getAttribute('weapon slots') as number;
  const utilitySlots = getAttribute('utility slots') as number;
  const specialAbility = getAttribute('special ability') as string;

  const defense = (getAttribute('stats defense') as number) || 0;
  const offense = (getAttribute('stats offense') as number) || 0;
  const mobility = (getAttribute('stats mobility') as number) || 0;
  const versatility = (getAttribute('stats versatility') as number) || 0;

  const quote = getAttribute('character quote') as string;

  return (
    <NFTModal.Modal onClose={onClose}>
      <NFTModal.Wrapper>
        <NFTModal.AttributeRow>
          <NFTModal.Header $rarity={rarity}>{nft?.name}</NFTModal.Header>
          <NFTModal.SubHeader $rarity={rarity}>rarity: {rarity}</NFTModal.SubHeader>
          <NFTModal.Divider />
          <NFTModal.Text $bold>class: {combatRole}</NFTModal.Text>
          <NFTModal.Text $bold>subclass: {subClass}</NFTModal.Text>
          <NFTModal.Text $bold>faction: {faction}</NFTModal.Text>
          <NFTModal.Divider $half />
          <NFTModal.Text>
            defense: <NFTModal.Stars $value={defense} $rarity={rarity} />
          </NFTModal.Text>
          <NFTModal.Text>
            offense: <NFTModal.Stars $value={offense} $rarity={rarity} />
          </NFTModal.Text>
          <NFTModal.Text>
            mobility: <NFTModal.Stars $value={mobility} $rarity={rarity} />
          </NFTModal.Text>
          <NFTModal.Text>
            versatility: <NFTModal.Stars $value={versatility} $rarity={rarity} />
          </NFTModal.Text>
          <NFTModal.Divider $half />
          <NFTModal.Text>weapon slots: {weaponSlots}</NFTModal.Text>
          <NFTModal.Text>utility slots: {utilitySlots}</NFTModal.Text>
          <NFTModal.Text>special ability: {specialAbility}</NFTModal.Text>
          <NFTModal.Divider $half />
          <NFTModal.Text>
            <NFTModal.QuoteMark> &ldquo;</NFTModal.QuoteMark>
            {quote}
            <NFTModal.QuoteMark> &rdquo;</NFTModal.QuoteMark> - {nft?.name}
          </NFTModal.Text>
        </NFTModal.AttributeRow>
        <NFTModal.ImageRow>
          <NFTModal.ImageWrapper $isVideo={isVideo}>
            {isVideo ? (
              <NFTModal.Video autoPlay loop muted poster="metalcore-logo-icon.png" $rarity={rarity}>
                <source src={nft?.image} />
              </NFTModal.Video>
            ) : (
              <NFTModal.NFTImage src={nft?.image} $rarity={rarity} />
            )}
          </NFTModal.ImageWrapper>
        </NFTModal.ImageRow>
      </NFTModal.Wrapper>
    </NFTModal.Modal>
  );
};

NFTModal.Modal = styled(Modal)`
  height: 95vh;
  width: 95vw;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) {
    height: 100vh;
    width: 100vw;
  }
`;

NFTModal.Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 50px 2%;
  display: flex;
  flex-direction: row;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

NFTModal.Row = styled.div`
  display: flex;
  height: 100%;
  width: 50%;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    width: 75%;
  }
`;

NFTModal.AttributeRow = styled(NFTModal.Row)`
  flex-direction: column;
  justify-content: center;
  overflow: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) {
    order: 2;
    padding-top: 20px;
    justify-content: flex-start;
  }
`;

NFTModal.ImageRow = styled(NFTModal.Row)`
  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) {
    order: 1;
  }
`;

NFTModal.ImageWrapper = styled.div<{ $isVideo?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75%;

  ${({ $isVideo }) =>
    $isVideo &&
    css`
      width: 60%;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 60%;
  }
`;

NFTModal.NFTImage = styled.img<{ $rarity?: string }>`
  width: 100%;
  max-width: 540px;
  border-style: solid;
  border-width: 4px 4px 3px;
  border-radius: 1.5em 1.5em 0em 0px;
  border-color: ${({ theme }) => theme.colors.green};

  ${({ $rarity }) =>
    $rarity === 'uncommon' &&
    css`
      border-color: #00ff5a;
    `}

  ${({ $rarity }) =>
    $rarity === 'rare' &&
    css`
      border-color: #0065ff;
    `}

  ${({ $rarity }) =>
    $rarity === 'epic' &&
    css`
      border-color: #7800fa;
    `}

  ${({ $rarity }) =>
    $rarity === 'legendary' &&
    css`
      border-color: #fa7900;
    `}
`;

NFTModal.Video = styled.video<{ $rarity?: string }>`
  background: transparent url('metalcore-logo-icon.png') 50% 50% no-repeat;
  width: 100%;
  border-style: solid;
  border-width: 4px 4px 3px;
  border-radius: 1.5em 1.5em 0em 0px;
  border-color: ${({ theme }) => theme.colors.green};

  ${({ $rarity }) =>
    $rarity === 'uncommon' &&
    css`
      border-color: #00ff5a;
    `}

  ${({ $rarity }) =>
    $rarity === 'rare' &&
    css`
      border-color: #0065ff;
    `}

  ${({ $rarity }) =>
    $rarity === 'epic' &&
    css`
      border-color: #7800fa;
    `}

  ${({ $rarity }) =>
    $rarity === 'legendary' &&
    css`
      border-color: #fa7900;
    `}
`;

NFTModal.Header = styled(H2)<{ $rarity?: string }>`
  color: ${({ theme }) => theme.colors.white};
  padding-left: 10px;

  ${({ $rarity }) =>
    $rarity === 'uncommon' &&
    css`
      color: #00ff5a;
    `}

  ${({ $rarity }) =>
    $rarity === 'rare' &&
    css`
      color: #0065ff;
    `}

  ${({ $rarity }) =>
    $rarity === 'epic' &&
    css`
      color: #7800fa;
    `}

  ${({ $rarity }) =>
    $rarity === 'legendary' &&
    css`
      color: #fa7900;
    `}
`;

NFTModal.SubHeader = styled(H3)<{ $rarity?: string }>`
  color: ${({ theme }) => theme.colors.white};
  padding: 10px 0 10px 10px;

  ${({ $rarity }) =>
    $rarity === 'uncommon' &&
    css`
      color: #00ff5a;
    `}

  ${({ $rarity }) =>
    $rarity === 'rare' &&
    css`
      color: #0065ff;
    `}

  ${({ $rarity }) =>
    $rarity === 'epic' &&
    css`
      color: #7800fa;
    `}

  ${({ $rarity }) =>
    $rarity === 'legendary' &&
    css`
      color: #fa7900;
    `}
`;

NFTModal.Text = styled(Text)<{ $bold?: boolean }>`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  font-weight: 500;
  padding: 10px 0 10px 10px;

  ${({ $bold }) =>
    $bold &&
    css`
      font-weight: 800;
    `}
`;

NFTModal.QuoteMark = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 800;
  font-size: 20px;
`;

NFTModal.Divider = styled.div<{ $half?: boolean }>`
  border-top: 1px ${({ theme }) => theme.colors.lightGray} solid;
  height: 1px;
  width: calc(100% - 20px);
  margin: 10px 0 10px 10px;

  ${({ $half }) =>
    $half &&
    css`
      width: 75%;
    `}
`;

NFTModal.Stars = styled.div<{ $rarity?: string; $value?: number }>`
  display: inline-block;
  font-size: 1em;
  font-family: Times;
  line-height: 1;

  &::before {
    content: '★★★★★';
    letter-spacing: 3px;

    ${({ $value }) =>
      css`
        background: linear-gradient(
          90deg,
          #fc0 calc(${$value} / 5 * 100%),
          #fff calc(${$value} / 5 * 100%)
        );
      `}

    ${({ $rarity, $value }) =>
      $rarity === 'uncommon' &&
      css`
        background: linear-gradient(
          90deg,
          #00ff5a calc(${$value} / 5 * 100%),
          #fff calc(${$value} / 5 * 100%)
        );
      `}

    ${({ $rarity, $value }) =>
      $rarity === 'rare' &&
      css`
        background: linear-gradient(
          90deg,
          #0065ff calc(${$value} / 5 * 100%),
          #fff calc(${$value} / 5 * 100%)
        );
      `}

    ${({ $rarity, $value }) =>
      $rarity === 'epic' &&
      css`
        background: linear-gradient(
          90deg,
          #7800fa calc(${$value} / 5 * 100%),
          #fff calc(${$value} / 5 * 100%)
        );
      `}

    ${({ $rarity, $value }) =>
      $rarity === 'legendary' &&
      css`
        background: linear-gradient(
          90deg,
          #fa7900 calc(${$value} / 5 * 100%),
          #fff calc(${$value} / 5 * 100%)
        );
      `}

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
