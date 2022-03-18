import type { ReactNode } from 'react';

import Image from 'next/image';

import { DownWave, UpWave } from './utils';

type GeneralPagesProps = {
  children: ReactNode;
};

const GeneralPages = ({ children }: GeneralPagesProps): JSX.Element => (
  <>
    <UpWave>
      <Image
        src="/WavesGeneral1.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
        objectPosition="bottom"
      />
    </UpWave>

    {children}

    <DownWave>
      <Image
        src="/WavesGeneral2.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
      />
    </DownWave>
    <DownWave>
      <Image
        src="/WavesGeneral3.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
      />
    </DownWave>
  </>
);

export default GeneralPages;
