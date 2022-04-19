import { render } from '@testing-library/react';

import Trainers from './index';

describe('Trainers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Trainers />);
    expect(baseElement).toBeTruthy();
  });
});
