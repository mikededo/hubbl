import { render, screen } from '@testing-library/react';

import DatePicker from './DatePicker';

describe('<DatePicker />', () => {
  jest.useFakeTimers().setSystemTime(new Date('2022-06-01'));

  it('should change date properly', async () => {
    render(
      <DatePicker name="calendar" value={new Date()} onChangeDate={jest.fn()} />
    );

    expect(screen.getByPlaceholderText('dd/mm/yyyy')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('dd/mm/yyyy')).toHaveValue('01/06/2022');
  });

  it('should render with error styles', () => {
    render(
      <DatePicker
        name="calendar"
        value={new Date()}
        onChangeDate={jest.fn()}
        error
      />
    );

    expect(
      screen.getByPlaceholderText('dd/mm/yyyy').style.boxShadow
    ).toBeDefined();
  });
});
