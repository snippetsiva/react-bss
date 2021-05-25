import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import {
  Toolbar,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Icon,
  Box
} from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import SVGIcon from 'common/components/SvgIcon';
// import FinancialPopOver from '../PopOver/FinancialPopOver';

const Modal = withStyles(theme => ({
  paper: {
    padding: '20px 20px !important',
    width: 328
  }
}))(Popover);

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(1)
  },
  button: {
    height: theme.spacing(10),
    minWidth: theme.spacing(40)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.primary.light,
        backgroundColor: lighten(theme.palette.success.main, 0.85)
      }
      : {
        color: theme.palette.primary.dark,
        backgroundColor: theme.palette.primary.main
      },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.primary,
    // marginTop: 15,
    display: 'inherit',
    cursor: 'pointer'
  },
  title: {
    flex: '0 0 auto'
    // marginBottom: '1em'
  },
  filterBtn: {
    margin: theme.spacing(2)
  },
  downloadIcon: {
    '& svg path': {
      fill: theme.palette.common.white
    }
  },
  callBackIcon: {
    '& svg path': {
      fill: theme.palette.common.white
    },
    '& g path:nth-child(3)': {
      stroke: theme.palette.common.lightSilver,
      fill: theme.palette.common.lightSilver
    }
  }
});

const EnhancedTableToolbar = props => {
  const {
    numSelected,
    classes,
    title,
    onUnpaidInvioce,
    onAllInvoice,
    selected,
    showFilter,
    filterOptions,
    customClasses = {},
    showRefresh,
    subHeader,
    showFilterIcon = true,
    onFilterIconClick,
    triggerApiCall,
    tablehead,
    overViewinvoices,
    downloadInvoice,
    selectedId
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const filterChoices =
    filterOptions && filterOptions.length
      ? filterOptions
      : [
        {
          label: 'Unpaid Invoices',
          value: 'unpaidInvoices',
          onClick: onUnpaidInvioce,
          active: selected === 'new'
        },
        {
          label: 'All Invoices',
          value: 'allInvoices',
          onClick: onAllInvoice,
          active: selected !== 'new'
        }
      ];

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Toolbar className={classNames(classes.root)} disableGutters>
      <div className={classes.title}>
        {!tablehead && (
          <Typography
            variant="h5"
            id="tableTitle"
            gutterBottom
            className={customClasses.titleText}
          >
            {title}
          </Typography>
        )}
        {showFilter &&
          !overViewinvoices &&
          filterChoices.map(filterOption => {
            return (
              <Button
                size="medium"
                variant="contained"
                disableElevation
                color={filterOption.active ? 'primary' : ''}
                className={classNames(classes.filterBtn, {
                  [`${filterOption.classes}`]: filterOption.classes
                })}
                onClick={filterOption.onClick}
              >
                <Typography variant="button">{filterOption.label}</Typography>
              </Button>
            );
          })}
        {subHeader && !showFilter ? <Box mt={5}>{subHeader}</Box> : null}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <>
            <Tooltip title="Download">
              <IconButton aria-label="Download">
                <Icon onClick={() => downloadInvoice(selectedId)}>
                  <SVGIcon
                    iconName="download"
                    iconWidth={17}
                    className={classes.downloadIcon}
                  />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="CallBack">
              <IconButton aria-label="CallBack">
                <Icon>
                  <SVGIcon
                    iconName="call-back"
                    iconWidth={17}
                    className={classes.callBackIcon}
                  />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="CallDispute">
              <IconButton aria-label="CallDispute">
                <Icon>
                  <SVGIcon iconName="call-dispute" iconWidth={17} />
                </Icon>
              </IconButton>
            </Tooltip>
          </>
        ) : (
            // <Tooltip title="Filter list">
            <>
              {showRefresh ? (
                <Button onClick={triggerApiCall}>
                  <SVGIcon iconName="Refresh" iconWidth={17} className="mr10" />
                </Button>
              ) : null}
              {showFilterIcon ? (
                <span onClick={onFilterIconClick}>
                  <SVGIcon iconName="Filter" iconWidth={17} />
                </span>
              ) : null}
              <Modal
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <FinancialPopOver />
              </Modal>
            </>
            // </Tooltip>
          )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
