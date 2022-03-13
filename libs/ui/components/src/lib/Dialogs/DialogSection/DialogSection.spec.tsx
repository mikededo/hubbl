import { render } from '@testing-library/react';

import DialogSection from './DialogSection';

describe('<DialogSection />', () => {
  it('should render with regular padding', () => {
    const { container } = render(<DialogSection />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle({ padding: '16px 24px' });
  });

  it('should render with footer padding', () => {
    const { container } = render(<DialogSection footer />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle({ padding: '24px 24px' });
  });
});
