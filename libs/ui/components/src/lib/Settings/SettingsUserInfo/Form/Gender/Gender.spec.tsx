import { FormProvider, useForm } from 'react-hook-form';

import { Gender as GenderEnum } from '@hubbl/shared/types';
import { fireEvent, render, screen } from '@testing-library/react';

import { SettingsUserInfoFields } from '../types';
import Gender from './Gender';
import { createTheme, ThemeProvider } from '@mui/material';

const MockComponent = ({ disabled }: { disabled: boolean }) => {
  const { control, ...rest } = useForm<SettingsUserInfoFields>({
    defaultValues: { gender: GenderEnum.OTHER }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <Gender disabled={disabled} />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<Gender />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(<MockComponent disabled={false} />);

    expect(container).toBeInTheDocument();
  });

  it('should display the genders on clicking the select', () => {
    render(<MockComponent disabled={false} />);
    fireEvent.mouseDown(screen.getByRole('button'));

    expect(screen.getByRole('option', { name: 'Man' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Woman' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument();
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(<MockComponent disabled />);

      expect(screen.getByPlaceholderText('Other')).toBeDisabled();
    });
  });
});
