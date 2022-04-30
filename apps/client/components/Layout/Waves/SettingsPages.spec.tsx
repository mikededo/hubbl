import { render } from '@testing-library/react';
import SettingsPages from './SettingsPages';

describe('<SettingsPages />', () => {
  it('should render properly', () => {
    const { container } = render(
      <SettingsPages>
        <span />
      </SettingsPages>
    );

    expect(container).toBeInTheDocument();
  });
});
