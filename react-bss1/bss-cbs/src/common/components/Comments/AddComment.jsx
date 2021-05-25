import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { Trans } from '@lingui/macro';
import InputBase from '@material-ui/core/InputBase';
import CustomSelect from 'common/components/CustomSelect';
import constants from 'common/constants/constants';
import DatePickerComponent from 'common/components/DatePickerComponent';

const REASONS = [{ value: '0', label: 'Customer Requested' }];

const styles = theme => ({
  textField: {
    background: theme.palette.background.highlight,
    border: `1px solid ${theme.palette.background.main}`,
    borderRadius: 10,
    opacity: 1,
    height: 42,
    padding: 10,
    margin: 10,
    marginLeft: 0,
    width: '100%'
  },
  textWrapper: {
    flex: 1
  },
  timepicker: {
    margin: 0,
    paddingTop: 0,
    '& input': {
      color: theme.palette.text.primary,
      fontSize: theme.spacing(4),
      fontWeight: theme.typography.fontWeightRegular,
      padding: `${theme.spacing(4)} 0 ${theme.spacing(4)} ${theme.spacing(4)}`
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: theme.spacing(2)
    }
  }
});

const AddComment = props => {
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('0');
  const [date, setDate] = useState(new Date());
  const { classes, onNoteAdd } = props;

  useEffect(() => {
    setValue('');
  }, [props.commentsLength]);

  const onValueUpate = e => {
    if (e && e.keyCode === 13) {
      onNoteAdd({ text: value, reason: REASONS[reason].label, endDate: date });
    } else if (e && e.keyCode === 8) {
      const currentValue = value;
      const newValue = currentValue ? currentValue.substr(0, currentValue.length - 1) : '';
      setValue(newValue);
      // } else if (e.key && e.key.length < 2) {
      //  setValue(value + e.key);
    }
  };

  const handleDateChange = event => {
    setDate(event);
  };

  const onValueChange = e => {
    e && e.preventDefault();
    const string = constants.NOTES;
    const value = string.match(/\d+/g).map(Number);
    if (value.length <= value[0]) {
      setValue(e.target.value);
    }
  };

  return (
    <Grid container direction="column" justify="flex-start" spacing={7}>
      <Grid item>
        <Grid container spacing={7}>
          <Grid item alignSelf="flex-end">
            <CustomSelect
              options={REASONS}
              selectedValue={reason}
              handleChange={(newVal) => {setReason(newVal)}}
              label="Reason"
              placeholder="Reason"
              isReadOnly={false}
              optionValueKey="value"
              optionLabelKey="label"
            />
          </Grid>
          <Grid item>
            <DatePickerComponent
              label="Date"
              id="createdAtDate"
              value={date}
              onChange={handleDateChange}
              dateFormat={constants.dateFormat.dob}
              minDate={new Date()}
              // inputVariant="outlined"
              customClasses={{ formInput: classes.timepicker }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid item>
          <Typography variant='body2'>
            <Trans>COMMENTS</Trans>
          </Typography>
        </Grid>
        <Grid item className={classes.textWrapper}>
          <InputBase
            placeholder={constants.NOTES}
            margin="normal"
            className={classes.textField}
            onKeyUp={onValueUpate}
            onChange={onValueChange}
            value={value}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(AddComment);
