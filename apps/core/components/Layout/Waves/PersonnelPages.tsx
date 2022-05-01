import type { ReactNode } from 'react';

import Image from 'next/image';

import { DownWave, UpWave } from './utils';

type PersonnelPagesProps = {
  children: ReactNode;
};

const PersonnelPages = ({ children }: PersonnelPagesProps): JSX.Element => (
  <>
    <UpWave>
      <Image
        src="/WavesPersonnel2.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
      />
    </UpWave>
    <UpWave>
      <Image
        src="/WavesPersonnel3.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
        objectPosition="bottom"
      />
    </UpWave>

    {children}

    <DownWave>
      <Image
        src="/WavesPersonnel1.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
      />
    </DownWave>
  </>
);

export default PersonnelPages;
