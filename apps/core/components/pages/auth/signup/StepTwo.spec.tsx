import {
  screen,
  fireEvent,
  render,
  RenderResult,
  act
} from '@testing-library/react';
import StepTwo, { StepTwoFields } from './StepTwo';

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

type TextBlurCallbackProps = {
  placeholder: string;
  target: { name: string; value: string };
  onBlurResult: StepTwoFields;
};

const testBlurCallback = async ({
  placeholder,
  target,
  onBlurResult
}: TextBlurCallbackProps) => {
  const onBlurSpy = jest.fn();

  render(
    <StepTwo
      disabled={false}
      initialFormState={undefined}
      onBack={undefined}
      onBlur={onBlurSpy}
      onSubmit={undefined}
    />
  );

  // Focus in some input
  await act(async () => {
    const utils = screen.getByPlaceholderText(placeholder);

    utils.focus();
    fireEvent.input(utils, { target });
    utils.blur();
  });

  expect(onBlurSpy).toHaveBeenCalledTimes(1);
  expect(onBlurSpy).toHaveBeenCalledWith(onBlurResult);
};

describe('<StepTwo />', () => {
  it('should render all the form content', () => {
    const utils = render(
      <StepTwo
        disabled={false}
        initialFormState={undefined}
        onBack={jest.fn}
        onBlur={jest.fn}
        onSubmit={jest.fn}
      />
    );

    // Find all the inputs
    checkInputLabel(utils, 'Gym name');
    checkInput(utils, {
      placeholder: 'Fantagym',
      inputName: 'name',
      inputType: 'text'
    });

    checkInputLabel(utils, 'Gym email');
    checkInput(utils, {
      placeholder: 'gym.name@info.com',
      inputName: 'email',
      inputType: 'email'
    });

    checkInputLabel(utils, 'Gym phone');
    checkInput(utils, {
      placeholder: '000 000 000',
      inputName: 'phone',
      inputType: 'tel'
    });
  });

  it('should disabled all fields', () => {
    const utils = render(
      <StepTwo
        disabled={true}
        initialFormState={undefined}
        onBack={undefined}
        onBlur={undefined}
        onSubmit={undefined}
      />
    );

    expect(utils.getByPlaceholderText('Fantagym')).toHaveAttribute('disabled');
    expect(utils.getByPlaceholderText('gym.name@info.com')).toHaveAttribute('disabled');
    expect(utils.getByPlaceholderText('000 000 000')).toHaveAttribute('disabled');
    expect(utils.getByTitle('submit')).toHaveAttribute('disabled');
    expect(utils.getByText('Go back')).toHaveAttribute('disabled');
  })

  describe('onSubmit', () => {
    it('should not call onSubmit if fields have any errors', async () => {
      const onSubmitSpy = jest.fn();

      render(
        <StepTwo
          disabled={false}
          initialFormState={undefined}
          onBack={undefined}
          onBlur={undefined}
          onSubmit={onSubmitSpy}
        />
      );
      await act(async () => {
        fireEvent.submit(screen.getByText('Sign up'));
      });

      expect(onSubmitSpy).not.toHaveBeenCalled();
    });

    it('should call onSubmit if the fields do not have any error', async () => {
      const onSubmitSpy = jest.fn();

      render(
        <StepTwo
          disabled={false}
          initialFormState={undefined}
          onBack={undefined}
          onBlur={undefined}
          onSubmit={onSubmitSpy}
        />
      );

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('Fantagym'), {
          target: { name: 'name', value: 'GymName' }
        });
        fireEvent.input(screen.getByPlaceholderText('gym.name@info.com'), {
          target: { name: 'email', value: 'gym@name.com' }
        });
        fireEvent.input(screen.getByPlaceholderText('000 000 000'), {
          target: { name: 'phone', value: '111222333' }
        });
      });

      await act(async () => {
        fireEvent.submit(screen.getByText('Sign up'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onBack', () => {
    it('should call on back with no issues', async () => {
      const onBackSpy = jest.fn();

      const utils = render(
        <StepTwo
          disabled={false}
          initialFormState={undefined}
          onBack={onBackSpy}
          onBlur={undefined}
          onSubmit={undefined}
        />
      );
      utils.getByText('Go back').click();

      expect(onBackSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onBlur', () => {
    it('should call onBlur on blurring name input with the written values', async () => {
      await testBlurCallback({
        placeholder: 'Fantagym',
        target: { name: 'name', value: 'GymName' },
        onBlurResult: { name: 'GymName', email: '', phone: '' }
      });
    });

    it('should call onBlur on blurring email input with the written values', async () => {
      await testBlurCallback({
        placeholder: 'gym.name@info.com',
        target: { name: 'email', value: 'gym@email.com' },
        onBlurResult: { email: 'gym@email.com', name: '', phone: '' }
      });
    });

    it('should call onBlur on blurring phone input with the written values', async () => {
      await testBlurCallback({
        placeholder: '000 000 000',
        target: { name: 'phone', value: '111222333' },
        onBlurResult: { phone: '111222333', name: '', email: '' }
      });
    });
  });
});
