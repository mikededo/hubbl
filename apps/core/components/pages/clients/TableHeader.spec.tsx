import { render } from '@testing-library/react';
import TableHeader from './TableHeader';

describe('<TableHeader />', () => {
  it('should render the header', () => {
    const utils = render(
      <table>
        <thead>
          <TableHeader />
        </thead>
      </table>
    );

    expect(utils.getByText('First name')).toBeInTheDocument();
    expect(utils.getByText('Last name')).toBeInTheDocument();
    expect(utils.getByText('Email')).toBeInTheDocument();
    expect(utils.getByText('Phone')).toBeInTheDocument();
    expect(utils.getByText('Covid passport')).toBeInTheDocument();
    expect(utils.getByText('Gender')).toBeInTheDocument();
  });
});
