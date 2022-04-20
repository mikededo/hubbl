import { render } from '@testing-library/react';

import HeaderCell from './HeaderCell';

describe('<HeaderCell />', () => {
  it('should render properly', () => {
    const { container } = render(<HeaderCell />);

    expect(container).toBeInTheDocument();
  });
});
