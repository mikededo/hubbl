import { Controller } from 'react-hook-form';

import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { PersonFormFields, WorkerFormFields } from '../../types';

export type WorkerPermissionChecksProps = {
  name: string;

  /**
   * Name of the create property of the form
   */
  create?: keyof Omit<WorkerFormFields, keyof PersonFormFields>;

  /**
   * Name of the update property of the form
   */
  update?: keyof Omit<WorkerFormFields, keyof PersonFormFields>;

  /**
   * Name of the delete property of the form
   */
  remove?: keyof Omit<WorkerFormFields, keyof PersonFormFields>;
};

const WorkerPermissionChecks = ({
  name,
  create,
  update,
  remove
}: WorkerPermissionChecksProps): JSX.Element => (
  <Stack>
    <Typography fontWeight="500">{name}</Typography>

    <Stack direction="row" alignItems="center" justifyContent="space-between">
      {create && (
        <FormControlLabel
          control={
            <Controller<WorkerFormFields>
              name={create}
              defaultValue={false}
              render={({ field: { name, value, onChange } }) => (
                <Checkbox
                  name={name}
                  title={`worker-${create}`}
                  checked={Boolean(value)}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          }
          label="Create"
        />
      )}

      {update && (
        <FormControlLabel
          control={
            <Controller<WorkerFormFields>
              name={update}
              defaultValue={false}
              render={({ field: { name, value, onChange } }) => (
                <Checkbox
                  name={name}
                  title={`worker-${update}`}
                  checked={Boolean(value)}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          }
          label="Update"
        />
      )}

      {remove && (
        <FormControlLabel
          control={
            <Controller<WorkerFormFields>
              name={remove}
              defaultValue={false}
              render={({ field: { name, value, onChange } }) => (
                <Checkbox
                  name={name}
                  title={`worker-${remove}`}
                  checked={Boolean(value)}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          }
          label="Delete"
        />
      )}
    </Stack>
  </Stack>
);

export default WorkerPermissionChecks;
