import { useForm } from 'react-hook-form';

import { AppPalette } from '@hubbl/shared/types';
import { act, fireEvent, render, screen } from '@testing-library/react';

import ColorPicker from './ColorPicker';

const Component = () => {
  const { control, watch } = useForm<{ color: string }>();

  return (
    <>
      <ColorPicker control={control as any} name="color" />
      <span data-testid="result">{watch('color')}</span>
    </>
  );
};

describe('<ColorPicker />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
  });

  it('should render all the colors', () => {
    render(<Component />);

    expect(screen.getAllByRole('option').length).toBe(
      Object.keys(AppPalette).length
    );
  });

  it('should change to the seleted color', async () => {
    render(<Component />);

    await act(async () => {
      fireEvent.click(screen.getByTitle(AppPalette.BLUE));
    });

    expect(screen.getByTestId('result').innerHTML).toBe(AppPalette.BLUE);
  });
});
