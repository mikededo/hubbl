import { render } from '@testing-library/react';

import Anchor from './Anchor';

describe('<Anchor />', () => {
  it('should render properly', () => {
    const { container } = render(<Anchor />);
    expect(container).toBeInTheDocument();
  });
});