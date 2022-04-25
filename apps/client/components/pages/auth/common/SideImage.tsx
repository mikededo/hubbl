import React from 'react';

import Image from 'next/image';

import { notForwardOne } from '@hubbl/utils';
import { alpha, Box, styled, Typography } from '@mui/material';

type BarBallProps = { bgColor: string };

export const BarBall = styled(Box, {
  shouldForwardProp: notForwardOne('bgColor')
})<BarBallProps>(({ theme, bgColor }) => ({
  height: theme.spacing(1.75),
  width: theme.spacing(1.75),
  backgroundColor: bgColor,
  borderRadius: '50%'
}));

export const NavbarContainer = styled(Box)(({ theme }) => ({
  height: theme.spacing(5.25),
  backgroundColor: '#f8f8f8',
  width: '100%',
  display: 'flex',
  paddingLeft: theme.spacing(4),
  gap: theme.spacing(1),
  alignItems: 'center'
}));

export const NavbarSearch = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  backgroundColor: alpha('#94A3B8', 0.15),
  width: '100%',
  paddingLeft: theme.spacing(2),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderRadius: theme.spacing(1)
}));

export const NavbarSearchText = styled(Typography)({ cursor: 'default' });

export const Navbar = (): JSX.Element => (
  <NavbarContainer>
    <span>
      <BarBall bgColor="#ff605c" />
    </span>
    <span>
      <BarBall bgColor="#ffbd44" />
    </span>
    <span>
      <BarBall bgColor="#00ca4e" />
    </span>

    <NavbarSearch>
      <NavbarSearchText variant="subtitle1">
        https://www.hubbl.com/dashboard
      </NavbarSearchText>
    </NavbarSearch>
  </NavbarContainer>
);

export const ImageWrapper = styled(Box)({
  position: 'relative',
  height: 'calc(100% - 32px)',
  width: '100%'
});

export const DecorationWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '75%',
  width: '150%',
  transform: 'translateX(15%)',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  border: `${theme.spacing(1)} solid #FFF`,
  boxShadow: `0 0 ${theme.spacing(6)} rgba(122, 122, 122, 0.15)`
}));

export const Container = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: '#EBEEF5',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: { display: 'none' }
}));

const SideImage = (): JSX.Element => (
  <Container>
    <DecorationWrapper>
      <Navbar />

      <ImageWrapper>
        <Image
          src="/Dashboard.svg"
          alt="signup-dashboard-image"
          layout="fill"
          objectFit="cover"
          objectPosition="left"
        />
      </ImageWrapper>
    </DecorationWrapper>
  </Container>
);

export { SideImage };
