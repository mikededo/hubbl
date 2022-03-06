import { styled } from '@mui/material';

import ContentCard from '../../../ContentCard';

export default styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: theme.spacing(3)
}));
