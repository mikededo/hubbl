import { render } from '@testing-library/react';

import GenderCell from './GenderCell';

describe('<GenderCell />', () => {
  it('should render properly', () => {
    const { container } = render(<GenderCell />);
    expect(container).toBeInTheDocument();
  });
});