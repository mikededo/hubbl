import { render } from '@testing-library/react';

import SideNavLink from './SideNavLink';

describe('<SideNavLink />', () => {
  it('should render successfully a <p /> if selected', () => {
    const utils = render(<SideNavLink label="Label" href="/" selected />);

    expect(utils.container).toBeInTheDocument();

    const element = utils.getByText('Label');
    expect(element).toBeInTheDocument();
    expect(element.tagName.toLowerCase()).toBe('p');
  });

  it('should render successfully a <a /> if not selected', () => {
    const utils = render(<SideNavLink label="Label" href="/" />);

    expect(utils.container).toBeInTheDocument();

    const element = utils.getByText('Label');
    expect(element).toBeInTheDocument();
    expect(element.tagName.toLowerCase()).toBe('a');
    expect(element).toHaveAttribute('href', '/');
  });
});
