import { render } from '@testing-library/react';
import ContentContainer from './ContentContainer';

describe('<ContentContainer />', () => {
  it('should render properly', () => {
    const { container } = render(<ContentContainer />);

    expect(container).toBeInTheDocument();
  });
});
