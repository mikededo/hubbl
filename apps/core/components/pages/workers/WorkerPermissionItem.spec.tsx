import { render } from '@testing-library/react';

import WorkerPermissionItem from './WorkerPermissionItem';

describe('<WorkerPermissionItem />', () => {
  it('should render properly', () => {
    const utils = render(
      <WorkerPermissionItem name="Permission" create update remove />
    );

    expect(utils.getByText('Permission')).toBeInTheDocument();
    expect(utils.getByText('Create')).toBeInTheDocument();
    expect(utils.getByText('Update')).toBeInTheDocument();
    expect(utils.getByText('Delete')).toBeInTheDocument();

    expect(utils.getAllByTestId('CheckIcon').length).toBe(3);
  });

  it('should render the opposite icons', () => {
    const utils = render(
      <WorkerPermissionItem
        name="Permission"
        create={false}
        update={false}
        remove={false}
      />
    );

    expect(utils.getByText('Permission')).toBeInTheDocument();
    expect(utils.getByText('Create')).toBeInTheDocument();
    expect(utils.getByText('Update')).toBeInTheDocument();
    expect(utils.getByText('Delete')).toBeInTheDocument();

    expect(utils.getAllByTestId('CloseIcon').length).toBe(3);
  });
});
