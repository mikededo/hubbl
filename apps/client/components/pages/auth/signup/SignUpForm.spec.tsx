import {
  act,
  fireEvent,
  render,
  RenderResult,
  screen
} from '@testing-library/react';

import SignUpForm from './SignUpForm';

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

describe('<SignUpForm /> ', () => {
  it('should render all the form content', () => {
    const utils = render(
      <SignUpForm initialFormState={undefined} onSubmit={jest.fn} />
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

    checkInputLabel(utils, 'Gym code');
    checkInput(utils, {
      placeholder: 'Your gym should provide you this code!',
      inputName: 'code',
      inputType: 'text'
    });
  });

  it('should not call onSubmit if fields have any errors', async () => {
    const onSubmitSpy = jest.fn();

    render(<SignUpForm initialFormState={undefined} onSubmit={onSubmitSpy} />);
    await act(async () => {
      fireEvent.submit(screen.getByText('Register'));
    });

    expect(onSubmitSpy).not.toHaveBeenCalled();
  });

  it('should call onSubmit if fields do not have any error', async () => {
    const onSubmitSpy = jest.fn();

    render(<SignUpForm initialFormState={undefined} onSubmit={onSubmitSpy} />);
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
      fireEvent.input(
        screen.getByPlaceholderText('Your gym should provide you this code!'),
        { target: { name: 'code', value: 'AABBCCDD00' } }
      );
    });

    await act(async () => {
      fireEvent.submit(screen.getByText('Register'));
    });

    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it('should render with the previous values', async () => {
    const onSubmitSpy = jest.fn();

    render(
      <SignUpForm
        initialFormState={{
          firstName: 'Initial',
          lastName: 'Form',
          email: 'initial@email.com',
          password: 'form-password',
          code: 'AABBCCDD00'
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
    expect(
      screen.getByPlaceholderText('Your gym should provide you this code!')
    ).toHaveValue('AABBCCDD00');
  });
});
