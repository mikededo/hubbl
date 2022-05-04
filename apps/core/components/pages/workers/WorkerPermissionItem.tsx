import { Check, Close } from '@mui/icons-material';
import { Stack, styled, Typography } from '@mui/material';

const PermissionName = styled(Typography)({
  textTransform: 'uppercase',
  fontWeight: '500'
});

type WorkerPermissionItemProps = {
  /**
   * Name of the permission
   */
  name: string;

  /**
   * Whether the worker has the permission to create
   */
  create: boolean;

  /**
   * Whether the worker has the permission to update
   */
  update: boolean;

  /**
   * Whether the worker has the permission to rem
   */
  remove: boolean;
};

const WorkerPermissionItem = ({
  name,
  create,
  update,
  remove
}: WorkerPermissionItemProps) => (
  <Stack direction="column" gap={1}>
    <PermissionName>{name}</PermissionName>

    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row" gap={0.5} alignItems="center">
        {create ? <Check color="success" /> : <Close color="error" />}

        <Typography variant="body2">Create</Typography>
      </Stack>

      <Stack direction="row" gap={0.5} alignItems="center">
        {update ? <Check color="success" /> : <Close color="error" />}

        <Typography variant="body2">Update</Typography>
      </Stack>

      <Stack direction="row" gap={0.5} alignItems="center">
        {remove ? <Check color="success" /> : <Close color="error" />}

        <Typography variant="body2">Delete</Typography>
      </Stack>
    </Stack>
  </Stack>
);

export default WorkerPermissionItem;
