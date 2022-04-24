import { render } from '@testing-library/react';

import TableBodyRow from './TableBodyRow';

describe('<TableBodyRow />', () => {
  it('should render properly', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableBodyRow />
        </tbody>
      </table>
    );

    expect(container).toBeInTheDocument();
  });
});