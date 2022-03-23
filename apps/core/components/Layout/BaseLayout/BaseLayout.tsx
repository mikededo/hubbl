import ContentContainer from '../ContentContainer';
import CoreSideNav, { CoreSideNavProps } from '../CoreSideNav';
import { styled, Box, Stack } from '@mui/material';
import React from 'react';
import { notForwardOne } from '@hubbl/utils';

const MainContentContainer = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  width: '100%',
  padding: theme.spacing(6, 4, 4)
}));

type ContentStackProps = {
  /**
   * Whether the layout is width limited or fully expanded
   *
   * @default false
   */
  expanded?: boolean;
};

const ContentStack = styled(Stack, {
  shouldForwardProp: notForwardOne('expanded')
})<ContentStackProps>(({ theme, expanded }) => ({
  maxWidth: expanded ? undefined : theme.spacing(140)
}));

type BaseLayoutProps = {
  children?: React.ReactNode;
} & ContentStackProps &
  CoreSideNavProps;

const BaseLayout = ({
  children,
  expanded,
  header,
  selected
}: BaseLayoutProps) => (
  <ContentContainer>
    <CoreSideNav header={header} selected={selected} />

    <MainContentContainer>
      <ContentStack direction="column" gap={3} expanded={expanded}>
        {children}
      </ContentStack>
    </MainContentContainer>
  </ContentContainer>
);

export default BaseLayout;
