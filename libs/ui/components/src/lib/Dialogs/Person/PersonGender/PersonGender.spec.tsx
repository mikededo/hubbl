import { FormProvider, useForm } from 'react-hook-form';

import { Gender as GenderEnum } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';

import { PersonFormFields } from '../../types';
import PersonGender from './PersonGender';

const MockComponent = ({ disabled }: { disabled?: boolean }) => {
  const { control, ...rest } = useForm<PersonFormFields>({
    defaultValues: { gender: GenderEnum.OTHER }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <PersonGender disabled={disabled} />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<PersonGender />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(<MockComponent />);

    expect(container).toBeInTheDocument();
  });

  it('should display the genders on clicking the input', () => {
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
