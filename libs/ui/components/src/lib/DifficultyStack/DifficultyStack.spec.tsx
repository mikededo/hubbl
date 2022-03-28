import { render } from '@testing-library/react';

import DifficultyStack from './DifficultyStack';

describe('<DifficultyStack />', () => {
  it.each([1, 2, 3, 4, 5])(
    'should render properly for difficulty $difficulty',
    (difficulty) => {
      const { container } = render(<DifficultyStack difficulty={difficulty} />);

      expect(container).toBeInTheDocument();
    }
  );
});
