import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { Stack, styled, Typography } from '@mui/material';

import ContentCard from '../../ContentCard';

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(3),
  width: theme.spacing(44),
  height: theme.spacing(25)
}));

const ContentStack = styled(Stack)({ height: '100%' });

export type DashboardVirtualGymProps = {
  /**
   * `VirtualGym` to display to the screen
   */
  virtualGym: VirtualGymDTO;
};

const DashboardVirtualGym = ({ virtualGym }: DashboardVirtualGymProps) => (
  <PaddedContentCard>
    <ContentStack justifyContent="space-between">
      <Stack gap={1}>
        <Typography variant="h6">{virtualGym.name.toUpperCase()}</Typography>
        <Typography>{virtualGym.description}</Typography>
      </Stack>

      <Stack gap={1}>
        <Typography>
          {virtualGym.openTime} - {virtualGym.closeTime}
        </Typography>
        <Typography>{virtualGym.location}</Typography>
      </Stack>
    </ContentStack>
  </PaddedContentCard>
);

export default DashboardVirtualGym;
