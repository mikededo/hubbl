import { Stack, styled, Typography } from '@mui/material';

const Wrapper = styled(Stack)({ height: '100vh', width: '100vw' });

const Divider = styled('hr')(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  height: theme.spacing(4),
  width: theme.spacing(0.25)
}));

const Page404 = (): JSX.Element => (
  <Wrapper
    direction="row"
    spacing={2}
    alignItems="center"
    justifyContent="center"
  >
    <Typography variant="h2">404</Typography>
    <Divider />
    <Typography variant="body1">Page not found</Typography>
  </Wrapper>
);

export default Page404;
