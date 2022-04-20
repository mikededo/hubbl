import { TableCell, TableRow } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';

import Table from './Table';

const TableHeader = () => (
  <TableRow>
    <TableCell>Header One</TableCell>
    <TableCell>Header Two</TableCell>
    <TableCell>Header Three</TableCell>
  </TableRow>
);

const TableBodyOne = () => (
  <TableRow>
    <TableCell>Row One Cell One</TableCell>
    <TableCell>Row One Cell Two</TableCell>
    <TableCell>Row One Cell Three</TableCell>
  </TableRow>
);

const TableBodyTwo = () => (
  <TableRow>
    <TableCell>Row Two Cell One</TableCell>
    <TableCell>Row Two Cell Two</TableCell>
    <TableCell>Row Two Cell Three</TableCell>
  </TableRow>
);

describe('<Table />', () => {
  it('should render properly', () => {
    const { container } = render(
      <Table header={<TableHeader />}>
        <TableBodyOne />
        <TableBodyTwo />
      </Table>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByLabelText('prev-page')).not.toBeDisabled();
    expect(screen.getByLabelText('next-page')).not.toBeDisabled();

    // Find the headers
    expect(screen.getByText('Header One')).toBeInTheDocument();
    expect(screen.getByText('Header Two')).toBeInTheDocument();
    expect(screen.getByText('Header Three')).toBeInTheDocument();
    // Find first row
    expect(screen.getByText('Row One Cell One')).toBeInTheDocument();
    expect(screen.getByText('Row One Cell Two')).toBeInTheDocument();
    expect(screen.getByText('Row One Cell Three')).toBeInTheDocument();
    // Find second row
    expect(screen.getByText('Row Two Cell One')).toBeInTheDocument();
    expect(screen.getByText('Row Two Cell Two')).toBeInTheDocument();
    expect(screen.getByText('Row Two Cell Three')).toBeInTheDocument();
  });

  describe('firstPage', () => {
    it('should render the button disabled', () => {
      render(
        <Table header={<TableHeader />} firstPage>
          <TableBodyOne />
          <TableBodyTwo />
        </Table>
      );

      expect(screen.getByLabelText('prev-page')).toBeDisabled();
    });
  });

  describe('lastPage', () => {
    it('should render the button disabled', () => {
      render(
        <Table header={<TableHeader />} lastPage>
          <TableBodyOne />
          <TableBodyTwo />
        </Table>
      );

      expect(screen.getByLabelText('next-page')).toBeDisabled();
    });
  });

  describe('onAddItem', () => {
    it('should not render the button if the callback is not provided', () => {
      render(
        <Table header={<TableHeader />}>
          <TableBodyOne />
          <TableBodyTwo />
        </Table>
      );

      expect(screen.queryByTitle('add-trainer')).not.toBeInTheDocument();
    });

    it('should render the button and call the callback on add trainer click', () => {
      const onClickSpy = jest.fn();

      render(
        <Table header={<TableHeader />} onAddItem={onClickSpy}>
          <TableBodyOne />
          <TableBodyTwo />
        </Table>
      );
      fireEvent.click(screen.getByTitle('add-trainer'));

      expect(screen.getByTitle('add-trainer')).toBeInTheDocument();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onNextPage', () => {
    it('should  call the callback on next page click', () => {
      const onClickSpy = jest.fn();

      render(
        <Table header={<TableHeader />} onNextPage={onClickSpy}>
          <TableBodyOne />
          <TableBodyTwo />
        </Table>
      );
      fireEvent.click(screen.getByLabelText('next-page'));

      expect(screen.getByLabelText('next-page')).toBeInTheDocument();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onPrevPage', () => {
    it('should  call the callback on prev page click', () => {
      const onClickSpy = jest.fn();

      render(
        <Table header={<TableHeader />} onPrevPage={onClickSpy}>
          <TableBodyOne />
          <TableBodyTwo />
        </Table>
      );
      fireEvent.click(screen.getByLabelText('prev-page'));

      expect(screen.getByLabelText('prev-page')).toBeInTheDocument();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
