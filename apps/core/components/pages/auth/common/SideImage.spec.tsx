import { render } from '@testing-library/react';

import * as SideImage from './SideImage';

describe('SideImage', () => {
  describe('<BarBall />', () => {
    it('should should render properly', () => {
      const { container } = render(<SideImage.BarBall bgColor="#333333" />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<NavbarContainer />', () => {
    it('should should render properly', () => {
      const { container } = render(<SideImage.NavbarContainer />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<NavbarSearch />', () => {
    it('should should render properly', () => {
      const { container } = render(<SideImage.NavbarSearch />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<NavbarSearchText />', () => {
    it('should should render properly', () => {
      const { container } = render(<SideImage.NavbarSearchText />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<Navbar />', () => {
    it('should render the components', () => {
      const utils = render(<SideImage.Navbar />);

      expect(utils.container.firstChild).toBeInTheDocument();
      // Renders the text of the fake navigation bar
      utils.getByText('https://www.hubbl.com/dashboard');
    });
  });

  describe('<DecorationWrapper />', () => {
    it('should render properly', () => {
      const { container } = render(<SideImage.DecorationWrapper />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<Container />', () => {
    it('should render properly', () => {
      const { container } = render(<SideImage.Container />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<SideImage />', () => {
    it('should render properly', () => {
      const utils = render(<SideImage.SideImage />);

      expect(utils.container.firstChild).toBeInTheDocument();
      // Find image
      utils.getByAltText('signup-dashboard-image');
    });
  });
});
