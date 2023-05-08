import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  @font-face {
    font-family: 'rajdhani';
    src: url('/fonts/Rajdhani/Rajdhani-Regular.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'rajdhani';
    src: url('/fonts/Rajdhani/Rajdhani-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'rajdhani';
    src: url('/fonts/Rajdhani/Rajdhani-Bold.ttf') format('truetype');
    font-weight: 900;
    font-style: normal;
  }

  @font-face {
    font-family: 'syncopate';
    src: url('/fonts/Syncopate/Syncopate-Regular.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'syncopate';
    src: url('/fonts/Syncopate/Syncopate-Bold.ttf') format('truetype');
    font-weight: 900;
    font-style: normal;
  }

  * {
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: #0B0D0C47;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #AEAEAE;
    outline: 1px solid #AEAEAE;
    border-radius: 2px;
  }

  html,
  body {
    font-family: 'rajdhani', sans-serif !important;
    padding: 0;
    margin: 0;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;
