import { AnimatePresence, motion } from 'framer-motion';

import { WorkerDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler } from '@hubbl/shared/types';
import { SideToggler } from '@hubbl/ui/components';
import { Close, Edit } from '@mui/icons-material';
import { Divider, IconButton, Stack, styled, Typography } from '@mui/material';

import WorkerPermissions from './WorkerPermissions';

const PaddedStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  height: '100%',
  overflow: 'auto'
}));

const ContentContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflowX: 'hidden'
});

const EmptyText = styled(Typography)({ textAlign: 'center', margin: 'auto' });

type WorkerPermissionsViewerProps = {
  /**
   * Worker to display the props of. If no worker is passed a
   * placeholder text is displayed and the edit/unselect icons
   * are not shown
   *
   * @default undefined
   */
  worker?: WorkerDTO<number>;

  /**
   * Callback to run when the edit icon has been clicked
   *
   * @default undefined
   */
  onEditClick?: EmptyHandler;

  /**
   * Callback to run when the unselect icon has been clicked
   *
   * @default undefined
   */
  onUnselectClick?: EmptyHandler;
};

const WorkerPermissionsViewer = ({
  worker,
  onEditClick,
  onUnselectClick
}: WorkerPermissionsViewerProps): JSX.Element => (
  <SideToggler
    showLabel="Show worker permissions"
    hideLabel="Hide worker permissions"
  >
    <PaddedStack gap={1.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" noWrap>
          {worker
            ? `${worker.firstName} ${worker.lastName}`
            : 'Worker permissions'}
        </Typography>

        <Stack direction="row" gap={1}>
          <IconButton
            aria-label="edit-worker"
            size="small"
            disabled={!worker}
            onClick={onEditClick}
          >
            <Edit />
          </IconButton>

          <IconButton
            aria-label="unselect-worker"
            size="small"
            disabled={!worker}
            onClick={onUnselectClick}
          >
            <Close />
          </IconButton>
        </Stack>
      </Stack>

      <Divider />

      <ContentContainer>
        <AnimatePresence>
          {worker && (
            <motion.div
              style={{ position: 'absolute', top: '0' }}
              initial={{ left: '200%' }}
              animate={{ left: '0%' }}
              exit={{ left: '200%' }}
              transition={{ type: 'spring', stiffness: 700, damping: 50 }}
            >
              <Stack direction="column" gap={1.5}>
                <WorkerPermissions worker={worker} />
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!worker && (
            <motion.div
              style={{ position: 'absolute', top: '0', width: '100%' }}
              initial={{ right: '200%' }}
              animate={{ right: '0%' }}
              exit={{ right: '200%' }}
              transition={{ type: 'spring', stiffness: 700, damping: 50 }}
            >
              <EmptyText variant="subtitle1">
                Click a worker to see their permissions!
              </EmptyText>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentContainer>
    </PaddedStack>
  </SideToggler>
);

export default WorkerPermissionsViewer;
