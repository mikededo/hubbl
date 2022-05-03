import { Gender } from '@hubbl/shared/types';
import { fireEvent, render } from '@testing-library/react';

import TableRow from './TableRow';

const worker = {
  firstName: 'Worker',
  lastName: 'Test',
  email: 'worker@test.com',
  phone: '+34 600 01 02 03',
  gender: Gender.OTHER
};

describe('<TableRow />', () => {
  describe('worker', () => {
    it('should render properly without a worker', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow />
          </tbody>
        </table>
      );

      expect(container).toBeDefined();
    });

    it('should render properly with a worker', () => {
      const utils = render(
        <table>
          <tbody>
            <TableRow worker={worker as any} />
          </tbody>
        </table>
      );

      expect(utils.container).toBeDefined();
      expect(utils.getByText(worker.firstName)).toBeInTheDocument();
      expect(utils.getByText(worker.lastName)).toBeInTheDocument();
      expect(utils.getByText(worker.email)).toBeInTheDocument();
      expect(utils.getByText(worker.phone)).toBeInTheDocument();
      expect(utils.getByTestId('ManIcon')).toBeInTheDocument();
    });

    it('should render a woman icon', () => {
      const utils = render(
        <table>
          <tbody>
            <TableRow worker={{ ...worker, gender: Gender.WOMAN } as any} />
          </tbody>
        </table>
      );

      expect(utils.getByTestId('WomanIcon')).toBeInTheDocument();
    });
  });

  describe('onClick', () => {
    it('should call onClick with the clicked worker', () => {
      const onClickSpy = jest.fn();
      const utils = render(
        <table>
          <tbody>
            <TableRow worker={worker as any} onClick={onClickSpy} />
          </tbody>
        </table>
      );
      fireEvent.click(utils.getByText(worker.firstName));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(worker);
    });
  });
});
