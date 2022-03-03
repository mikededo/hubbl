import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAppContext } from '@hubbl/data-access/contexts';

const Index = () => {
  const router = useRouter();
  const { user } = useAppContext();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  return <></>;
};

export default Index;
