import type { ReactNode } from 'react';

import { DownWave, UpWave } from './utils';

type PersonnelPagesProps = {
  children: ReactNode;
};

const PersonnelPages = ({ children }: PersonnelPagesProps): JSX.Element => (
  <>
    <UpWave>
      <svg
        className="decoration-svg"
        width="1920"
        height="161"
        viewBox="0 0 1920 161"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1920 82.0348L1855.67 88.0368C1791.33 94.0387 1662.67 106.043 1534 124.048C1405.33 142.054 1276.67 166.062 1148 160.06C1019.33 154.058 890.667 118.046 762 88.0368C633.333 58.0271 504.667 34.0194 376 40.0213C247.333 46.0232 118.667 82.0348 54.3334 100.041L-10 118.046V-26H54.3334C118.667 -26 247.333 -26 376 -26C504.667 -26 633.333 -26 762 -26C890.667 -26 1019.33 -26 1148 -26C1276.67 -26 1405.33 -26 1534 -26C1662.67 -26 1791.33 -26 1855.67 -26H1920V82.0348Z"
          fill="#818CF8"
          fillOpacity="0.15"
        />
      </svg>
    </UpWave>
    <UpWave>
      <svg
        className="decoration-svg"
        width="1920"
        height="248"
        viewBox="0 0 1920 248"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1920 248L1840.41 229C1759.83 210 1599.67 171 1439.5 123C1280.33 75 1120.17 17 960 -32C799.834 -80 639.668 -118 479.503 -99C320.332 -80 160.166 -3 79.5856 36L0 75V-215H79.5856C160.166 -215 320.332 -215 479.503 -215C639.668 -215 799.834 -215 960 -215C1120.17 -215 1280.33 -215 1439.5 -215C1599.67 -215 1759.83 -215 1840.41 -215H1920V248Z"
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
        height="382"
        viewBox="0 0 1920 382"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1920 280.933H1823.62C1727.25 280.933 1534.5 280.933 1341.75 242.918C1149 203.903 956.25 127.874 763.5 69.8514C570.75 11.829 378 -26.1857 185.25 21.8328C-7.5 69.8514 -200.25 203.903 -296.625 271.93L-393 338.956V454H-296.625C-200.25 454 -7.5 454 185.25 454C378 454 570.75 454 763.5 454C956.25 454 1149 454 1341.75 454C1534.5 454 1727.25 454 1823.62 454H1920V280.933Z"
          fill="#818CF8"
          fillOpacity="0.15"
        />
      </svg>
    </DownWave>
  </>
);

export default PersonnelPages;
