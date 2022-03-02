import { render } from '@testing-library/react';
import UserSwitch from './UserSwitch';

describe('<UserSwitch />', () => {
  it('should render successfully', () => {
    const utils = render(<UserSwitch owner onClick={undefined} />);

    expect(utils.container).toBeInTheDocument();
  });
});
