import { FC, ReactNode, ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';
import { render, RenderOptions } from '@testing-library/react';

import { theme } from 'styles/theme';

const AllProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

/**
 * NOTE: custom render to wrap global context providers
 * https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
