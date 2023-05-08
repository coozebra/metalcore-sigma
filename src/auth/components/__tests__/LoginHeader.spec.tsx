import { render, screen } from 'shared/testing/testUtils';
import { LoginHeader } from 'auth/components/LoginHeader';
import { useWindowSize } from 'shared/hooks/useWindowSize';

jest.mock('shared/hooks/useWindowSize');

describe('<LoginHeader />', () => {
  (useWindowSize as jest.Mock).mockReturnValue({ isMobile: jest.fn() });

  beforeEach(() => {
    render(<LoginHeader />);
  });

  it('renders metalcore logo', () => {
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });
});
