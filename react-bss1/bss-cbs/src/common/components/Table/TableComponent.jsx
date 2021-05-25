import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Tooltip from '@material-ui/core/Tooltip';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import constants from 'common/constants/constants';
import classNames from 'classnames';
import { Trans } from '@lingui/macro';
import { stableSort, getComparator } from './utils';
import TableToolbar from './TableToolbar';
import TableHeadComponent from './components/TableHeadComponent';

const StyledTableCell = withStyles(theme => ({
  body: {
    borderTop: `${theme.spacing(0.2)} solid ${theme.palette.custom.mercury}`,
    borderBottom: `${theme.spacing(0.2)} solid ${theme.palette.custom.mercury}`,
    '&:first-child': {
      borderLeft: `${theme.spacing(0.2)} solid ${theme.palette.custom.mercury}`
    },
    '&:last-child': {
      borderRight: `${theme.spacing(0.2)} solid ${theme.palette.custom.mercury}`
    }
  }
}))(TableCell);

const useStyles = makeStyles(theme => ({
  tableRoot: {
    borderCollapse: 'separate',
    borderSpacing: `0 ${theme.spacing(2)}`,
    background: theme.palette.background.paper
  },
  tableHeader: {
    // fontSize: theme.spacing(6),
    background: theme.palette.background.paper
  },
  checkboxLabel: {
    '& span': {
      color: theme.palette.custom.silver
    }
  },
  label1: {
    fontSize: theme.spacing(3.5),
    fontWeight: theme.typography.fontWeightRegular,
    textTransform: 'uppercase'
  },
  tableRow: {
    cursor: 'pointer'
  },
  tableSize: { overflowX: 'unset', width: '98%' },
  toolTipData: {
    color: theme.palette.primary.contrastText
  }
}));

const TableComponent = ({
  rows = [],
  columns = [],
  tableName = '',
  noDataInformation = 'No Tasks Available',
  selected = [],
  paginationConfig = {},
  onSelect,
  onSort,
  onPaginationChange,
  tableFeatures = {},
  allDataPassed,
  sortBy,
  disablePagination,
  customClasses = {},
  sortOrder,
  isInteraction = false,
  getTooltip,
  language
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState(sortOrder || 'desc');
  const [orderBy, setOrderBy] = useState(sortBy || '');
  const [pagination, setPagination] = useState({
    show: true,
    totalCount: 0,
    rowsPerPage: 5,
    currentPage: 0,
    rowsPerPageOptions: [5, 10, 25],
    ...paginationConfig
  });

  useEffect(() => {
    setPagination({
      pagination,
      ...paginationConfig
    });
  }, [paginationConfig]);

  useEffect(() => {
    setOrder(sortOrder);
    setOrderBy(sortBy);
  }, [sortOrder, sortBy]);

  const handleRequestSort = (event, property, sortKeyName) => {
    const isAsc = orderBy === property && order === 'asc';
    const finalOrder = isAsc ? 'desc' : 'asc';
    if (onSort) {
      onSort(property, finalOrder, sortKeyName);
      return;
    }
    setOrder(finalOrder);
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    const newConfig = { ...pagination, currentPage: newPage };
    if (onPaginationChange) {
      onPaginationChange(newConfig);
    } else {
      setPagination(newConfig);
    }
  };

  const handleChangeRowsPerPage = event => {
    const newConfig = {
      ...pagination,
      rowsPerPage: parseInt(event.target.value, 10),
      currentPage: 0
    };
    if (onPaginationChange) {
      onPaginationChange(newConfig);
    } else {
      setPagination(newConfig);
    }
  };

  const isSelected = idx => selected.indexOf(idx) !== -1;

  const TableCellVariant = tableFeatures.plainVariant
    ? StyledTableCell
    : TableCell;
  const { hideCheckBox } = tableFeatures;

  const emptyRows =
    pagination.rowsPerPage -
    Math.min(
      pagination.rowsPerPage,
      rows.length - pagination.currentPage * pagination.rowsPerPage
    );

  let sortedData = onSort
    ? [...rows]
    : stableSort(rows, getComparator(order, orderBy));

  if (allDataPassed) {
    sortedData = sortedData.slice(
      pagination.currentPage * pagination.rowsPerPage,
      pagination.currentPage * pagination.rowsPerPage + pagination.rowsPerPage
    );
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n, idx) => idx);
      onSelect && onSelect(newSelecteds, rows[newSelecteds]);
      return;
    }
    onSelect && onSelect([]);
  };

  const handleClick = (event, idx) => {
    const selectedIndex = selected.indexOf(idx);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, idx);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    onSelect && onSelect(newSelected, sortedData[newSelected]);
  };

  return (
    <Box>
      {tableFeatures.noToolbar ? null : (
        <TableToolbar numSelected={selected.length} title={tableName} />
      )}
      <TableContainer
        className={classNames(
          isInteraction ? classes.tableSize : null,
          customClasses.container
        )}
      >
        <Table
          stickyHeader
          className={classes.table}
          aria-labelledby="tableTitle"
          aria-label="table component"
          className={classNames({
            [classes.tableRoot]: tableFeatures.plainVariant
          })}
        >
          <TableHeadComponent
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            columns={columns}
            hideCheckBox={hideCheckBox}
          />
          <TableBody>
            {sortedData.map((row, index) => {
              const isItemSelected = isSelected(index);
              const labelId = `enhanced-table-checkbox-${index}`;
              const tooltipData = getTooltip ? getTooltip(row) : '';

              return (
                <TableRow
                  hover
                  onClick={event => handleClick(event, index)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={index}
                  selected={isItemSelected}
                  className={classNames({
                    [classes.tableRow]: onSelect
                  })}
                >
                  {hideCheckBox ? null : (
                    <TableCellVariant padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                        className={classes.checkboxLabel}
                      />
                    </TableCellVariant>
                  )}
                  {columns.map(column => {
                    const value = row[column.id];
                    const data = column.annotation ? (
                      column.annotation(value, row)
                    ) : (
                        <Typography variant="body1">
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </Typography>
                      );

                    return (
                      <TableCellVariant key={column.id} align={column.align}>
                        <Tooltip
                          disableHoverListener={
                            !tooltipData || column.disableHover
                          }
                          title={
                            <Typography
                              className={classes.toolTipData}
                              variant="subtitle2"
                            >
                              {column.toolTip || tooltipData}
                            </Typography>
                          }
                        >
                          <Typography variant="subtitle2">{data}</Typography>
                        </Tooltip>
                      </TableCellVariant>
                    );
                  })}
                </TableRow>
              );
            })}
            {!sortedData.length && emptyRows > 0 && (
              <TableRow>
                <TableCellVariant
                  colSpan={hideCheckBox ? columns.length : columns.length + 1}
                >
                  {' '}
                  <Typography variant="body1">
                    {noDataInformation}
                  </Typography>
                </TableCellVariant>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination.show && !disablePagination ? (
        <TablePagination
          rowsPerPageOptions={pagination.rowsPerPageOptions}
          component="div"
          count={pagination.totalCount || rows.length}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.currentPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          backIconButtonProps={{
            style: {
              transform: (language === 'fa') ? 'rotate(180deg)' : 'rotate(0deg)'
           },
          }}
          nextIconButtonProps={{
            style: {
              transform: (language === 'fa') ? 'rotate(180deg)' : 'rotate(0deg)'
          },
            
          }}
        />
      ) : null}
    </Box>
  );
};

export default TableComponent;

TableComponent.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  tableName: PropTypes.string,
  selected: PropTypes.array,
  tableFeatures: PropTypes.shape({
    hideCheckBox: PropTypes.bool,
    plainVariant: PropTypes.bool,
    noToolbar: PropTypes.bool
  }),
  paginationConfig: PropTypes.shape({
    show: PropTypes.bool,
    totalCount: PropTypes.number,
    rowsPerPage: PropTypes.number,
    currentPage: PropTypes.number,
    rowsPerPageOptions: PropTypes.array
  }),
  onSelect: PropTypes.func,
  onSort: PropTypes.func,
  onPaginationChange: PropTypes.func,
  allDataPassed: PropTypes.bool,
  customClasses: PropTypes.object
};

TableComponent.defaultProps = {
  rows: [],
  columns: [],
  tableName: '',
  selected: [],
  onSelect: null,
  onSort: null,
  onPaginationChange: null,
  paginationConfig: {
    show: true,
    totalCount: 0,
    rowsPerPage: 5,
    currentPage: 0,
    rowsPerPageOptions: [5, 10, 25]
  },
  tableFeatures: {},
  allDataPassed: true,
  customClasses: {}
};
