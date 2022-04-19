import { render } from '@testing-library/react';

import PersonnelPages from './PersonnelPages';

describe('<PersonnelPages />', () => {
  it('should render properly', () => {
    const { container } = render(
      <PersonnelPages>
        <span />
      </PersonnelPages>
    );

    expect(container).toBeInTheDocument();
  });
});
