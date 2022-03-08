import { render } from '@testing-library/react';

import SettingsCard from './SettingsCard';

describe('<SettingsCard />', () => {
  it('should render properly', () => {
    const { container } = render(<SettingsCard />);
    expect(container).toBeInTheDocument();
  });
});
