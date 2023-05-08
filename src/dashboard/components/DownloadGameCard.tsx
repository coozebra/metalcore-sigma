import styled, { css } from 'styled-components';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';

import { CheckmarkIcon } from 'shared/components/CheckmarkIcon';
import { Card } from 'shared/components/Card';
import { H3, Text } from 'shared/text';
import { Button } from 'shared/components/Button';
import { IAccessKey } from 'dashboard/types/AccessKey';

export const DownloadGameCard = ({ accessKeys }: { accessKeys?: IAccessKey[] }) => {
  const [hasCopied, setHasCopied] = useState({});

  const handleAccessKeyCopy = (key: string) => {
    setHasCopied(prev => ({ ...prev, [key]: true }));

    setTimeout(() => setHasCopied(prev => ({ ...prev, [key]: false })), 3000);
  };

  return (
    <DownloadGameCard.Card>
      <DownloadGameCard.CardTitle>Access Keys</DownloadGameCard.CardTitle>
      <DownloadGameCard.CardDescription>
        {accessKeys ? (
          <DownloadGameCard.Text>
            Enjoy the experience by downloading the game on your computer with your unique access
            key. Please save this as you will need the key in the future to reactivate or deactivate
            your account. Since you joined early, you get two access keys for friends and family!
          </DownloadGameCard.Text>
        ) : (
          <DownloadGameCard.Text>
            You are not eligible for an access key. to see why, check out our{' '}
            <DownloadGameCard.Link
              aria-label="faq"
              href="https://metalcore.gg/faq"
              target="_blank"
              rel="noreferrer"
            >
              faq
            </DownloadGameCard.Link>{' '}
            and our{' '}
            <DownloadGameCard.Link
              aria-label="support"
              href="https://support.metalcore.gg"
              target="_blank"
              rel="noreferrer"
            >
              support
            </DownloadGameCard.Link>{' '}
            page.
          </DownloadGameCard.Text>
        )}
      </DownloadGameCard.CardDescription>
      {accessKeys?.map(accessKey => (
        <DownloadGameCard.AccessKeyWrapper key={accessKey?.key}>
          <CopyToClipboard text={accessKey?.key} onCopy={() => handleAccessKeyCopy(accessKey?.key)}>
            {hasCopied[accessKey?.key] ? (
              <DownloadGameCard.Checkmark />
            ) : (
              <DownloadGameCard.Copy
                src="/icons/copy-icon.png"
                height="25"
                width="25"
                alt="copy"
              />
            )}
          </CopyToClipboard>
          <DownloadGameCard.AccessKey $padded={hasCopied[accessKey?.key]}>
            {accessKey?.key}
          </DownloadGameCard.AccessKey>
        </DownloadGameCard.AccessKeyWrapper>
      ))}
      {accessKeys && (
        <DownloadGameCard.Link
          href="https://cdn.metalcore.gg/launcher/InfiniteLauncherInstaller-0.1.43.msix"
          target="_blank"
          rel="noreferrer"
        >
          <DownloadGameCard.Button primary slanted>
            download game
          </DownloadGameCard.Button>
        </DownloadGameCard.Link>
      )}
    </DownloadGameCard.Card>
  );
};

DownloadGameCard.Card = styled(Card)`
  background-color: ${({ theme }) => theme.colors.darkGreen};
  width: 600px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 100%;
  }
`;

DownloadGameCard.CardTitle = styled(H3)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 30px;
  text-align: center;
  padding-bottom: 50px;
`;

DownloadGameCard.CardDescription = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
  padding-bottom: 50px;
`;

DownloadGameCard.Link = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.green};
`;

DownloadGameCard.Button = styled(Button)`
  width: 280px;
  height: 32px;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  line-height: 16px;
  font-family: 'syncopate';
  letter-spacing: 0.065em;
`;

DownloadGameCard.Text = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
`;

DownloadGameCard.Checkmark = styled(CheckmarkIcon)`
  transform: scale(0.15);
  position: absolute;
  left: 112px;
`;

DownloadGameCard.Copy = styled(Image)`
  cursor: pointer;
`;

DownloadGameCard.AccessKeyWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.green};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  margin-bottom: 25px;
  position: relative;
  height: 50px;
`;

DownloadGameCard.AccessKey = styled(Text)<{ $padded?: boolean }>`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;

  ${({ $padded }) =>
    $padded &&
    css`
      padding-left: 26px;
    `}
`;
