import { css } from 'styled-components';

export const fadeIn = css`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  animation: fadeIn ease-out 200ms;
`;
