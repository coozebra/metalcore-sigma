import styled from 'styled-components';

import { WelcomeCard } from 'dashboard/components/WelcomeCard';
import { NFTsGallery } from 'dashboard/components/NFTs/NFTsGallery';
import { INFT } from 'dashboard/types/NFT';

export const NFTs = ({ data }: { data: INFT[] }) => {
  return (
    <NFTs.Wrapper>
      <NFTs.Header>
        <WelcomeCard />
      </NFTs.Header>
      <NFTs.Body>
        <NFTsGallery NFTs={data} />
      </NFTs.Body>
    </NFTs.Wrapper>
  );
};

NFTs.Wrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.black};
  background-image: url('/dashboard/dashboard-background.png');
  background-size: cover;
  display: grid;
  align-items: center;
  grid-gap: 30px;
  padding: 0;
  padding-top: 24px;
`;

NFTs.Header = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
`;

NFTs.Body = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: end;
`;
