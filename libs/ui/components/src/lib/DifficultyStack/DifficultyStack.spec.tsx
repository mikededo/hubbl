import { screen, render } from '@testing-library/react';

import DifficultyStack from './DifficultyStack';

const numberNames = ['one', 'two', 'three', 'four', 'five'];

describe('<DifficultyStack />', () => {
  it.each([1, 2, 3, 4, 5])(
    'should render properly for difficulty %d',
    (difficulty) => {
      const { container } = render(<DifficultyStack difficulty={difficulty} />);

      expect(container).toBeInTheDocument();
      expect(screen.getByTitle('difficulty-one-active')).toBeInTheDocument();

      for (let i = 2; i <= 5; i++) {
        if (difficulty < i) {
          expect(
            screen.getByTitle(`difficulty-${numberNames[i - 1]}-inactive`)
          );
        } else {
          expect(screen.getByTitle(`difficulty-${numberNames[i - 1]}-active`));
        }
      }
    }
  );
});
