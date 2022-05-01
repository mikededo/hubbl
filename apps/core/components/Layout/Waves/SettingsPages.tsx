import type { ReactNode } from 'react';

import Image from 'next/image';

import { DownWave, UpWave } from './utils';

type SettingsPagesProps = {
  children: ReactNode;
};

const SettingsPages = ({ children }: SettingsPagesProps): JSX.Element => (
  <>
    <UpWave>
      <Image
        src="/WavesSettings3.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
        objectPosition="bottom"
      />
    </UpWave>

    {children}

    <DownWave>
      <Image
        src="/WavesSettings1.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
      />
    </DownWave>
    <DownWave>
      <Image
        src="/WavesSettings2.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
      />
    </DownWave>
  </>
);

export default SettingsPages;
