import React from 'react';

import { TrainerDTO } from '@hubbl/shared/models/dto';
import { Gender } from '@hubbl/shared/types';
import { Man, Woman } from '@mui/icons-material';
import { Stack, styled, Typography } from '@mui/material';

import ContentCard from '../../ContentCard';

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(1.5),
  width: theme.spacing(44),
  height: theme.spacing(10)
}));

const ContentStack = styled(Stack)({ height: '100%' });

export type DashboardTrainerProps = {
  /**
   * `Trainer` to display to the screen
   */
  trainer: TrainerDTO<number>;
};

const DashboardTrainer = ({ trainer }: DashboardTrainerProps): JSX.Element => (
  <PaddedContentCard>
    <ContentStack justifyContent="space-between">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {trainer.firstName} {trainer.lastName}
        </Typography>

        {trainer.gender !== Gender.WOMAN && (
          <Man
            titleAccess={
              trainer.gender === Gender.MAN ? 'man-trainer' : 'other-trainer'
            }
          />
        )}

        {trainer.gender === Gender.WOMAN && (
          <Woman titleAccess="woman-trainer" />
        )}
      </Stack>

      <Typography>{trainer.workerCode.substring(0, 10)}</Typography>
    </ContentStack>
  </PaddedContentCard>
);

export default DashboardTrainer;
