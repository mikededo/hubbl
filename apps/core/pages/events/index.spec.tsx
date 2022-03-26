import { render } from '@testing-library/react';

import Events from './index';

describe('Events', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Events />);

    expect(baseElement).toBeTruthy();
  });
});
