import { render } from '@testing-library/react';

import InputBase from './InputBase';

describe('<InputBase />', () => {
  it('should render properly', () => {
    const { container } = render(<InputBase />);

    expect(container).toBeInTheDocument();
  });
});
