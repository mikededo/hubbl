import { render } from '@testing-library/react';
import Input from './Input';

describe('<Input />', () => {
  it('should render properly', () => {
    const utils = render(
      <Input
        label="TestLabel"
        placeholder="Test placeholder"
        registerResult={{ name: 'InputName' } as any}
      />
    );

    expect(utils.container).toBeInTheDocument();
    expect(utils.getByText('TestLabel')).toBeInTheDocument();
    expect(
      utils.getByPlaceholderText('Test placeholder').getAttribute('name')
    ).toBe('InputName');
  });

  it('should render with error styles', () => {
    const utils = render(
      <Input
        label="TestLabel"
        placeholder="Test placeholder"
        registerResult={{} as any}
        error
      />
    );

    expect(
      utils.getByPlaceholderText('Test placeholder').style.boxShadow
    ).toBeDefined();
  });
});
