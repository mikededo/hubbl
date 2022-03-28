import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import { Stack, styled } from '@mui/material';

import ContentCard from '../../ContentCard';
import DifficultyStack from '../../DifficultyStack';
import DashboardCommonEvent from './DashboardCommonEvent';

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
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

      <DifficultyStack difficulty={event.difficulty} />
    </ContentStack>
  </PaddedContentCard>
);

export default DashboardEvent;
