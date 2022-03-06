import { fireEvent, render, screen } from '@testing-library/react';

import SettingsLogout from './SettingsLogout';

describe('<SettingsLogout />', () => {
  it('should render with header and subtitle', async () => {
    const onLogOutSpy = jest.fn();

    const { container } = render(
      <SettingsLogout
        header="Header"
        subtitle="Subtitle"
        onLogOut={onLogOutSpy}
      />
    );

    expect(container).toBeInTheDocument();

    const header = screen.getByText('Header');
    expect(header).toBeInTheDocument();
    expect(header.tagName.toLowerCase()).toBe('h6');
    const subtitle = screen.getByText('Subtitle');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.tagName.toLowerCase()).toBe('p');

    fireEvent.click(screen.getByText('Log out'));
    expect(onLogOutSpy).toHaveBeenCalledTimes(1);
  });

  it('should render without subtitle', async () => {
    const { container } = render(
      <SettingsLogout header="Header" onLogOut={undefined} />
    );

    expect(container).toBeInTheDocument();
    expect(screen.queryByText('Subtitle')).not.toBeInTheDocument();
  });
});
