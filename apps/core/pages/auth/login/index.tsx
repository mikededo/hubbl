import { Divider, Stack, Typography } from '@mui/material';
import { AuthLayout, Pages } from '../../../components';

const { FormWrapper, FormFooter, FooterLink, SideImage } = Pages.Auth;
const { Form } = Pages.LogIn;

const LogIn = () => {
  const handleOnSubmit = (data: Pages.LogIn.SignInFields) => {
    console.log(data);
  };

  return (
    <AuthLayout>
      <FormWrapper>
        <Stack gap={{ xs: 2, sm: 4 }}>
          <Stack gap={1.5}>
            <Typography variant="h2">Log in</Typography>
            <Typography variant="subtitle1">
              It has been a time. Welcome back!
            </Typography>
          </Stack>

          <Form onSubmit={handleOnSubmit} />

          <Divider />

          <FormFooter variant="subtitle2">
            Still without an account?{' '}
            <FooterLink href="/auth/signup">Sign up now!</FooterLink>
          </FormFooter>
        </Stack>
      </FormWrapper>

      <SideImage />
    </AuthLayout>
  );
};

export default LogIn;
