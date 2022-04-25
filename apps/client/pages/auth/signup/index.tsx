import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAppContext } from '@hubbl/data-access/contexts';
import { Stack, Typography } from '@mui/material';

import { AuthLayout, Pages } from '../../../components';

const { SignUpForm } = Pages.SignUp;
const { FormWrapper, SideImage } = Pages.Auth;

const InitialFormState: Pages.SignUp.SignUpFormFields = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  code: ''
};

const SignUp = () => {
  const { user, API } = useAppContext();
  const router = useRouter();

  const handleOnSubmit = (data: Pages.SignUp.SignUpFormFields) => {
    API.signup('client', data);
  };

  useEffect(() => {
    /* Redirect user on mount */
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <AuthLayout>
      <FormWrapper>
        <Stack direction="column" gap={{ xs: 2, sm: 4 }}>
          <Stack gap={1.5}>
            <Typography variant="h2">Sign up</Typography>
            <Typography variant="subtitle1">
              Sign up to your gym and start working out!
            </Typography>
          </Stack>

          <Stack gap={1.5}>
            <SignUpForm
              initialFormState={InitialFormState}
              onSubmit={handleOnSubmit}
            />
          </Stack>
        </Stack>
      </FormWrapper>
      <SideImage />
    </AuthLayout>
  );
};

export default SignUp;
