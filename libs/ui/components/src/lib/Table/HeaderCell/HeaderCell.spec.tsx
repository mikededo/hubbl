import { render } from '@testing-library/react';

import HeaderCell from './HeaderCell';

describe('<HeaderCell />', () => {
  it('should render properly', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <HeaderCell />
          </tr>
        </thead>
      </table>
    );

    expect(container).toBeInTheDocument();
  });
});
