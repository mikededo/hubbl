import {
  act,
  fireEvent,
  render,
  RenderResult,
  screen
} from '@testing-library/react';

import StepOne from './StepOne';

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

describe('<StepOne /> ', () => {
  it('should render all the form content', () => {
    const utils = render(
      <StepOne initialFormState={undefined} onSubmit={jest.fn} />
    );

    // Find all the inputs
    checkInputLabel(utils, 'First name');
    checkInput(utils, {
      placeholder: 'John',
      inputName: 'firstName',
      inputType: 'text'
    });

    checkInputLabel(utils, 'Last name');
    checkInput(utils, {
      placeholder: 'Doe',
      inputName: 'lastName',
      inputType: 'text'
    });

    checkInputLabel(utils, 'Email');
    checkInput(utils, {
      placeholder: 'john.doe@domain.com',
      inputName: 'email',
      inputType: 'email'
    });

    checkInputLabel(utils, 'Password');
    checkInput(utils, {
      placeholder: 'At least 8 characters!',
      inputName: 'password',
      inputType: 'password'
    });
  });

  it('should not call onSubmit if fields have any errors', async () => {
    const onSubmitSpy = jest.fn();

    render(<StepOne initialFormState={undefined} onSubmit={onSubmitSpy} />);
    await act(async () => {
      fireEvent.submit(screen.getByText('Continue'));
    });

    expect(onSubmitSpy).not.toHaveBeenCalled();
  });

  it('should call onSubmit if fields do not have any error', async () => {
    const onSubmitSpy = jest.fn();

    render(<StepOne initialFormState={undefined} onSubmit={onSubmitSpy} />);
    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('John'), {
        target: { name: 'firstName', value: 'TestFirstName' }
      });
      fireEvent.input(screen.getByPlaceholderText('Doe'), {
        target: { name: 'lastName', value: 'TestLastName' }
      });
      fireEvent.input(screen.getByPlaceholderText('john.doe@domain.com'), {
        target: { name: 'email', value: 'test@email.com' }
      });
      fireEvent.input(screen.getByPlaceholderText('At least 8 characters!'), {
        target: { name: 'password', value: 'eightCharsPwd' }
      });
    });

    await act(async () => {
      fireEvent.submit(screen.getByText('Continue'));
    });

    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it('should render with the previous values', async () => {
    const onSubmitSpy = jest.fn();

    render(
      <StepOne
        initialFormState={{
          firstName: 'Initial',
          lastName: 'Form',
          email: 'initial@email.com',
          password: 'form-password'
        }}
        onSubmit={onSubmitSpy}
      />
    );

    expect(screen.getByPlaceholderText('John')).toHaveValue('Initial');
    expect(screen.getByPlaceholderText('Doe')).toHaveValue('Form');
    expect(screen.getByPlaceholderText('john.doe@domain.com')).toHaveValue(
      'initial@email.com'
    );
    expect(screen.getByPlaceholderText('At least 8 characters!')).toHaveValue(
      'form-password'
    );
  });
});
