import { render } from '@testing-library/react';

import AddItemPlaceholder from './AddItemPlaceholder';

describe('<AddItemPlaceholder />', () => {
  it('should render properly', () => {
    const { container } = render(
      <AddItemPlaceholder title="placeholder">Content</AddItemPlaceholder>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render properly with number height/width', () => {
    const utils = render(
      <AddItemPlaceholder title="placeholder" height={1} width={1}>
        Content
      </AddItemPlaceholder>
    );

    expect(utils.getByTitle('placeholder')).toBeInTheDocument();
  });
});
