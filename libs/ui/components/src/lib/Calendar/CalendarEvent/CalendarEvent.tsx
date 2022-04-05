import { useMemo } from 'react';

import { motion } from 'framer-motion';

import { EventDTO } from '@hubbl/shared/models/dto';
import { AppPalette, Hour } from '@hubbl/shared/types';
import { notForwardAny } from '@hubbl/utils';
import { lighten, Stack, styled, Typography, useTheme } from '@mui/material';

const EventContent = styled(Stack)({ height: '100%' });

export type CalendarEventProps = {
  /**
   * Event that will be rendered
   */
  event: EventDTO;

  /**
   * Index of the event in the
   */
  index: number;

  /**
   * Initial hour of the column in which the event is located
   */
  initialDayHour: Hour;
};

type MotionLiProps = {
  /**
   * Color of the event
   */
  color: AppPalette;

  /**
   * Height of the element, which will be passed to the theme
   * spacing
   */
  height: number;
};

const MotionLi = styled(motion.li, {
  shouldForwardProp: notForwardAny(['color', 'height'])
})<MotionLiProps>(({ theme, color, height }) => ({
  position: 'absolute',
  left: theme.spacing(0.5),
  right: theme.spacing(0.5),
  background: `radial-gradient(ellipse at 0% 0%, ${lighten(
    color,
    0.4
  )}, ${color})`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5, 1, 0.25),
  cursor: 'pointer',
  height: theme.spacing(height)
}));

const CalendarEvent = ({
  event,
  initialDayHour,
  index
}: CalendarEventProps): JSX.Element => {
  const theme = useTheme();

  const topPosition = useMemo<number>(() => {
    const [hours, minutes] = event.startTime.split(':').map((time) => +time);

    const hoursSpaces = (hours - initialDayHour) * 8 + 6;
    const minutesSpaces = (minutes / 60) * 8;

    return hoursSpaces + minutesSpaces + 0.5;
  }, [event, initialDayHour]);

  const height = useMemo<number>(() => {
    const start = event.startTime.split(':').map((item) => +item);
    const end = event.endTime.split(':').map((item) => +item);

    const startValue = (start[0] * 60 + start[1]) / 60;
    const endValue = (end[0] * 60 + end[1]) / 60;

    return (endValue - startValue) * 8 - 1;
  }, [event]);

  return (
    <MotionLi
      color={event.color}
      height={height}
      initial={{ top: theme.spacing(topPosition - 4), opacity: 0 }}
      animate={{ top: theme.spacing(topPosition), opacity: 1 }}
      transition={{
        delay: 0.25 + index * 0.05,
        duration: 0.5,
        type: 'spring',
        damping: 50,
        stiffness: 700
      }}
    >
      <EventContent justifyContent="space-between">
        <Typography color="white" variant="calendarHeader" noWrap>
          {event.name}
        </Typography>

        {height > 3.5 && (
          <Typography color="white" textAlign="right" variant="subtitle2">
            {event.appointmentCount}/{event.capacity}
          </Typography>
        )}
      </EventContent>
    </MotionLi>
  );
};

export default CalendarEvent;
