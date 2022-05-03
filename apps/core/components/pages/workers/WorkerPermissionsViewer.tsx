import { WorkerDTO } from '@hubbl/shared/models/dto';
import { SideToggler } from '@hubbl/ui/components';
import { Divider, Stack, styled, Typography } from '@mui/material';

import WorkerPermissions from './WorkerPermissions';

const PaddedStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  height: '100%',
  overflow: 'auto'
}));

const EmptyText = styled(Typography)({ textAlign: 'center', margin: 'auto' });

type WorkerPermissionsViewerProps = {
  worker?: WorkerDTO<number>;
};

const WorkerPermissionsViewer = ({
  worker
}: WorkerPermissionsViewerProps): JSX.Element => (
  <SideToggler
    showLabel="Show worker permissions"
    hideLabel="Hide worker permissions"
  >
    <PaddedStack gap={1.5}>
      <Typography variant="h5">
        {worker
          ? `${worker.firstName} ${worker.lastName}`
          : 'Worker permissions'}
      </Typography>

      <Divider />

      {worker ? (
        <WorkerPermissions worker={worker} />
      ) : (
        <EmptyText textAlign="center" margin="auto" variant="subtitle1">
          Click a worker to see their permissions!
        </EmptyText>
      )}
    </PaddedStack>
  </SideToggler>
);

export default WorkerPermissionsViewer;
