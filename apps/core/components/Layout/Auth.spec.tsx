import { render } from '@testing-library/react';

import AuthLayout from './Auth';

describe('AuthLayout', () => {
  it('should call styled', () => {
    const { container } = render(<AuthLayout />);

    expect(container.firstChild).toHaveStyle('height: 100vh');
    expect(container.firstChild).toHaveStyle('width: 100vw');
    expect(container.firstChild).toHaveStyle('display: grid');
    expect(container.firstChild).toHaveStyle('gridTemplateColumns: 1fr 1fr');
    expect(container.firstChild).toHaveStyle('gap: 0');
  });
});
