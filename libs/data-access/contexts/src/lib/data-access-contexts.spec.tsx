import { render } from '@testing-library/react';

import DataAccessContexts from './data-access-contexts';

describe('DataAccessContexts', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DataAccessContexts />);
    expect(baseElement).toBeTruthy();
  });
});
