import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import _isEqual from 'lodash/isEqual';
import _filter from 'lodash/filter';
import _reduce from 'lodash/reduce';
import _get from 'lodash/get';
import { Trans } from '@lingui/macro';
import dayjs from 'dayjs';
import { decimalService } from 'common/utils/stringUtil';
import classnames from 'classnames';
import _capitalize from 'lodash/capitalize';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './TableToolbar';
import constants from 'common/constants/constants';
import Button from '@material-ui/core/Button';
import SvgIcon from 'common/components/SvgIcon/SvgIcon';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const styles = (theme) => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  infoIcon: {
    width: '16px',
    height: '16px',
    borderRadius: '33px',
    verticalAlign: 'inherit',
    cursor: 'pointer',
    fill: theme.palette.common.white,
    stroke: theme.palette.icon.stroke,
    background: `${theme.palette.icon.stroke} 0% 0% no-repeat padding-box`
  },
  paid: {
    background: theme.palette.success.main,
    padding: '2px 8px',
    textAlign: 'left',
    color: theme.palette.common.white,
    textTransform: 'uppercase',
    display: 'inline-block',
    borderRadius: 16,
    fontSize: 10
  },
  unpaid: {
    background: theme.palette.error.main,
    padding: '2px 8px',
    textAlign: 'left',
    color: theme.palette.common.white,
    textTransform: 'uppercase',
    display: 'inline-block',
    borderRadius: 16,
    fontSize: 10
  },
  PriceColor: {
    color: theme.palette.error.main
  },
  paginationDropDown: {
    padding: 0
  },
  pagination: {
    marginBottom: theme.spacing(10)
  },
  priceColorRed: {
    color: theme.palette.error.main
  },
  priceColorGreen: {
    color: theme.palette.success.main
  },
  downloadIcon: {
    marginRight: theme.spacing(6)
  },
  downloadArea: {
    color: theme.palette.primary.main
  }
});

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    const selected = _reduce(props.data, (res, item) => res, []);
    this.state = {
      order: 'asc',
      orderBy: 'invoiceId',
      selected,
      data: props.data || [],
      page: 0,
      rowsPerPage: 10,
      totalNoOfRows: props.totalNoOfRows || 0,
      sort: 'invoiceDate',
      filterName: '',
      id: ''
    };
  }

  componentDidUpdate() {
    if (
      !_isEqual(this.props.data, this.state.data) ||
      this.state.totalNoOfRows !== this.props.totalNoOfRows
    ) {
      this.setState({
        data: this.props.data,
        totalNoOfRows: this.props.totalNoOfRows,
        filterName: '',
        page: 0,
        anchorEl: null,
        selectedIndex: null
      });
    }
  }

  //const [anchorEl, setAnchorEl] = useState(null);
  //const [selectedIdx, setSelectedIdx] = useState(null);
  updateAnchorEl = (target, idx) => {
    this.setState({
      anchorEl: target,
      selectedIndex: idx
    });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const sort = `${order === 'asc' ? '' : '-'}${orderBy}`;

    this.setState({ order, orderBy, sort });

    this.props.onPaginationUpdate &&
      this.props.onPaginationUpdate(
        this.state.rowsPerPage,
        this.state,
        this.state.page,
        this.state.sort,
        true
      );
  };

  handleSelectAllClick = (event, rowCount) => {
    if (event.target.checked) {
      this.setState({ selected: Array.from(Array(rowCount).keys()) });
      return;
    }
    this.setState({ selected: [] });
    // this.props.handleSelectAll && this.props.handleSelectAll(this.state.selected)
  };

  handleClick = (event, id, isChecked) => {
    event && event.preventDefault();
    event && event.stopPropagation();
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    // if (newSelected.includes(this.props.isSelectedId)) {
    //   return;
    // } else {
    this.setState({ selected: newSelected, id });
    this.props.checkBoxClickAction &&
      this.props.checkBoxClickAction(id, isChecked);
    // }
  };

  onRowClick = (evt, id) => {
    evt && evt.preventDefault();
    evt && evt.stopPropagation();
    // const { selected } = this.state;
    // const selectedIndex = selected.indexOf(id);
    //this.props.rowClickAction && this.props.rowClickAction(id);
  };

  onItemClick = (evt, index, item) => {
    evt && evt.preventDefault();
    evt && evt.stopPropagation();
    //this.props.rowClickAction && this.props.rowClickAction(index,item);
  };

  handleChangePage = (event, page) => {
    const { rowsPerPage, sort } = this.state;
    this.props.onPaginationUpdate &&
      this.props.onPaginationUpdate(rowsPerPage, page, sort, true);
    this.setState({ page });
  };

  getTableCell = (tableName, isSelected, disableCheckbox, obj, rowId) => {
    const {
      classes,
      config,
      getComponent,
      selfStyle,
      defaultCurrency
    } = this.props;
    if (selfStyle) {
      return (
        <Fragment>
          {config.columns.map(
            ({ id, isDate, customComponent, isCheckBox }, index) => {
              if (isCheckBox) {
                return (
                  <TableCell
                    padding="checkbox"
                    key={index}
                    onClick={(e) => this.handleClick(e, rowId, isSelected)}
                  >
                    <Checkbox
                      color="default"
                      disabled={disableCheckbox}
                      checked={isSelected}
                    />
                  </TableCell>
                );
              }
              return (
                <TableCell align="left" key={index}>
                  {customComponent ? (
                    getComponent(obj)
                  ) : (
                    <Typography variant="body1">
                      {isDate
                        ? dayjs(obj[id]).format(
                            constants.dateFormat.fullDateMonthWithTime
                          )
                        : obj[id]}
                    </Typography>
                  )}
                </TableCell>
              );
            }
          )}
        </Fragment>
      );
    }
    /**
     * TODO: reavamp financial tab code to use above dynamically generated cell's logic
     * below code is financial tab table specific. Shouldn't be touched or used.
     */
    if (tableName === 'recharge') {
      const balanceColumnData =
        (config.columns.filter((a) => a.id === 'balance') || [])[0] || {};
      return (
        <Fragment>
          <TableCell
            padding="checkbox"
            onClick={(e) => this.handleClick(e, rowId, isSelected)}
          >
            <Checkbox color="default" checked={isSelected} />
          </TableCell>
          <TableCell component="th" scope="row">
            {obj.chargeDate}
          </TableCell>
          <TableCell align="left">{obj.serialNumber}</TableCell>
          <TableCell align="left">{obj.cardType}</TableCell>
          <TableCell align="right" className={classes.PriceColor}>
            {defaultCurrency} {obj.balance}
          </TableCell>
        </Fragment>
      );
    }
    const invoiceColumnData =
      (config.columns.filter((a) => a.id === 'invoiceTotal') || [])[0] || {};

    return (
      <Fragment>
        <TableCell
          padding="checkbox"
          onClick={(e) =>
            !this.props.disableCheckbox &&
            // !obj.hideCheckbox && // uncomment this if you do not want to select the paid invoices.
            this.handleClick(e, rowId, isSelected)
          }
        >
          {/* Uncomment below code if you want to hide the checkboxes for paid invoices. */}
          {/* {!obj.hideCheckbox && ( */}
          <Checkbox
            color="default"
            checked={isSelected}
            disabled={this.props.disableCheckbox}
          />
          {/* )} */}
        </TableCell>
        <TableCell component="th" scope="row">
          {obj.invoiceId}
        </TableCell>
        <TableCell align="left">
          {dayjs(obj.invoiceDate).format(constants.dateFormat.fullDateMonth)}
        </TableCell>
        <TableCell align="left">
          {dayjs(obj.dueDate).format(constants.dateFormat.fullDateMonth)}
        </TableCell>
        <TableCell
          align="right"
          className={classes[`fontColor${invoiceColumnData.color}`]}
        >
          {decimalService(obj.invoiceTotal, 2)} {'  '}
          <InfoIcon className={classes.infoIcon} />
        </TableCell>
        <TableCell
          align="right"
          className={`${obj.invoiceRemaining > 0 ? classes.priceColorRed : ''}`}
        >
          {decimalService(obj.invoiceRemaining, 2)}
        </TableCell>
        <TableCell align="center">
          {(obj.status || '').toLowerCase() === 'new' ? (
            <Typography className={classes.unpaid}>Unpaid</Typography>
          ) : (
            <Typography className={classes.paid}>Paid</Typography>
          )}
        </TableCell>
      </Fragment>
    );
  };

  moreVert = (index, id) => {
    const { classes, downloadFile, downloadIcon = 'DocumentDownload' } = this.props;
    return (
      <TableCell align="left">
        <Button
          onClick={(e) => {
            downloadFile(index, id);
          }}
          className={classes.downloadArea}
        >
          <SvgIcon iconWidth={20} iconName={downloadIcon} />
        </Button>
      </TableCell>
    );
  };

  handleChangeRowsPerPage = (event) => {
    const { page, sort } = this.state;
    this.props.onPaginationUpdate &&
      this.props.onPaginationUpdate(event.target.value, page, sort, false);
    this.setState({ rowsPerPage: event.target.value });
    this.setState({ page: 0 });
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  onFilterClick = (filterName) => {
    this.setState({ filterName });
  };

  filterData = (data) => {
    return _filter(data, { status: _capitalize(this.state.filterName) });
  };

  getTotalRows = (finalData) => {
    const {
      tableData = {},
      tableName,
      rentalCharges = [],
      totalNoOfRows,
      filterData,
      tableProps
    } = this.props;
    switch (tableName) {
      case 'receipts':
        return (tableData.receiptData || []).length;
      case 'payments':
        return (tableData.refundData || []).length;
      case 'adjustment':
        return (tableData.adjustmentData || []).length;
      case 'all':
        if (filterData && filterData['@type']) {
          const filteredData = tableData.allData.filter(
            (item) => item.description === filterData['@type']
          );
          return filteredData.length;
        }
        return (tableData.allData || []).length;
      case 'rentals':
        return rentalCharges.length;
      case 'technicalService':
        return totalNoOfRows;
      default:
        return finalData.length;
    }
  };

  render() {
    const {
      classes,
      config,
      tableName,
      tableTitle = '',
      disableToolBar,
      filterOptions = [],
      customClasses = {},
      showRefresh,
      tableData,
      subHeader,
      hasCheckBox,
      alwaysShowFilter,
      showFilterIcon,
      onFilterIconClick,
      triggerApiCall,
      rentalCharges,
      noDataMessage,
      tablehead,
      overViewinvoices,
      downloadFile,
      disableCheckbox,
      filterAllTabData,
      isIconVisible = true,
      language
    } = this.props;

    const {
      data = [],
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      totalNoOfRows,
      filterName,
      id
    } = this.state;
    const adjustmentSorting =
      tableData.adjustmentData &&
      tableData.adjustmentData.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const finalData = filterName ? this.filterData(data) : data;
    const sortedFinalData = finalData
      ? finalData.sort(function (a, b) {
          return new Date(b.invoiceDate) - new Date(a.invoiceDate);
        })
      : [];
    // filteredData is for All Tab - filterAllTabData from props
    const filteredData =
      tableData.allData && filterAllTabData
        ? filterAllTabData(tableData.allData)
        : tableData.allData;
    const Amount =
      (config.columns.filter((a) => a.id === 'Amount') || [])[0] || {};

    const Receipts = [];
    if (tableName === 'receipts') {
      tableData.receiptData &&
        tableData.receiptData.map((item) => {
          Receipts.push({
            date: item.transactionDate,
            paymentMethod: _get(item.paymentMethod[0], '@type', ''),
            name: item.accessedBy,
            id: item.id,
            price: item.amount.value,
            unit: item.amount.unit
          });
        });
    }

    const Refunds = [];

    if (tableName === 'payments') {
      tableData.refundData &&
        tableData.refundData.map((item) => {
          Refunds.push({
            date: item.refundDate,
            description: item.description,
            name: item.accessedBy,
            id: item.id,
            price: item.amount.value,
            unit: item.amount.unit
          });
        });
    }

    const showFilter =
      alwaysShowFilter || (selected.length ? config.showToolBarFilter : false);
    const isNamedTablesDataEmpty =
      (!tableData.adjustmentData || tableData.adjustmentData.length === 0) &&
      (!Receipts || Receipts.length === 0) &&
      (!Refunds || Refunds.length === 0) &&
      (!rentalCharges || rentalCharges.length === 0);

    const hasData =
      (sortedFinalData && sortedFinalData.length > 0) ||
      (tableData.adjustmentData && tableData.adjustmentData.length > 0) ||
      (Receipts && Receipts.length > 0) ||
      (Refunds && Refunds.length > 0) ||
      (rentalCharges && rentalCharges.length > 0);

    return (
      <Fragment>
        {!disableToolBar && (
          <EnhancedTableToolbar
            numSelected={selected.length}
            title={tableTitle || 'FINANCIALS'}
            onUnpaidInvioce={() =>
              this.onFilterClick(tableName === 'invoice' ? 'new' : '')
            }
            subHeader={subHeader}
            onAllInvoice={() => this.onFilterClick('')}
            selected={filterName}
            showFilter={showFilter}
            filterOptions={filterOptions}
            customClasses={customClasses}
            showRefresh={showRefresh}
            showFilterIcon={showFilterIcon}
            onFilterIconClick={onFilterIconClick}
            triggerApiCall={triggerApiCall}
            tablehead={tablehead}
            overViewinvoices={overViewinvoices}
            downloadInvoice={downloadFile}
            selectedId={id}
          />
        )}
        <div
          className={classnames(
            classes.tableWrapper,
            customClasses.tableWrapper
          )}
        >
          <Table
            className={classnames(classes.table, customClasses.table)}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              disableCheckbox={disableCheckbox}
              isCheckedAll={this.props.isCheckedAll}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={(e, rowCount) =>
                this.handleSelectAllClick(e, rowCount)
              }
              onRequestSort={this.handleRequestSort}
              rowCount={this.getTotalRows(sortedFinalData)}
              rows={config.columns}
              tableName={tableName}
              hasCheckBox={hasCheckBox}
            />
            <TableBody>
              {sortedFinalData.length > 0
                ? Array.isArray(sortedFinalData) &&
                  (rowsPerPage > 0
                    ? sortedFinalData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : sortedFinalData
                  ).map((n, index) => {
                    const isSelected =
                      this.props.isSelectedId || this.isSelected(n.id);
                    return (
                      <TableRow
                        hover
                        onClick={(event) => this.onRowClick(event, n.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isSelected}
                        // disabled={disableCheckbox}
                        className={customClasses.borderRow}
                      >
                        {this.getTableCell(
                          tableName,
                          isSelected,
                          disableCheckbox,
                          n,
                          n.id
                        )}
                        {(isIconVisible && tableName !== 'recharge') && this.moreVert(index, n.id)}
                      </TableRow>
                    );
                  })
                : isNamedTablesDataEmpty && tableName !== 'all'
                ? noDataMessage || (
                    <TableRow>
                      <TableCell colSpan={config.columns.length + 1}>
                        <Typography variant="body1" align="center">
                          <Trans>No Data Found</Trans>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                : null}
            </TableBody>
            <TableBody>
              {!finalData || (!finalData.length && tableName === 'adjustment')
                ? adjustmentSorting &&
                  adjustmentSorting.map((item, key) => (
                    <TableRow key={key} onClick={(event) => this.onItemClick(event, key, item)}>
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => this.handleClick(e, key)}
                      >
                        <Checkbox
                          color="default"
                          checked={this.isSelected(key)}
                        />
                      </TableCell>
                      <TableCell>
                        {dayjs(item.date).format(
                          constants.dateFormat.fullDateMonthWithTime
                        )}
                      </TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.AdjustmentType}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell
                        align="left"
                        className={
                          item.transactionType === "credit"
                            ? classes.priceColorGreen
                            : item.transactionType === "debit" ? classes.priceColorRed : classes.priceColor
                        }
                      >
                        {item.unit}
                        {'  '}
                        {decimalService(item.amount, 2)}
                      </TableCell>

                    </TableRow>
                  ))
                : null}
            </TableBody>
            <TableBody>
              {!finalData || (!finalData.length && tableName === 'receipts')
                ? Receipts.map((item, key) => {
                  return (
                    <TableRow key={key} onClick={(event) => this.onItemClick(event, key, item)}>
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => this.handleClick(e, key)}
                      >
                        <Checkbox
                          color="default"
                          checked={this.isSelected(key)}
                        />
                      </TableCell>
                      <TableCell>
                        {dayjs(item.date).format(
                          constants.dateFormat.fullDateMonthWithTime
                        )}
                      </TableCell>
                      <TableCell>{item.paymentMethod}</TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell
                        align="left"
                        className={classes.priceColorGreen}
                      >
                        {item.unit}
                        {'  '}
                        {decimalService(item.price, 2)}
                      </TableCell>
                      {isIconVisible && this.moreVert(key, item.id)}
                    </TableRow>
                  )
                })
                : null}
            </TableBody>
            <TableBody>
              {!finalData || (!finalData.length && tableName === 'payments')
                ? Refunds.map((item, key) => (
                    <TableRow key={key} onClick={(event) => this.onItemClick(event, key, item)}>
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => this.handleClick(e, key)}
                      >
                        <Checkbox
                          color="default"
                          checked={this.isSelected(key)}
                        />
                      </TableCell>
                      <TableCell>
                        {dayjs(item.date).format(
                          constants.dateFormat.fullDateMonthWithTime
                        )}
                      </TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="left" className={classes.PriceColor}>
                        {item.unit}
                        {'  '}
                        {decimalService(item.price, 2)}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
            <TableBody>
              {!finalData || (!finalData.length && tableName === 'rentals')
                ? Array.isArray(rentalCharges) &&
                  rentalCharges.map((item, key) => (
                    <TableRow key={key} onClick={(event) => this.onItemClick(event, key, item)}>
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => this.handleClick(e, key)}
                      >
                        <Checkbox
                          color="default"
                          checked={this.isSelected(key)}
                        />
                      </TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {dayjs(item.startDate).format(
                          constants.dateFormat.fullDateMonthWithTime
                        )}
                      </TableCell>
                      <TableCell>
                        {dayjs(item.endDate).format(
                          constants.dateFormat.fullDateMonthWithTime
                        )}
                      </TableCell>
                      <TableCell className={classes.PriceColor}>
                        {item.unit}
                        {'  '}
                        {decimalService(item.value, 2)}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
            <TableBody>
              {!finalData || (!finalData.length && tableName === 'refunds')
                ? Array.isArray(rentalCharges) &&
                  rentalCharges.map((item, key) => (
                    <TableRow key={key} onClick={(event) => this.onItemClick(event, key, item)}>
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => this.handleClick(e, key)}
                      >
                        <Checkbox
                          color="default"
                          checked={this.isSelected(key)}
                        />
                      </TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {dayjs(item.startDate).format(
                          constants.dateFormat.fullDateMonthWithTime
                        )}
                      </TableCell>
                      <TableCell>
                        {dayjs(item.endDate).format(
                          constants.dateFormat.fullDateMonthWithTime
                        )}
                      </TableCell>
                      <TableCell className={classes.PriceColor}>
                        {item.unit}
                        {'  '}
                        {decimalService(item.value, 2)}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
            <TableBody>
              {!finalData || (!finalData.length && tableName === 'all')
                ? filteredData &&
                  filteredData.map((item, key) => {
                    return <TableRow
                      key={key} data-row-id={key}
                      onClick={(event) => this.onItemClick(event, key, item)}>
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => this.handleClick(e, key)}
                      >
                        <Checkbox
                          color="default"
                          checked={this.isSelected(key)}
                        />
                      </TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        {dayjs(item.date).format(
                          constants.dateFormat.fullDateMonthWithTime
                        )}
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.user}</TableCell>
                      <TableCell>
                        {item.due_date
                          ? dayjs(item.due_date).format(
                            constants.dateFormat.date
                          )
                          : item.due_date}
                      </TableCell>
                      <TableCell align="left" className={
                        item.transactionType === "credit"
                          ? classes.priceColorGreen
                          : item.transactionType === "debit" ? classes.priceColorRed : classes.priceColor
                      }>
                        {typeof item.amount === 'object'
                          ? `${item.amount.unit} ${decimalService(
                            item.amount.value,
                            2
                          )}`
                          : decimalService(item.amount, 2)}
                      </TableCell>
                    </TableRow>
              })
                : null}
            </TableBody>
          </Table>
        </div>
        {hasData &&
          (!config.alwaysShowPagination && selected.length ? null : (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={this.getTotalRows(finalData)}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              classes={{ select: classes.paginationDropDown }}
              className={classes.pagination}
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
          ))}
      </Fragment>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableData: PropTypes.shape({
    receiptData: PropTypes.array,
    refundData: PropTypes.array,
    adjustmentData: PropTypes.array
  })
};

EnhancedTable.defaultProps = {
  config: {},
  data: [],
  tableName: '',
  enableTabToolBar: true,
  enablePagination: true,
  onPaginationUpdate: null,
  rowClickAction: null,
  totalNoOfRows: null,
  rentalCharges: [],
  tableData: {
    receiptData: [],
    refundData: [],
    adjustmentData: []
  }
};

export default withStyles(styles)(EnhancedTable);
