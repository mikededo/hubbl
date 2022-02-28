import React, { useCallback, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

import { useUserContext } from '@hubbl/data-access/contexts';
import { Divider, Stack, Typography } from '@mui/material';

import { AuthLayout, Pages } from '../../../components';

const { StepOne, StepTwo } = Pages.SignUp;
const { FooterLink, FormFooter, FormWrapper, SideImage } = Pages.Auth;

type SignUpFormFields = {
  user: Pages.SignUp.StepOneFields;
  gym: Pages.SignUp.StepTwoFields;
};

const InitialFormState: SignUpFormFields = {
  user: { firstName: '', lastName: '', email: '', password: '' },
  gym: { name: '', email: '', phone: '' }
};

const SignUp = () => {
  const { user, API } = useUserContext();
  const router = useRouter();

  const [formState, setFormState] = useState(InitialFormState);

  const [step, setStep] = useState<number>(0);
  const [stepOneRef, setStepOneRef] = useState(null);
  const [stepTwoRef, setStepTwoRef] = useState(null);

  const getContainerHeight = useCallback(() => {
    if ((!stepOneRef && step === 0) || (!stepTwoRef && step === 1)) {
      return 0;
    }

    return (step ? stepTwoRef : stepOneRef).getBoundingClientRect().height;
  }, [step, stepOneRef, stepTwoRef]);

  const handleOnSubmitStepOne = (data: Pages.SignUp.StepOneFields) => {
    setFormState((prev) => ({ ...prev, user: data }));
    setStep(1);
  };

  const handleOnBlurStepTwo = (data: Pages.SignUp.StepTwoFields) => {
    setFormState((prev) => ({ ...prev, gym: data }));
  };

  const handleOnGoBack = () => {
    setStep(0);
  };

  const handleOnSubmit = (data: Pages.SignUp.StepTwoFields) => {
    API.signup('owner', { ...formState.user, gym: { ...data } });
  };

  useEffect(() => {
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
              Register now and start managing your gym like a boss!
            </Typography>
          </Stack>

          <Stack
            gap={1.5}
            component={motion.main}
            animate={{ height: getContainerHeight() }}
          >
            <AnimatePresence>
              {step === 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  ref={(ref) => setStepOneRef(ref)}
                >
                  <StepOne
                    initialFormState={formState.user}
                    onSubmit={handleOnSubmitStepOne}
                  />
                </motion.section>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step === 1 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  ref={(ref) => setStepTwoRef(ref)}
                >
                  <StepTwo
                    disabled={API.loading}
                    initialFormState={formState.gym}
                    onBack={handleOnGoBack}
                    onBlur={handleOnBlurStepTwo}
                    onSubmit={handleOnSubmit}
                  />
                </motion.section>
              )}
            </AnimatePresence>
          </Stack>

          <Divider />

          <FormFooter variant="subtitle2">
            Already with an account?{' '}
            <FooterLink href="/auth/login">Log in now!</FooterLink>
          </FormFooter>
        </Stack>
      </FormWrapper>

      <SideImage />
    </AuthLayout>
  );
};

export default SignUp;
