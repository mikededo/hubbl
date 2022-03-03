import { useAppContext } from '@hubbl/data-access/contexts';
import { Divider, Stack, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthLayout, Pages } from '../../../components';

const { FormWrapper, FormFooter, FooterLink, SideImage } = Pages.Auth;
const { Form } = Pages.LogIn;

const LogIn = () => {
  const { user, API } = useAppContext();
  const router = useRouter();

  const handleOnSubmit = (data: Pages.LogIn.SignInFields) => {
    API.login(data.owner ? 'owner' : 'worker', {
      email: data.email,
      password: data.password
    });
  };

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

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

          <AnimatePresence>
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Form onSubmit={handleOnSubmit} />
            </motion.section>
          </AnimatePresence>

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
