import { render } from '@testing-library/react';

import LogIn from './index';

describe('LogIn', () => {
  it('should render', () => {
    const utils = render(<LogIn />);

    expect(utils.container).toBeInTheDocument();
  });
});
