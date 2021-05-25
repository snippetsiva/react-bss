import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import DatePickerComponent from 'common/components/DatePicker/DatePickerComponent';
import constants from 'common/constants/constants';

const useStyles = makeStyles(theme => ({
  formControl: {
    // margin: theme.spacing(-1),
    width: '100%'
  },
  formLabel: {
    // color: theme.palette.text.primary,
    textTransform: 'uppercase',
    fontFamily: theme.typography.fontFamily
  },
  formInput: {
    borderBottom: `${theme.spacing(0.35)} solid ${theme.palette.custom.grayAthens}`,
    '& div': {
      '&:before': {
        content: 'none'
      }
    }
  }
}));

const DatePickerWrapper = props => {
  const { value, onChange, label, required, disabled, schema } = props;

  const classes = useStyles();

  return (
    <DatePickerComponent
      label={label}
      value={value}
      disabled={schema.disabled}
      labelVariant="caption"
      required={required}
      asterisk={schema.asterisk}
      dateFormat={constants.dateFormat.dob}
      minDate={disabled || schema.disableMinDate ? undefined : new Date()}
      maxDate={schema.maxDate}
      onChange={(newDate, strDate) => {
        const date = moment(strDate, constants.dateFormat.dob).format(constants.dateFormat.reverseDate);
        onChange(date);
      }}
      customClasses={classes}
    />
  );
};

DatePickerComponent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  dateFormat: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};

DatePickerComponent.defaultProps = {
  label: 'Select Date',
  value: new Date(),
  onChange: () => {},
  dateFormat: '',
  required: false,
  disabled: false
};

export default DatePickerWrapper;
