import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { useWindowSize } from 'shared/hooks/useWindowSize';

export const LoginHeader = () => {
  const { isMobile } = useWindowSize();

  return (
    <>
      <LoginHeader.Wrapper>
        <div>
          <Link href="/">
            <Image
              src="/metalcore-logo.png"
              alt="METALCORE"
              width={isMobile ? '72' : '104'}
              height={isMobile ? '57' : '83'}
              data-qa="logo"
            />
          </Link>
        </div>
      </LoginHeader.Wrapper>
    </>
  );
};

LoginHeader.Wrapper = styled.header`
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  height: 94px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: ${({ theme }) => theme.colors.darkBlack};
  z-index: ${({ theme }) => theme.zIndex.header};
  padding: 12px 20px;
`;
