import { FormProvider, useForm } from 'react-hook-form';

import { Gender as GenderEnum } from '@hubbl/shared/types';
import { fireEvent, render, screen } from '@testing-library/react';

import { SettingsUserInfoFields } from '../types';
import Gender from './Gender';

const MockComponent = () => {
  const { control, ...rest } = useForm<SettingsUserInfoFields>({
    defaultValues: { gender: GenderEnum.OTHER }
  });

  return (
    <FormProvider {...{ control, ...rest }}>
      <Gender />
    </FormProvider>
  );
};

describe('<Gender />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(<MockComponent />);

    expect(container).toBeInTheDocument();
  });

  it('should display the genders on clicking the select', () => {
    render(<MockComponent />);
    fireEvent.mouseDown(screen.getByRole('button'));

    expect(screen.getByRole('option', { name: 'Man' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Woman' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument();
  });
});
