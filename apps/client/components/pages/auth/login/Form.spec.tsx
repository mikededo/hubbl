import {
  fireEvent,
  render,
  RenderResult,
  screen
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import Form from './Form';

const checkInputLabel = (component: RenderResult, text: string) => {
  const firstNameLabel = component.getByText(text);
  expect(firstNameLabel).toBeInTheDocument();
  expect(firstNameLabel.tagName).toBe('LABEL');
};

type CheckInputProps = {
  placeholder: string;
  inputName: string;
  inputType: string;
};

const checkInput = (
  component: RenderResult,
  { inputName, inputType, placeholder }: CheckInputProps
) => {
  const element = component.getByPlaceholderText(placeholder);
  expect(element.getAttribute('name')).toBe(inputName);
  expect(element.getAttribute('type')).toBe(inputType);
};

describe('<Form />', () => {
  it('should render all the form content', async () => {
    const utils = render(<Form onSubmit={undefined} />);

    checkInputLabel(utils, 'Email');
    checkInput(utils, {
      inputName: 'email',
      inputType: 'email',
      placeholder: 'john.doe@domain.com'
    });

    checkInputLabel(utils, 'Password');
    checkInput(utils, {
      inputName: 'password',
      inputType: 'password',
      placeholder: 'At least 8 characters!'
    });
  });

  it('should call on submit if fields do not have any error', async () => {
    const onSubmitSpy = jest.fn();

    render(<Form onSubmit={onSubmitSpy} />);

    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('john.doe@domain.com'), {
        target: { name: 'email', value: 'test@email.com' }
      });
      fireEvent.input(screen.getByPlaceholderText('At least 8 characters!'), {
        target: { name: 'password', value: 'eightCharsPwd' }
      });
    });
    await act(async () => {
      fireEvent.submit(screen.getByText('Log in'));
    });

    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it('should not call on submit if fields have any errors', async () => {
    const onSubmitSpy = jest.fn();

    render(<Form onSubmit={onSubmitSpy} />);
    await act(async () => {
      fireEvent.submit(screen.getByText('Log in'));
    });

    expect(onSubmitSpy).not.toHaveBeenCalled();
  });
});
