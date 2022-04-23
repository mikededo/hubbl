import { FormProvider, useForm } from 'react-hook-form';

import { TrainerTagDTO } from '@hubbl/shared/models/dto';
import { createTheme, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';

import { TrainerFormFields } from '../../types';
import TrainerTags from './TrainerTags';

const MockComponent = ({
  defaultValues,
  tags
}: {
  defaultValues?: Partial<TrainerFormFields>;
  tags?: Partial<TrainerTagDTO>[];
}) => {
  const { control, ...rest } = useForm<TrainerFormFields>({
    defaultValues: { tags: defaultValues?.tags ?? [] }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <TrainerTags tags={tags as any} />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<TrainerTags />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(<MockComponent />);

    expect(container).toBeInTheDocument();
  });

  it('should display the trainer tags on clicking the select', () => {
    render(
      <MockComponent
        tags={[
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
          defaultValues={{ tags: [2] }}
          tags={[
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
        screen.getByPlaceholderText('Select trainer tags')
      ).toBeDisabled();
    });
  });
});
