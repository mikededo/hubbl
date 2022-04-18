import { render, screen } from '@testing-library/react';

import MaskIcon from './MaskIcon';

describe('<MaskIcon />', () => {
  it('should render not being active', () => {
    render(<MaskIcon />);

    expect(screen.getByLabelText('Facial mask not required')).toBeInTheDocument();
    expect(screen.getByTitle('mask-not-required')).toBeInTheDocument();
  });

  it('should render being active', () => {
    render(<MaskIcon active />);

    expect(screen.getByLabelText('Facial mask required')).toBeInTheDocument();
    expect(screen.getByTitle('mask-required')).toBeInTheDocument();
  });
});
