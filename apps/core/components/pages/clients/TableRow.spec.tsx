import { Gender } from '@hubbl/shared/types';
import { fireEvent, render } from '@testing-library/react';

import TableRow from './TableRow';

const client = {
  firstName: 'Client',
  lastName: 'Test',
  email: 'client@test.com',
  phone: '+34 600 01 02 03',
  gender: Gender.OTHER,
  covidPassport: false
};

describe('<TableRow />', () => {
  describe('client', () => {
    it('should render properly without a client', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow />
          </tbody>
        </table>
      );

      expect(container).toBeDefined();
    });

    it('should render properly with a client', () => {
      const utils = render(
        <table>
          <tbody>
            <TableRow client={client as any} />
          </tbody>
        </table>
      );

      expect(utils.container).toBeDefined();
      expect(utils.getByText(client.firstName)).toBeInTheDocument();
      expect(utils.getByText(client.lastName)).toBeInTheDocument();
      expect(utils.getByText(client.email)).toBeInTheDocument();
      expect(utils.getByText(client.phone)).toBeInTheDocument();
      expect(utils.getByTestId('ManIcon')).toBeInTheDocument();
    });

    it('should render a woman icon', () => {
      const utils = render(
        <table>
          <tbody>
            <TableRow
              client={
                { ...client, covidPassport: true, gender: Gender.WOMAN } as any
              }
            />
          </tbody>
        </table>
      );

      expect(utils.getByTestId('WomanIcon')).toBeInTheDocument();
    });
  });

  describe('onClick', () => {
    it('should call onClick with the clicked client', () => {
      const onClickSpy = jest.fn();
      const utils = render(
        <table>
          <tbody>
            <TableRow client={client as any} onClick={onClickSpy} />
          </tbody>
        </table>
      );

      fireEvent.click(utils.getByText(client.firstName));
      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(client);
    });
  });
});
