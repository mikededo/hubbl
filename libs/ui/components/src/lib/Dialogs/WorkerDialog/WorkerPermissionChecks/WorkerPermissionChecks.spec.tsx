import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { WorkerFormFields } from '../../types';

import WorkerPermissionChecks from './WorkerPermissionChecks';

describe('<WorkerPermissionChecks />', () => {
  it('should render properly', () => {
    const { container } = render(
      <WorkerPermissionChecks name="Worker permissions" />
    );

    expect(container).toBeInTheDocument();
  });

  it('should render the checkpoints', () => {
    const Component = () => {
      const methods = useForm<WorkerFormFields>();

      return (
        <FormProvider {...methods}>
          <WorkerPermissionChecks
            name="Worker permissions"
            create="createGymZones"
            update="updateGymZones"
            remove="deleteGymZones"
          />
        </FormProvider>
      );
    };

    const utils = render(<Component />);

    expect(utils.container).toBeInTheDocument();
    expect(utils.getByTitle('worker-createGymZones')).toBeInTheDocument();
    expect(utils.getByTitle('worker-updateGymZones')).toBeInTheDocument();
    expect(utils.getByTitle('worker-deleteGymZones')).toBeInTheDocument();
  });
});
