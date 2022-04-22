import { Gender } from '@hubbl/shared/types';
import { render, screen } from '@testing-library/react';

import DashboardTrainer from './DashboardTrainer';

describe('<DashboardTrainer />', () => {
  const trainer = {
    id: 10,
    firstName: 'Test',
    lastName: 'Trainer',
    gender: Gender.OTHER,
  };

  it('should render properly', () => {
    const { container } = render(<DashboardTrainer trainer={trainer as any} />);

    expect(container).toBeInTheDocument();
  });

  describe('trainer', () => {
    it('should render a trainer fields', () => {
      render(<DashboardTrainer trainer={trainer as any} />);

      expect(
        screen.getByText(`${trainer.firstName} ${trainer.lastName}`)
      ).toBeInTheDocument();
      expect(screen.getByText('other-trainer')).toBeInTheDocument();
      expect(screen.getByText('other-trainer').tagName.toLowerCase()).toBe(
        'title'
      );
    });

    it('should render a man trainer icon', () => {
      render(
        <DashboardTrainer trainer={{ ...trainer, gender: Gender.MAN } as any} />
      );

      expect(screen.getByText('man-trainer')).toBeInTheDocument();
      expect(screen.getByText('man-trainer').tagName.toLowerCase()).toBe(
        'title'
      );
    });

    it('should render a woman trainer icon', () => {
      render(
        <DashboardTrainer
          trainer={{ ...trainer, gender: Gender.WOMAN } as any}
        />
      );

      expect(screen.getByText('woman-trainer')).toBeInTheDocument();
      expect(screen.getByText('woman-trainer').tagName.toLowerCase()).toBe(
        'title'
      );
    });

    it('should render an other trainer icon', () => {
      render(
        <DashboardTrainer
          trainer={{ ...trainer, gender: Gender.OTHER } as any}
        />
      );

      expect(screen.getByText('other-trainer')).toBeInTheDocument();
      expect(screen.getByText('other-trainer').tagName.toLowerCase()).toBe(
        'title'
      );
    });
  });
});
