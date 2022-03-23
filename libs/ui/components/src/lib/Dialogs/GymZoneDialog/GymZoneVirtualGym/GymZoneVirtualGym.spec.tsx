import { FormProvider, useForm } from 'react-hook-form';

import { fireEvent, render, screen } from '@testing-library/react';

import { GymZoneFormFields } from '../../types';
import GymZoneVirtualGym from './GymZoneVirtualGym';
import { createTheme, ThemeProvider } from '@mui/material';
import { VirtualGymDTO } from '@hubbl/shared/models/dto';

const MockComponent = ({
  defaultValues,
  virtualGyms
}: {
  defaultValues?: Partial<GymZoneFormFields>;
  virtualGyms?: Partial<VirtualGymDTO>[];
}) => {
  const { control, ...rest } = useForm<GymZoneFormFields>({
    defaultValues: { virtualGym: defaultValues?.virtualGym ?? '' }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <GymZoneVirtualGym virtualGyms={virtualGyms as any} />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<GymZoneVirtualGym />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(<MockComponent />);

    expect(container).toBeInTheDocument();
  });

  it('should display the virtual gyms on clicking the select', () => {
    render(
      <MockComponent
        virtualGyms={[
          { id: 1, name: 'One' },
          { id: 2, name: 'Two' },
          { id: 3, name: 'Three' },
          { id: 4, name: 'Four' }
        ]}
      />
    );
    fireEvent.mouseDown(screen.getByRole('button'));

    expect(screen.getByRole('option', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Two' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Three' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Four' })).toBeInTheDocument();
  });

  describe('defaultValues', () => {
    it('should use default value', () => {
      render(
        <MockComponent
          defaultValues={{ virtualGym: 2 }}
          virtualGyms={[
            { id: 1, name: 'One' },
            { id: 2, name: 'Two' }
          ]}
        />
      );

      expect(screen.getByText('Two')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(<MockComponent />);

      expect(
        screen.getByPlaceholderText('Select a virtual gym')
      ).toBeDisabled();
    });
  });
});
