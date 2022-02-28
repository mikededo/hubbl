import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth/signup');
  }, [router]);

  return <></>;
};

export default Index;
