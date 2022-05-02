import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { ClientFormFields } from '../../types';
import ClientPermissions from './ClientPermissions';

const Component = () => (
  <FormProvider {...useForm<ClientFormFields>()}>
    <ClientPermissions />
  </FormProvider>
);

describe('<ClientPermissions />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('client-covid-passport')).toBeInTheDocument();
  });
});
