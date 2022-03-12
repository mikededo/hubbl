import { render } from '@testing-library/react';

import CoreSideNav from './CoreSideNav';

describe('<CoreSideNav />', () => {
  it('should render properly', () => {
    // The component is not furtherly tested, as it does not
    // add more complexity other than what the SideNav component
    // does, which has already the required tests
    const { container } = render(
      <CoreSideNav header="Test header" selected="dashboard" />
    );

    expect(container).toBeInTheDocument();
  });
});
