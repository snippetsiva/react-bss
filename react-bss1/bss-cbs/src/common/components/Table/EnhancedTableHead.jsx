import React from 'react';
import PropTypes from 'prop-types';
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const EnhancedTableHead = props => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    rows,
    tableName,
    hasCheckBox,
    isCheckedAll
  } = props;

  const useStyles = makeStyles({
    head: {
      height: 30
    },
  });
  const classes = useStyles();

  const createSortHandler = property => event => {
    props.onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classes.head}>
        {(tableName === 'invoice' || hasCheckBox) && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={isCheckedAll || numSelected === rowCount}
              onChange={e => onSelectAllClick(e, rowCount)}
              disabled={props.disableCheckbox}
            />
          </TableCell>
        )}
        {rows.map(row => {
          return row.isCheckBox ? (
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={e => onSelectAllClick(e, rowCount)}
              />
            </TableCell>
          ) : (
            <TableCell
              key={row.id}
              align={row.numeric ? 'right' : 'left'}
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
            >
              <Typography variant="button">{row.label}</Typography>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export default EnhancedTableHead;
