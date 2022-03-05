import { Gender } from '@hubbl/shared/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import SelectInput from './SelectInput';

type Fields = { gender: Gender };

const Options = [
  { key: 'man', value: Gender.MAN, label: 'Man' },
  { key: 'woman', value: Gender.WOMAN, label: 'Woman' },
  {
    key: 'other',
    value: Gender.OTHER,
    label: 'Other'
  }
];

const MockComponent = ({ variant }: { variant?: 'h6' | 'body1' }) => {
  const { control } = useForm<Fields>({
    defaultValues: { gender: Gender.OTHER }
  });

  return (
    <SelectInput
      control={control}
      label="SelectInput"
      formName="gender"
      options={Options}
      labelVariant={variant}
    />
  );
};

describe('<SelectInput />', () => {
  it('should render properly', () => {
    const { container } = render(<MockComponent />);

    expect(container).toBeInTheDocument();
  });

  it('should display all the options on focus', () => {
    render(<MockComponent />);
    fireEvent.mouseDown(screen.getByRole('button'));

    expect(screen.getByRole('option', { name: 'Man' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Woman' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument();
  });

  it('should display an h6 styled label', () => {
    render(<MockComponent />);

    const label = screen.getByText('SelectInput');
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ 'font-weight': 500 });
  });

  it('should display a p styled label', () => {
    render(<MockComponent variant="body1" />);

    const label = screen.getByText('SelectInput');
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ 'font-weight': 400 });
  });
});
