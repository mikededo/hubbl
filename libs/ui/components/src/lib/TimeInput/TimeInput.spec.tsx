import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import TimeInput from './TimeInput';

const Component = () => {
  const { register } = useForm();

  return (
    <TimeInput
      label="Time input"
      registerResult={register('input')}
      title="time-input"
    />
  );
};

describe('<TimeInput />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Time input')).toBeInTheDocument();
    expect(screen.getByTitle('time-input')).toBeInTheDocument();
  });
});
