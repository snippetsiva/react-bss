import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead
} from '@material-ui/core';

import SvgIcon from 'common/components/SvgIcon/SvgIcon';

const styles = theme => ({
  iconClass: {
    marginRight: 10
  },
  centerAlign: {
    textAlign: '-webkit-center !important'
  },
  nullData: {
    width: 30,
    border: '1px solid'
  },
  tableRowClass: {
    height: '35px'
  }
});
const TableComponent = ({
  classes,
  themeObject,
  headers = [],
  rowData = []
}) => {
  return (
    <Table aria-label="caption table">
      <TableHead>
        <TableRow className={classes.tableRowClass}>
          {headers.map((header, index) => {
            return <TableCell key={index}>{header.name}</TableCell>;
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rowData.map((row, index) => (
          <TableRow key={index} className={classes.tableRowClass}>
            {headers.map(({ keyName }, jIndex) => {
              const { value, variant = 'body1', iconName, align = 'left' } =
                row[keyName] || {};
              return (
                <TableCell
                  key={jIndex}
                  className={`${value === null ? classes.centerAlign : ''}`}
                  align={align}
                >
                  {iconName && value !== null ? (
                    <SvgIcon
                      className={classes.iconClass}
                      iconName={iconName}
                      iconWidth={20}
                    />
                  ) : null}
                  {value !== null ? (
                    <Typography variant={variant} inline gutterBottom>
                      {value}
                    </Typography>
                  ) : (
                    <div className={classes.nullData} />
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default withStyles(styles)(TableComponent);
