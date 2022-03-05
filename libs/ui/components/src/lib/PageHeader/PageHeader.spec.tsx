import { render, screen } from '@testing-library/react';

import PageHeader from './PageHeader';

describe('<PageHeader />', () => {
  it('should render properly', () => {
    const utils = render(
      <PageHeader breadcrumbs={[
        { href: '/page-one', label: 'PageOne'},
        { href: '/page-one/1', label: 'Item'},
      ]} title="PageHeader" />
    );

    expect(utils.container).toBeInTheDocument();
    
    // Check breadcrumbs
    const pageOne = screen.getByText('PageOne');
    expect(pageOne).toBeInTheDocument();
    expect(pageOne).toHaveAttribute('href', '/page-one')
    const item = screen.getByText('Item');
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute('href', '/page-one/1')

    const header = screen.getByText('PageHeader');
    expect(header).toBeInTheDocument()
    expect(header.tagName.toLowerCase()).toBe('h1')
  });
});
