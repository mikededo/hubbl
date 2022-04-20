import React from 'react';

import { EmptyHandler } from '@hubbl/shared/types';
import { Add, ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  IconButton,
  Stack,
  styled,
  Table as MuiTable,
  TableBody,
  TableHead
} from '@mui/material';

import ContentCard from '../ContentCard';
import AddItemPlaceholder from '../AddItemPlaceholder';

const ButtonContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(1),
  width: 'unset'
}));

const AddTrainerWrapper = styled('section')(({ theme }) => ({
  padding: theme.spacing(1.5, 3, 2)
}));

const AddIcon = styled(Add)(({ theme }) => ({
  color: theme.palette.text.secondary,
  margin: theme.spacing(1, 'auto')
}));

type TableProps = {
  /**
   * If the table is on the first page, the previous
   * page button will be disabled
   *
   * @default false
   */
  firstPage?: boolean;

  /**
   * Header of the table. Should be a table row
   */
  header: React.ReactNode;

  /**
   * If the table is on the last page, the next
   * page button will be disabled
   *
   * @default false
   */
  lastPage?: boolean;

  /**
   * Body of the table. Should be a list of table rows or a 
   * table row
   */
  children: React.ReactNode;

  /**
   * Callback to run if the add button is pressed. If no
   * `onClick` prop is passed, add button will not be rendered
   *
   * @default undefined
   */
  onAddItem?: EmptyHandler;

  /**
   * Callback to run when the next page button has been clicked
   *
   * @default undefined
   */
  onNextPage?: EmptyHandler;

  /**
   * Callback to run when the previous page button has been clicked
   *
   * @default undefined
   */
  onPrevPage?: EmptyHandler;
};

const Table = ({
  firstPage,
  header,
  lastPage,
  children,
  onAddItem,
  onNextPage,
  onPrevPage
}: TableProps): JSX.Element => (
  <>
    <ContentCard>
      <MuiTable size="small">
        <TableHead>{header}</TableHead>
        <TableBody>{children}</TableBody>
      </MuiTable>

      {onAddItem && (
        <AddTrainerWrapper>
          <AddItemPlaceholder title="add-trainer" onClick={onAddItem}>
            <AddIcon />
          </AddItemPlaceholder>
        </AddTrainerWrapper>
      )}
    </ContentCard>

    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={2}
    >
      <ButtonContentCard>
        <IconButton
          aria-label="prev-page"
          disabled={firstPage}
          onClick={onPrevPage}
        >
          <ChevronLeft />
        </IconButton>
      </ButtonContentCard>

      <ButtonContentCard>
        <IconButton
          aria-label="next-page"
          disabled={lastPage}
          onClick={onNextPage}
        >
          <ChevronRight />
        </IconButton>
      </ButtonContentCard>
    </Stack>
  </>
);

export default Table;
