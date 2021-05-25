import React from 'react';
import _isEmpty from 'lodash/isEmpty';
import _omit from 'lodash/omit';
import MenuItem from '@material-ui/core/MenuItem';
import { prepareDropdownData } from 'utils/utilService';
import { TextField } from 'formik-material-ui';

class FormikTextField extends React.Component {
  render() {
    const {
      field: { name },
      form: { values, errors },
      selectKey,
      selectValue,
      selectItems = []
    } = this.props;

    const list = prepareDropdownData(selectItems, selectKey, selectValue);
    const fieldProps = _omit(this.props, ['selectKey', 'selectValue', 'selectItems']);
    return (
      <TextField {...fieldProps} error={!_isEmpty(errors[name])} value={values[name]}>
        {list.length > 0 &&
          list.map((item, index) => (
            <MenuItem key={index} value={item.value}>
            {item.label}
            </MenuItem>
          ))}
      </TextField>
    );
  }
}

export default FormikTextField;
