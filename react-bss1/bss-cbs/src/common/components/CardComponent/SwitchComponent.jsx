import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { Typography, Grid, Box } from '@material-ui/core';
import { Trans } from '@lingui/macro';

const AntSwitchComponent = withStyles(theme => ({
  root: {
    width: theme.spacing(12),
    height: theme.spacing(6.5),
    marginTop: theme.spacing(1),
    padding: 0,
    display: 'flex',
    '& .MuiIconButton-label': {
      color: theme.palette.text.secondary
    },
    '& .Mui-disabled': {
      '& + $track': {
        opacity: 1
      }
    }
  },
  label: {
    color: 'currentColor'
  },
  switchBase: {
    padding: '0px',
    marginLeft: theme.spacing(1.3),
    marginTop: theme.spacing(1.1),
    color: theme.palette.common.white,
    border: `2px solid ${theme.palette.text.secondary}`,
    '& + $track': {
      backgroundColor: theme.palette.common.white,
      opacity: 1,
      border: `2px solid ${theme.palette.text.secondary}`
    },
    '&$checked': {
      borderColor: theme.palette.primary.main,
      // margin: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(1),
      transform: `translateX(${theme.spacing(5)})`,
      color: theme.palette.primary.main,
      '& + $track': {
        backgroundColor: theme.palette.common.white,
        opacity: 1,
        border: `2px solid ${theme.palette.primary.main}`
      },
      '& .MuiIconButton-label': {
        color: theme.palette.primary.main
      }
    }
  },
  thumb: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    boxShadow: 'none'
  },
  track: {
    border: `${theme.spacing(6)} solid ${theme.palette.text.primary}`,
    height: 'auto',
    borderRadius: theme.spacing(3),
    opacity: 1,
    backgroundColor: `${theme.palette.common.white} !important`
  },
  checked: {}
}))(Switch);

const SwitchComponent = props => {
  const {
    onChange = () => {},
    disableRipple = false,
    value,
    label,
    disabled = false,
    required,
    checked
  } = props;

  const handleChnage = pros => {
    // pros.value = pros.target.checked;
    onChange(pros.target.checked || false);
  };

  return (
    <Box mb={3} mt={3}>
      <Grid container spacing={4}>
        <Grid item>
          <Typography variant="body1">{label}</Typography>
        </Grid>
        <Grid item>
          <AntSwitchComponent
            disableRipple={disableRipple}
            value={value}
            checked={checked || value}
            disabled={disabled}
            onChange={handleChnage}
            required={required}
            classes={{ label: { color: 'currentColor' } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SwitchComponent;
