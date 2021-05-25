import React, { useState, useEffect } from 'react';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import constants from 'common/constants/constants';
import { withStyles } from '@material-ui/core/styles';
import _map from 'lodash/map';
import _findIndex from 'lodash/findIndex';
import _isEmpty from 'lodash/isEmpty';

const styles = (theme) => ({
  label: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight
  },
  item: {
    paddingLeft: 0,
    paddingRight: 0,
    '&:first-child': {
      paddingTop: 0
    },
    '&:last-child': {
      paddingBottom: 0
    }
  },
  list: {
    padding: 0
  },
  rootMenu: {
    boxShadow: `0px 3px 6px ${theme.palette.common.grayShadow}`,
    border: `1px solid ${theme.palette.common.grayShadow}`,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    marginTop: theme.spacing(2)
  }
});

const DropdownChip = ({
  classes,
  className,
  options = [],
  color = 'primary',
  placeholder = 'Select',
  renderOption = (option) => option.name || option,
  onSelect = () => null,
  activeCustomerRequest,
  filterParams,
  defaultSelectedOption = null
}) => {
  const onClickOption = (e, option) => {
    e && e.preventDefault();
    closeDropdown();
    onSelect(option);
    setSelected(option);
  };
  useEffect(() => {
    if (
      activeCustomerRequest === constants.serviceRequestType.ADD_SERVICE &&
      _.get(filterParams, 'activeAccountDetails.accountType', '') ===
      constants.BILLING_ACCOUNT_TYPES.M2M
    ) {
      if (
        _findIndex(options, filterParams.param) > -1 &&
        filterParams.category === placeholder
      ) {
        let selectedOption = {};
        (() => {
          options.forEach((o) => {
            if (o.code === filterParams.param.code) {
              selectedOption = o;
            }
            return null;
          });
        })();
        onClickOption(null, selectedOption);
      }
    }
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (defaultSelectedOption !== null) {
      setSelected(defaultSelectedOption);
    }
  }, [defaultSelectedOption]);

  const openDropdown = (e) => {
    if (options.length) {
      // If no options dont open dropdown
      setAnchorEl(e.target);
    }
  };
  const closeDropdown = () => setAnchorEl(null);

  const onDelete = (e) => {
    e.preventDefault();
    onSelect(null);
    setSelected(null);
  };

  let disabled = false;
  if (!_isEmpty(defaultSelectedOption)) {
    disabled = true;
  } else {
    disabled = _.get(filterParams, 'disableChips', false);
  }
  return (
    <>
      <Chip
        color={color}
        clickable
        onClick={openDropdown}
        className={className}
        onDelete={selected ? onDelete : null}
        classes={{
          label: classes.label
        }}
        variant={selected ? 'default' : 'outlined'}
        label={selected ? renderOption(selected) : placeholder}
        disabled={disabled}
      />
      <Menu
        anchorEl={anchorEl}
        elevation={0}
        classes={{ paper: classes.rootMenu, list: classes.list }}
        onClose={closeDropdown}
        getContentAnchorEl={null}
        open={!!anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        {_map(options, (option, index) => (
          <MenuItem
            className={classes.item}
            key={option.code || index}
            onClick={(e) => onClickOption(e, option)}
          >
            {renderOption(option)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default withStyles(styles)(DropdownChip);
