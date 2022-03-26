import { Stack, styled } from '@mui/material';
import React from 'react';

const ContainerStack = styled(Stack)({
  height: '100vh',
  width: '100vw',
  overflow: 'hidden'
});

type ContentContainerProps = {
  /**
   * Children of the content
   */
  children?: React.ReactNode;
};

const ContentContainer = ({ children }: ContentContainerProps): JSX.Element => (
  <ContainerStack
    direction="row"
    justifyContent="stretch"
    gap={{
      xs: 0,
      sm: 1,
      md: 2,
      lg: 4,
      xl: 4
    }}
    sx={{ transition: 'gap 0.25s ease-in-out' }}
  >
    {children}
  </ContainerStack>
);

export default ContentContainer;
