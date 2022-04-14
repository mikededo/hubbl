import { Controller, UseFormWatch } from 'react-hook-form';

import { Slider, Stack, styled, Tooltip, Typography } from '@mui/material';

import { CalendarEventFormFields } from '../../types';

const DifficultySlider = styled(Slider)(({ theme }) => ({
  width: `calc(100% - ${theme.spacing(4)})`,
  marginLeft: theme.spacing(2)
}));

const DifficultyMarks = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 }
];

type DifficultySliderLabelProps = {
  children: React.ReactElement;

  /**
   * Current value of the slider
   */
  value: number;
};

const DifficultySliderLabel = ({
  children,
  value
}: DifficultySliderLabelProps) => (
  <Tooltip enterTouchDelay={0} placement="top" title={value}>
    {children}
  </Tooltip>
);

type CalendarEventDifficultyProps = {
  /**
   * Watch function used to know if the template field
   * has been set or not
   */
  watch: UseFormWatch<CalendarEventFormFields>;
};

const CalendarEventDifficulty = ({
  watch
}: CalendarEventDifficultyProps): JSX.Element => (
  <Stack direction="column">
    <Typography variant="h6">Difficulty</Typography>

    <Controller<CalendarEventFormFields>
      name="difficulty"
      defaultValue={3}
      render={({ field: { name, value, onChange } }) => (
        <DifficultySlider
          name={name}
          title="calendar-event-difficulty"
          defaultValue={3}
          marks={DifficultyMarks}
          step={1}
          min={1}
          max={5}
          value={value as number}
          disabled={!!watch('template')}
          valueLabelDisplay="auto"
          components={{ ValueLabel: DifficultySliderLabel }}
          onChange={onChange}
        />
      )}
    />
  </Stack>
);

export default CalendarEventDifficulty;
