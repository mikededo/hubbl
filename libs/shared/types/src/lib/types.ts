export type ParsedToken = {
  id: number;
  email: string;
  user: 'owner' | 'worker' | 'client';
};
