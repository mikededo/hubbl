import { act } from 'react-dom/test-utils';

import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';

import { ToastContext, useToastContext } from './Toast.context';

describe('<ToastContext />', () => {
  it('should render an error snackbar', async () => {
    const ErrorComponent = () => {
      const { onError } = useToastContext();

      return <button onClick={() => onError('Error message')}>Button</button>;
    };

    const utils = render(
      <ToastContext>
        <ErrorComponent />
      </ToastContext>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Button'));
    });

    expect(utils.getByText('Error message')).toBeInTheDocument();
  });

  it('should render an info snackbar', async () => {
    const InfoComponent = () => {
      const { onInfo } = useToastContext();

      return <button onClick={() => onInfo('Info message')}>Button</button>;
    };

    const utils = render(
      <ToastContext>
        <InfoComponent />
      </ToastContext>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Button'));
    });

    expect(utils.getByText('Info message')).toBeInTheDocument();
  });

  it('should render a success snackbar', async () => {
    const SuccessComponent = () => {
      const { onSuccess } = useToastContext();

      return (
        <button onClick={() => onSuccess('Success message')}>Button</button>
      );
    };

    const utils = render(
      <ToastContext>
        <SuccessComponent />
      </ToastContext>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Button'));
    });

    expect(utils.getByText('Success message')).toBeInTheDocument();
  });

  it('should close the rendered toast', async () => {
    const Component = () => {
      const { onInfo } = useToastContext();

      return <button onClick={() => onInfo('Info')}>Button</button>;
    };

    const utils = render(
      <ToastContext>
        <Component />
      </ToastContext>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Button'));
    });

    expect(utils.getByText('Info')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(utils.getByTitle('Close'));
    });

    await waitForElementToBeRemoved(() => screen.getByText('Info'));
  });
});
