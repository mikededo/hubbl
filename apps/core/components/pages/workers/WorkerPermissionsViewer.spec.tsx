import { fireEvent, render } from '@testing-library/react';

import WorkerPermissionsViewer from './WorkerPermissionsViewer';

describe('<WorkerPermissionsViewer />', () => {
  it('should render without a worker', () => {
    const utils = render(<WorkerPermissionsViewer />);

    expect(utils.getByText('Worker permissions')).toBeInTheDocument();
    expect(
      utils.getByText('Click a worker to see their permissions!')
    ).toBeInTheDocument();
  });

  it('should render with a worker', () => {
    const onEditSpy = jest.fn();
    const onUnselectSpy = jest.fn();

    const utils = render(
      <WorkerPermissionsViewer
        worker={{ firstName: 'Worker', lastName: 'Name' } as any}
        onEditClick={onEditSpy}
        onUnselectClick={onUnselectSpy}
      />
    );
    fireEvent.click(utils.getByLabelText('edit-worker'));
    fireEvent.click(utils.getByLabelText('unselect-worker'));

    expect(utils.getByText('Worker Name')).toBeInTheDocument();
    expect(
      utils.queryByText('Click a worker to see their permissions')
    ).not.toBeInTheDocument();
    expect(onEditSpy).toHaveBeenCalledTimes(1);
    expect(onUnselectSpy).toHaveBeenCalledTimes(1);
  });
});
