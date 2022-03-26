import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import type { GymZoneGridProps } from './GymZoneGrid';
import GymZoneGrid from './GymZoneGrid';

type LinkProps = {
  children: React.ReactElement;
  href: string;
  passHref: boolean;
};

// Mock link so it does not call push when clicking a card
jest.mock('next/link', () => {
  const React = jest.requireActual('react');

  return ({ children, href }: LinkProps) =>
    React.cloneElement(children, { href: href });
});

const Component = ({
  gymZones,
  href,
  onAddGymZone,
  onGymZoneClick
}: Partial<GymZoneGridProps>) => (
  <ThemeProvider theme={createTheme()}>
    <GymZoneGrid
      gymZones={gymZones as any}
      header="Gym zones"
      href={href}
      onAddGymZone={onAddGymZone}
      onGymZoneClick={onGymZoneClick}
    />
  </ThemeProvider>
);

const gymZoneAttrs = {
  description: 'Description',
  openTime: '09:00:00',
  closeTime: '21:00:00',
  isClassType: false,
  covidPassport: true,
  maskRequired: true,
  capacity: 25
};

const gymZones = [
  { id: 1, name: 'OneOne', ...gymZoneAttrs },
  { id: 2, name: 'TwoOne', ...gymZoneAttrs },
  { id: 3, name: 'ThreeOne', ...gymZoneAttrs },
  { id: 4, name: 'FourOne', ...gymZoneAttrs },
  { id: 5, name: 'FiveOne', ...gymZoneAttrs },
  { id: 6, name: 'SixOne', ...gymZoneAttrs }
];

describe('<GymZoneGrid />', () => {
  it('should render properly', () => {
    const { container } = render(<Component gymZones={gymZones as any} />);

    expect(container).toBeInTheDocument();

    // Header
    expect(screen.getByText('Gym zones')).toBeInTheDocument();
    // Add gym zone button
    expect(screen.getByTitle('add-gym-zone')).toBeInTheDocument();
  });

  it('should iterate the carousel', async () => {
    render(<Component gymZones={gymZones as any} />);

    const prev = screen.getByLabelText('carousel-prev');
    const next = screen.getByLabelText('carousel-next');

    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(next);
    });
    await act(async () => {
      fireEvent.click(next);
    });

    expect(prev).not.toBeDisabled();
    expect(next).toBeDisabled();

    await act(async () =>{
      fireEvent.click(prev);
    });

    expect(prev).not.toBeDisabled();
    expect(next).not.toBeDisabled();
  });

  describe('href', () => {
    it('should render the gym zones as links', () => {
      render(<Component gymZones={gymZones as any} href="/base" />);

      gymZones.forEach(({ id, name }) => {
        const element = screen.getByText(name.toUpperCase());
        const anchor = element.closest('a');

        expect(anchor).toHaveAttribute('href', `/base/${id}`);
      });
    });

    it('should not render the gym zones as links', () => {
      render(<Component gymZones={gymZones as any} />);

      gymZones.forEach(({ id, name }) => {
        const element = screen.getByText(name.toUpperCase());
        expect(element.closest('a')).toBeNull();
      });
    });
  });

  describe('onAddClick', () => {
    it('should call onAddGymZone if add button clicked', () => {
      const onAddSpy = jest.fn();

      render(<Component gymZones={gymZones as any} onAddGymZone={onAddSpy} />);
      fireEvent.click(screen.getByTitle('add-gym-zone'));

      expect(onAddSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onGymZoneClick', () => {
    it('should call onGymZoneClick if no href is passed', () => {
      const onClickSpy = jest.fn();

      render(
        <Component gymZones={gymZones as any} onGymZoneClick={onClickSpy} />
      );
      fireEvent.click(screen.getByTitle(`gym-zone-${gymZones[0].id}`));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(gymZones[0].id);
    });

    it('should not call onGymZoneClick if href is passed', () => {
      const onClickSpy = jest.fn();

      render(
        <Component
          gymZones={gymZones as any}
          href="/href"
          onGymZoneClick={onClickSpy}
        />
      );
      fireEvent.click(screen.getByTitle(`gym-zone-${gymZones[0].id}`));

      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });
});
