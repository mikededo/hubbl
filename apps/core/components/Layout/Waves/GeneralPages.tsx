import type { ReactNode } from 'react';

import { DownWave, UpWave } from './utils';

type GeneralPagesProps = {
  children: ReactNode;
};

const GeneralPages = ({ children }: GeneralPagesProps): JSX.Element => (
  <>
    <UpWave>
      <svg
        className="decoration-svg"
        width="1920"
        height="104"
        viewBox="0 0 1920 104"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1920 68L1840 74C1760 80 1600 92 1440 92C1280 92 1120 80 960 56C800 32 640 -4 480 2C320 8 160 56 80 80L0 104V-40H80C160 -40 320 -40 480 -40C640 -40 800 -40 960 -40C1120 -40 1280 -40 1440 -40C1600 -40 1760 -40 1840 -40H1920V68Z"
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
        height="352"
        viewBox="0 0 1920 352"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 280.824H80C160 280.824 320 280.824 480 242.824C640 203.824 800 127.824 960 69.8244C1120 11.8244 1280 -26.1756 1440 21.8244C1600 69.8244 1760 203.824 1840 271.824L1920 338.824V453.824H1840C1760 453.824 1600 453.824 1440 453.824C1280 453.824 1120 453.824 960 453.824C800 453.824 640 453.824 480 453.824C320 453.824 160 453.824 80 453.824H0V280.824Z"
          fill="#818CF8"
          fillOpacity="0.15"
        />
      </svg>
    </DownWave>
    <DownWave>
      <svg
        className="decoration-svg"
        width="1920"
        height="237"
        viewBox="0 0 1920 237"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0L46.4 18.8333C91.2 37.6667 182.4 75.3333 273.6 87.8889C366.4 100.444 457.6 87.8889 548.8 119.278C640 150.667 731.2 226 822.4 263.667C913.6 301.333 1006.4 301.333 1097.6 295.056C1188.8 288.778 1280 276.222 1371.2 232.278C1462.4 188.333 1553.6 113 1646.4 75.3333C1737.6 37.6667 1828.8 37.6667 1873.6 37.6667H1920V339H1873.6C1828.8 339 1737.6 339 1646.4 339C1553.6 339 1462.4 339 1371.2 339C1280 339 1188.8 339 1097.6 339C1006.4 339 913.6 339 822.4 339C731.2 339 640 339 548.8 339C457.6 339 366.4 339 273.6 339C182.4 339 91.2 339 46.4 339H0V0Z"
          fill="#818CF8"
          fillOpacity="0.15"
        />
      </svg>
    </DownWave>
  </>
);

export default GeneralPages;
