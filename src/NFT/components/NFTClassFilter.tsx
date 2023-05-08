import styled, { css } from 'styled-components';
import Image from 'next/image';

import { H3 } from 'shared/text';
import { Button } from 'shared/components/Button';
import { NFT_CLASS } from 'NFT/enums/nft';

export const NFTClassFilter = ({ filters }) => {
  const isAerial = filters?.class === NFT_CLASS.aerial;
  const isInfantry = filters?.class === NFT_CLASS.infantry;
  const isMech = filters?.class === NFT_CLASS.mech;
  const isTank = filters?.class === NFT_CLASS.tank;

  return (
    <NFTClassFilter.Wrapper>
      <NFTClassFilter.Header>filters</NFTClassFilter.Header>
      <NFTClassFilter.Menu>
        <NFTClassFilter.MenuItem>
          <NFTClassFilter.Button
            $primary={isInfantry}
            secondary={!isInfantry}
            disabled={!isInfantry}
          >
            <Image src="/gallery/gallery_nav_infantry.png" height="16" width="16" alt="infantry" />
            infantry
          </NFTClassFilter.Button>
        </NFTClassFilter.MenuItem>
        <NFTClassFilter.MenuItem>
          <NFTClassFilter.Button $primary={isTank} secondary={!isTank} disabled={!isTank}>
            <Image src="/gallery/gallery_nav_tank.png" height="16" width="25" alt="tank" />
            tank
          </NFTClassFilter.Button>
        </NFTClassFilter.MenuItem>
        <NFTClassFilter.MenuItem>
          <NFTClassFilter.Button $primary={isAerial} secondary={!isAerial} disabled={!isAerial}>
            <Image src="/gallery/gallery_nav_aerial.png" height="16" width="25" alt="aerial" />
            aerial
          </NFTClassFilter.Button>
        </NFTClassFilter.MenuItem>
        <NFTClassFilter.MenuItem>
          <NFTClassFilter.Button $primary={isMech} secondary={!isMech} disabled={!isMech}>
            <Image src="/gallery/gallery_nav_mech.png" height="16" width="25" alt="mech" />
            mech
          </NFTClassFilter.Button>
        </NFTClassFilter.MenuItem>
        <NFTClassFilter.MenuItem>
          <NFTClassFilter.Button secondary disabled>
            select all
          </NFTClassFilter.Button>
        </NFTClassFilter.MenuItem>
        <NFTClassFilter.MenuItem>
          <NFTClassFilter.Button secondary disabled>
            clear
          </NFTClassFilter.Button>
        </NFTClassFilter.MenuItem>
      </NFTClassFilter.Menu>
    </NFTClassFilter.Wrapper>
  );
};

NFTClassFilter.Wrapper = styled.div`
  width: 100%;
  height: 75px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(18, 61, 52, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.green};

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) {
    padding: 0 5%;
    flex-direction: column;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    height: auto;
  }
`;

NFTClassFilter.Header = styled(H3)`
  color: ${({ theme }) => theme.colors.white};
`;

NFTClassFilter.Menu = styled.ul`
  display: flex;
  list-style: none;
  width: 90%;
  justify-content: space-evenly;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-wrap: wrap;
    margin: 0;
  }
`;

NFTClassFilter.MenuItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
`;

NFTClassFilter.Button = styled(Button)<{ $primary?: boolean }>`
  background-color: transparent;
  border: none;
  padding: 0;
  font-weight: 600;

  > span {
    margin-right: 8px !important;
  }

  ${({ $primary, theme }) =>
    $primary &&
    css`
      color: ${theme.colors.green};

      > span {
        color: ${theme.colors.green};
      }
    `}
`;
