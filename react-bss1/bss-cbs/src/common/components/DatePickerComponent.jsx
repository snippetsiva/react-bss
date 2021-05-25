import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { FormControl, Typography } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import classNames from 'classnames';
import constants from 'common/constants/constants';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%'
  },
  formLabel: {
    ...theme.typography.body2
  }
}));

/*
 * separate theme provider implemented to override global theme behaviour
 * date component uses mui-paper internally to show option menu,
 * which is adopting global behaviour of overridden paper component.
 * */

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  },
  overrides: {}
});

const getMaterialFormat = dateFormat => {
  return dateFormat.toLowerCase().replace('mm', 'MM');
};

const DatePickerComponent = props => {
  const {
    onChange,
    label,
    value,
    dateFormat,
    labelVariant,
    customClasses,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    id,
    required,
    disabled,
    inputVariant
  } = props;

  const classes = useStyles();
  const dateLabelFormat = getMaterialFormat(dateFormat);

  return (
    <ThemeProvider theme={theme}>
      <FormControl className={classNames(classes.formControl, (customClasses || {}).formControl)}>
        <Typography
          variant={labelVariant || 'label1'}
          className={classNames(classes.formLabel, (customClasses || {}).formLabel)}
        >
          {label}
        </Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            id={id || label}
            value={value}
            onChange={(newDate, strDate) => {
              onChange(newDate, strDate);
            }}
            minDate={minDate}
            maxDate={maxDate}
            disableFuture={disableFuture}
            disablePast={disablePast}
            required={required}
            disabled={disabled}
            variant="inline"
            inputVariant={inputVariant}
            format={dateLabelFormat}
            className={(customClasses || {}).formInput}
            KeyboardButtonProps={{
              'aria-label': 'change date'
            }}
          />
        </MuiPickersUtilsProvider>
      </FormControl>
    </ThemeProvider>
  );
};

DatePickerComponent.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.string,
  dateFormat: PropTypes.string,
  labelVariant: PropTypes.string,
  customClasses: PropTypes.object,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};

DatePickerComponent.defaultProps = {
  onChange: () => {},
  label: '',
  value: new Date(),
  dateFormat: constants.dateFormat.dob,
  labelVariant: 'label1',
  customClasses: {},
  disableFuture: false,
  disablePast: false,
  minDate: false,
  maxDate: false,
  id: '',
  required: false,
  disabled: false
};

export default DatePickerComponent;
