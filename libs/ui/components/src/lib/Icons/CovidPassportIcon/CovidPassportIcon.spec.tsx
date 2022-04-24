import { render, screen } from '@testing-library/react';

import CovidPassportIcon from './CovidPassportIcon';

describe('<CovidPassportIcon />', () => {
  it('should render not being active', () => {
    render(<CovidPassportIcon />);

    expect(
      screen.getByLabelText('Covid passport not required')
    ).toBeInTheDocument();
    expect(screen.getByTitle('passport-not-required')).toBeInTheDocument();
  });

  it('should render being active', () => {
    render(<CovidPassportIcon active />);

    expect(screen.getByLabelText('Covid passport required')).toBeInTheDocument();
    expect(screen.getByTitle('passport-required')).toBeInTheDocument();
  });
});