import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Trans } from '@lingui/macro';
import InfoIcon from '@material-ui/icons/ErrorOutline';

const styles = theme => ({
  infoIcon: {
    fontSize: 16,
    marginRight: theme.spacing(1),
    color: theme.palette.warning.main
  },
  infoText: {
    color: theme.palette.warning.main
  }
});
class PreCondition extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      text = <Trans>Precondition goes here if any</Trans>
    } = this.props;
    return (
      <Grid container>
        <Grid item>
          <InfoIcon className={classes.infoIcon} />
        </Grid>
        <Grid item>
          <Typography variant="caption" className={classes.infoText}>
            {' '}
            {text}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(PreCondition);
