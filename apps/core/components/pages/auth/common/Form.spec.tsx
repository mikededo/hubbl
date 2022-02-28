import { render } from '@testing-library/react';

import { FooterLink, FormFooter, FormWrapper } from './Form';

describe('Signup components', () => {
  describe('FormWrapper', () => {
    it('should render properly', () => {
      const { container } = render(<FormWrapper />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('FormFooter', () => {
    it('should render properly', () => {
      const { container } = render(<FormFooter />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('FormWrapper', () => {
    it('should render properly', () => {
      const { container } = render(<FooterLink href="a path">Test</FooterLink>);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute('href');
    });
  });
});
