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
        alt="settings-dashboard-image-3"
        layout="fill"
        objectFit="cover"
        objectPosition="bottom"
      />
    </UpWave>

    {children}

    <DownWave>
      <Image
        src="/WavesSettings1.svg"
        alt="settings-dashboard-image-1"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
      />
    </DownWave>
    <DownWave>
      <Image
        src="/WavesSettings2.svg"
        alt="settings-dashboard-image-2"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
      />
    </DownWave>
  </>
);

export default SettingsPages;
