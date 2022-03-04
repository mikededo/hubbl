import { render } from '@testing-library/react';

import ContentCard from './ContentCard';

describe('<ContentCard />', () => {
  it('should render properly', () => {
    const { container } = render(<ContentCard />);

    expect(container).toBeInTheDocument();
  });
});
