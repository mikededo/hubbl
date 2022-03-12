import { render } from '@testing-library/react';

import BaseLayout from './BaseLayout';

describe('<BaseLayout />', () => {
  it('should render properly', () => {
    const { container } = render(
      <BaseLayout header="Test header" selected="dashboard">
        <div>Child</div>
      </BaseLayout>
    );

    expect(container).toBeInTheDocument();
  });
});
