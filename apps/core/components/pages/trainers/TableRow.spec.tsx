import { AppPalette, Gender } from '@hubbl/shared/types';
import { render } from '@testing-library/react';

import TableRow from './TableRow';

const trainer = {
  firstName: 'Trainer',
  lastName: 'Test',
  email: 'trainer@test.com',
  gender: Gender.OTHER,
  tags: [
    { id: 1, name: 'TagOne', color: AppPalette.BLUE },
    { id: 2, name: 'TagTwo', color: AppPalette.GREEN }
  ]
};

describe('<TableRow />', () => {
  describe('trainer', () => {
    it('should render properly without a trainer', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow />
          </tbody>
        </table>
      );

      expect(container).toBeDefined();
    });

    it('should render properly with a trainer', () => {
      const utils = render(
        <table>
          <tbody>
            <TableRow trainer={trainer as any} />
          </tbody>
        </table>
      );

      expect(utils.container).toBeDefined();
      expect(utils.getByText(trainer.firstName)).toBeInTheDocument();
      expect(utils.getByText(trainer.lastName)).toBeInTheDocument();
      expect(utils.getByText(trainer.email)).toBeInTheDocument();
      expect(utils.getByTestId('ManIcon')).toBeInTheDocument();
      trainer.tags.forEach(({ name }) => {
        expect(utils.getByText(name)).toBeInTheDocument();
      });
    });

    it('should render a woman icon', () => {
      const utils = render(
        <table>
          <tbody>
            <TableRow trainer={{ ...trainer, gender: Gender.WOMAN } as any} />
          </tbody>
        </table>
      );

      expect(utils.getByTestId('WomanIcon')).toBeInTheDocument();
    });
  });
});
