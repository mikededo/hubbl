import { render } from '@testing-library/react';
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
    const utils = render(
      <WorkerPermissionsViewer
        worker={{ firstName: 'Worker', lastName: 'Name' } as any}
      />
    );

    expect(utils.getByText('Worker Name')).toBeInTheDocument();
    expect(
      utils.queryByText('Click a worker to see their permissions')
    ).not.toBeInTheDocument();
  });
});
