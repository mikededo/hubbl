import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { render } from '@testing-library/react';

import ClickableEndAdornment from './ClickableEndAdornment';

describe('<ClickableEndAdornment />', () => {
  it('should render the visible icon', () => {
    const { container } = render(
      <ClickableEndAdornment
        label="Visibility icon"
        visibleIcon={<VisibilityOutlined />}
        notVisibleIcon={<VisibilityOffOutlined />}
        onClick={jest.fn()}
        visible
      />
    );

    expect(container).toBeInTheDocument();
  });

  it('should render the not visible icon', () => {
    const { container } = render(
      <ClickableEndAdornment
        label="Visibility icon"
        visibleIcon={<VisibilityOutlined />}
        notVisibleIcon={<VisibilityOffOutlined />}
        onClick={jest.fn()}
        visible={false}
      />
    );

    expect(container).toBeInTheDocument();
  });
});
