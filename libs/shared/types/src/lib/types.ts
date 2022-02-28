export type ParsedToken = {
  id: number;
  email: string;
  user: 'owner' | 'worker' | 'client';
};

/* Utils */
export type EmptyHandler<T = void> = () => T;

export type SingleHandler<J, T = void> = (args: J) => T;
