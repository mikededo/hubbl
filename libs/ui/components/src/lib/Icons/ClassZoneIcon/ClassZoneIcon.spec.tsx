import { render, screen } from '@testing-library/react';

import ClassZoneIcon from './ClassZoneIcon';

describe('<ClassZoneIcon />', () => {
  it('should render not being active', () => {
    render(<ClassZoneIcon />);

    expect(screen.getByLabelText('Non class zone')).toBeInTheDocument();
    expect(screen.getByTitle('non-class-zone')).toBeInTheDocument();
  });

  it('should render being active', () => {
    render(<ClassZoneIcon active />);

    expect(screen.getByLabelText('Class zone')).toBeInTheDocument();
    expect(screen.getByTitle('class-zone')).toBeInTheDocument();
  });
});
