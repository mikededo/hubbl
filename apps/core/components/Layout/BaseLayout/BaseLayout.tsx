import ContentContainer from '../ContentContainer';
import CoreSideNav, { CoreSideNavProps } from '../CoreSideNav';
import { styled, Box, Stack } from '@mui/material';
import React from 'react';

const MainContentContainer = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  width: '100%',
  padding: theme.spacing(6, 4, 4)
}));

const ContentStack = styled(Stack)(({ theme }) => ({
  maxWidth: theme.spacing(140)
}));

type BaseLayoutProps = {
  children?: React.ReactNode;
} & CoreSideNavProps;

const BaseLayout = ({ children, header, selected }: BaseLayoutProps) => (
  <ContentContainer>
    <CoreSideNav header={header} selected={selected} />

    <MainContentContainer>
      <ContentStack>{children}</ContentStack>
    </MainContentContainer>
  </ContentContainer>
);

export default BaseLayout;
