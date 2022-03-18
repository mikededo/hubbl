import { render } from '@testing-library/react';
import GeneralPages from './GeneralPages';

describe('<GeneralPages />', () => {
  it('should render properly', () => {
    const { container } = render(
      <GeneralPages>
        <span />
      </GeneralPages>
    );

    expect(container).toBeInTheDocument();
  });
});
