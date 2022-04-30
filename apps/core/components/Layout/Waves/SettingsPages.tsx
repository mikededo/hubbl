import type { ReactNode } from 'react';

import { DownWave, UpWave } from './utils';

type SettingsPagesProps = {
  children: ReactNode;
};

const SettingsPages = ({ children }: SettingsPagesProps): JSX.Element => (
  <>
    <UpWave>
      <svg
        className="decoration-svg"
        width="1920"
        height="359"
        viewBox="0 0 1920 359"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 77.9998H80C160 77.9998 320 77.9998 480 116C640 155 800 231 960 289C1120 347 1280 385 1440 337C1600 289 1760 155 1840 86.9998L1920 19.9998V-95.0002H1840C1760 -95.0002 1600 -95.0002 1440 -95.0002C1280 -95.0002 1120 -95.0002 960 -95.0002C800 -95.0002 640 -95.0002 480 -95.0002C320 -95.0002 160 -95.0002 80 -95.0002H0V77.9998Z"
          fill="#818CF8"
          fillOpacity="0.15"
        />
      </svg>
    </UpWave>

    {children}

    <DownWave>
      <svg
        className="decoration-svg"
        width="1920"
        height="263"
        viewBox="0 0 1920 263"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1920 269.008L1856 232.991C1792 196.974 1664 124.941 1536 70.9158C1408 16.8907 1280 -19.1261 1152 10.8879C1024 40.9018 896 136.946 768 136.946C640 136.946 512 40.9018 384 22.8934C256 4.88508 128 64.913 64 94.9269L0 124.941V269.008H64C128 269.008 256 269.008 384 269.008C512 269.008 640 269.008 768 269.008C896 269.008 1024 269.008 1152 269.008C1280 269.008 1408 269.008 1536 269.008C1664 269.008 1792 269.008 1856 269.008H1920Z"
          fill="#818CF8"
          fillOpacity="0.15"
        />
      </svg>
    </DownWave>
    <DownWave>
      <svg
        className="decoration-svg"
        width="1920"
        height="297"
        viewBox="0 0 1920 297"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1920 0L1873.6 18.8333C1828.8 37.6667 1737.6 75.3333 1646.4 87.8889C1553.6 100.444 1462.4 87.8889 1371.2 119.278C1280 150.667 1188.8 226 1097.6 263.667C1006.4 301.333 913.6 301.333 822.4 295.056C731.2 288.778 640 276.222 548.8 232.278C457.6 188.333 366.4 113 273.6 75.3333C182.4 37.6667 91.2001 37.6667 46.4 37.6667H0V339H46.4C91.2001 339 182.4 339 273.6 339C366.4 339 457.6 339 548.8 339C640 339 731.2 339 822.4 339C913.6 339 1006.4 339 1097.6 339C1188.8 339 1280 339 1371.2 339C1462.4 339 1553.6 339 1646.4 339C1737.6 339 1828.8 339 1873.6 339H1920V0Z"
          fill="#818CF8"
          fillOpacity="0.15"
        />
      </svg>
    </DownWave>
  </>
);

export default SettingsPages;
