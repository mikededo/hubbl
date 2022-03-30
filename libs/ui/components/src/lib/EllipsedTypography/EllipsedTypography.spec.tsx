import { render } from '@testing-library/react';

import EllipsedTypography from './EllipsedTypography';

describe('<EllipsedTypography />', () => {
  it('should render properly', () => {
    const { container } = render(<EllipsedTypography />);

    expect(container).toBeInTheDocument();
  });
});
