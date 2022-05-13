export type ParsedToken = {
  id: number;
  email: string;
  user: 'owner' | 'worker' | 'client';
};

export type HourRange = {
  /**
   * Initial hour of the range
   */
  initial: Hour;

  /**
   * Final hour of the range
   */
  final: Hour;
};

export type Hour =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

/* Utils */
export type EmptyHandler<T = void> = () => T;

export type SingleHandler<J, T = void> = (args: J) => T;

export type ConfirmationState<T> = {
  open: boolean;
  value: T | null;
};
