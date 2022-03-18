import { act } from 'react-dom/test-utils';

import { fireEvent, render, screen } from '@testing-library/react';

import { LoadingContext, useLoadingContext } from './Loading.context';

describe('<LoadingContext />', () => {
  it('should render a progress bar', async () => {
    const Component = () => {
      const { onPushLoading } = useLoadingContext();

      return <button onClick={onPushLoading}>Button</button>;
    };

    const utils = render(
      <LoadingContext>
        <Component />
      </LoadingContext>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Button'));
    });

    expect(utils.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should not render a progress bar by default', async () => {
    const Component = () => <button>Button</button>;

    const utils = render(
      <LoadingContext>
        <Component />
      </LoadingContext>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Button'));
    });

    expect(utils.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should not render a progress bar by default', async () => {
    const Component = () => {
      const { onPushLoading, onPopLoading } = useLoadingContext();

      return (
        <button
          onClick={() => {
            onPushLoading();
            onPopLoading();
          }}
        >
          Button
        </button>
      );
    };

    const utils = render(
      <LoadingContext>
        <Component />
      </LoadingContext>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Button'));
    });

    expect(utils.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
