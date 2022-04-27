import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAppContext } from '@hubbl/data-access/contexts';

import { AuthLayout, Pages } from '../../../components';

const { FormWrapper, SideImage } = Pages.Auth;

const LogIn = (): JSX.Element => {
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <AuthLayout>
      <FormWrapper />

      <SideImage />
    </AuthLayout>
  );
};

export default LogIn;
