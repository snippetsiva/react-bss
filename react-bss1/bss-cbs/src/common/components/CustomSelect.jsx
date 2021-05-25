import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { MenuItem, Select, FormControl, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%'
  },
  formLabel: {
    ...theme.typography.body2
  },
  menuSize: {
    height: theme.spacing(12.8)
  }
}));

const SelectComponent = props => {
  const { handleChange, label, selectedValue, options, optionValueKey, optionLabelKey } = props;
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <Typography variant="label1" className={classes.formLabel}>
        {label}
      </Typography>
      <Select
        value={selectedValue}
        onChange={e => handleChange(e.target.value)}
        displayEmpty
        className={classes.menuSize}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="">
          <Trans>Please select</Trans>
        </MenuItem>
        {options.map((item, idx) => (
          <MenuItem value={item[optionValueKey]} key={idx}>
            {item[optionLabelKey]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

SelectComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

SelectComponent.defaultProps = {
  selectedValue: '',
  options: [],
  label: 'Select Option',
  optionValueKey: 'id',
  optionLabelKey: 'label'
};

export default SelectComponent;
