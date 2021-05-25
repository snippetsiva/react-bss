import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import switchStyles from './styles';

const AntSwitchComponent = withStyles(switchStyles)(Switch);

const AntSwitch = props => {
  const {
    handleChange = () => {},
    disableRipple = false,
    value,
    disabled = false,
    checked =  false
  } = props;
  return (
    <AntSwitchComponent
      disableRipple={disableRipple}
      value={value}
      checked={checked}
      disabled={disabled}
      onChange={handleChange}
    />
  );
};

export default AntSwitch;
