import React from 'react';
import constants from 'common/constants/constants';
import DatePickerComponent from './DatePickerComponent';

const FormikDatePicker = ({
  label,
  field: { value, name },
  form: { setFieldValue },
  dateFormat = constants.dateFormat.dob,
  ...others
}) => {
  const handleChange = date => {
    setFieldValue(name, date);
  };
  return (
    <DatePickerComponent
      {...others}
      label={label}
      value={value}
      dateFormat={dateFormat}
      onChange={handleChange}
    />
  );
};

export default FormikDatePicker;
