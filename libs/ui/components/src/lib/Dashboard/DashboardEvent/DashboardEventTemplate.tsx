import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import { LocalFireDepartment as Fire } from '@mui/icons-material';
import { Stack, styled } from '@mui/material';

import ContentCard from '../../ContentCard';
import DashboardCommonEvent from './DashboardCommonEvent';

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(1.5),
  width: theme.spacing(44),
  height: theme.spacing(10)
}));

const ContentStack = styled(Stack)({ height: '100%' });

export type DashboardEventProps = {
  /**
   * `Event` to display to the screen
   */
  event: EventTemplateDTO;
};

const DashboardEvent = ({ event }: DashboardEventProps): JSX.Element => (
  <PaddedContentCard>
    <ContentStack justifyContent="space-between">
      <DashboardCommonEvent event={event} />

      <Stack direction="row">
        <Fire
          key="difficulty-one"
          titleAccess="difficulty-one"
          color="primary"
        />
        <Fire
          key="difficulty-two"
          titleAccess="difficulty-two"
          color={event.difficulty >= 2 ? 'primary' : 'disabled'}
        />
        <Fire
          key="difficulty-three"
          titleAccess="difficulty-three"
          color={event.difficulty >= 3 ? 'primary' : 'disabled'}
        />
        <Fire
          key="difficulty-four"
          titleAccess="difficulty-four"
          color={event.difficulty >= 4 ? 'primary' : 'disabled'}
        />
        <Fire
          key="difficulty-five"
          titleAccess="difficulty-five"
          color={event.difficulty >= 5 ? 'primary' : 'disabled'}
        />
      </Stack>
    </ContentStack>
  </PaddedContentCard>
);

export default DashboardEvent;
