import { render } from '@testing-library/react';

import Signin from './index';

describe('Signin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Signin />);
    expect(baseElement).toBeTruthy();
  });
});
