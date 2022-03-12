import { render } from '@testing-library/react';

import AddItemPlaceholder from './AddItemPlaceholder';

describe('<AddItemPlaceholder />', () => {
  it('should render properly', () => {
    const { container } = render(
      <AddItemPlaceholder>Content</AddItemPlaceholder>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render properly with number height/width', () => {
    const { container } = render(
      <AddItemPlaceholder height={1} width={1}>
        Content
      </AddItemPlaceholder>
    );

    expect(container).toBeInTheDocument();
  });
});
