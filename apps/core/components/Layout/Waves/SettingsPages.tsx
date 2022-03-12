import { styled } from '@mui/material';
import Image from 'next/image';
import type { ReactNode } from 'react';

type SettingsPagesProps = {
  children: ReactNode;
};

const UpWave = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '300px',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1
});

const DownWave = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '300px',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: -1
});

const SettingsPages = ({ children }: SettingsPagesProps): JSX.Element => (
  <>
    <UpWave>
      <Image
        src="/WavesSettings3.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
      />
    </UpWave>

    {children}

    <DownWave>
      <Image
        src="/WavesSettings1.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
      />
    </DownWave>
    <DownWave>
      <Image
        src="/WavesSettings2.svg"
        alt="signup-dashboard-image"
        layout="fill"
        objectFit="cover"
      />
    </DownWave>
  </>
);

export default SettingsPages;
