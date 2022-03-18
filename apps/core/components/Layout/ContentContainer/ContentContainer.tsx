import { Stack, styled } from '@mui/material';
import React from 'react';

const ContainerStack = styled(Stack)({
  height: '100vh',
  width: '100vw',
  overflow: 'hidden'
});

type ContentContainerProps = { children?: React.ReactNode };

const ContentContainer = ({ children }: ContentContainerProps): JSX.Element => (
  <ContainerStack direction="row" justifyContent="stretch" gap={4}>
    {children}
  </ContainerStack>
);

export default ContentContainer;
