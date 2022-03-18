import { useForm } from 'react-hook-form';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TimeInput from './TimeInput';

const Component = () => {
  const { register } = useForm();

  return (
    <TimeInput
      label="Time input"
      registerResult={register('input')}
      placeholder="12:34"
      title="time-input"
    />
  );
};

const typeAndExpect = async (typed: string, expected: string) => {
  render(<Component />);

  await act(async () => {
    userEvent.type(screen.getByPlaceholderText('12:34'), typed);
  });

  expect(screen.getByPlaceholderText('12:34')).toHaveValue(expected);
};

describe('<TimeInput />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Time input')).toBeInTheDocument();
    expect(screen.getByTitle('time-input')).toBeInTheDocument();
  });

  it('should render with error styles', () => {
    const Component = () => {
      const { register } = useForm();

      return (
        <TimeInput
          label="Time input"
          registerResult={register('input')}
          placeholder="12:34"
          title="time-input"
          error
        />
      );
    };
    render(<Component />);

    expect(screen.getByPlaceholderText('12:34').style.boxShadow).toBeDefined();
  });

  it('should normalize the time', async () => {
    await typeAndExpect('2345', '23:45');
  });

  it('should only accept valid times', async () => {
    await typeAndExpect('2500', '20:0');
  });
});
