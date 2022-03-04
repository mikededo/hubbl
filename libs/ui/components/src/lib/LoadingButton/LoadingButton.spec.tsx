import { render, screen } from '@testing-library/react';
import LoadingButton from './LoadingButton';

describe('<LoadingButton />', () => {
  it('should render properly', () => {
    const StartIcon = () => <div test-id="test-icon" />;

    const { container } = render(
      <LoadingButton label="Button Text" startIcon={<StartIcon />} />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Button Text')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should display the loading spinner', () => {
    const StartIcon = () => <div test-id="test-icon" />;

    const { container } = render(
      <LoadingButton label="Button Text" startIcon={<StartIcon />} loading />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Button Text')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
