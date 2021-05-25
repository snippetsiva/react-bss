import React from 'react';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = (theme) => ({
  tableHeader: {
    color: theme.palette.text.primary
  }
});
const InnerTable = ({ classes, headings = [], tableValues = [] }) => {
  return (
    <MuiThemeProvider
      theme={(theme) =>
        createMuiTheme({
          ...theme,
          overrides: {
            MuiTable: {
              root: {
                background: 'none',
                borderSpacing: '0 8px',
                borderCollapse: 'separate'
              }
            },
            MuiTableCell: {
              root: {
                borderBottom: 'none',
                padding: '4px 0 4px 10px'
              },
              head: {
                fontSize: 14,
                color: theme.palette.text.primary,
                textTransform: 'uppercase'
              },
              body: {
                fontSize: 16,
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.background.main}`,
                borderBottom: `1px solid ${theme.palette.background.main}`,
                '&:first-child': {
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderLeft: `1px solid ${theme.palette.background.main}`
                },
                '&:last-child': {
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  borderRight: `1px solid ${theme.palette.background.main}`
                }
              }
            },
            MuiTableRow: {
              root: {
                height: 40
              }
            }
          }
        })
      }
    >
      <Table>
        {headings.length ? (
          <TableHead>
            <TableRow>
              {headings.map((item, index) => {
                return (
                  <TableCell align="left" key={index}>
                    <Typography
                      variant="caption"
                      className={classes.tableHeader}
                      display="inline"
                      gutterBottom
                    >
                      {item}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableValues.map((values, index) => {
            return (
              <TableRow key={index}>
                {values.map((tableValue, idx) => {
                  return (
                    <TableCell align="left" key={idx}>
                      <Typography
                        variant="body1"
                        className={classes.tableField}
                        display="inline"
                        gutterBottom
                      >
                        {tableValue}
                      </Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </MuiThemeProvider>
  );
};

export default withStyles(styles)(InnerTable);
