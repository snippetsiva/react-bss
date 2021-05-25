import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Typography, Grid } from '@material-ui/core';
import classNames from 'classnames';
import Rating from 'react-rating';
import { Trans } from '@lingui/macro';
import StarRate from '@material-ui/icons/StarRate';
import StarBorder from '@material-ui/icons/StarBorder';

const DialogTitle = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(3)
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: '0px',
    color: theme.palette.white
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label={<Trans>Close</Trans>}
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const styles = theme => ({
  buttonColorBlue: {
    width: '100px',
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.primary.main
    }
  }
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);
const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);
const userPerformanceData = {
  totalInteractions: 234,
  totalInteractionsUp: true,
  totalTickets: 320,
  totalTicketsUp: false,
  avgTimePerCall: '3.28 Mins',
  avgTimePerCallUp: true,
  yourRating: 5,
  yourRatingUp: false
};

class CallTimerDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, callDuration } = this.props;
    return (
      <div>
        <Dialog
          onClose={this.handleClose}
          open={this.state.open}
          paperWidthXl
          className={classNames(classes.root)}
        >
          <DialogTitle onClose={this.handleClose}>
            <Typography variant="h5" className={classNames('semiBold', 'mt5')}>
              <Trans>WRAP CALL</Trans>
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid xs={12}>
                <Typography variant="body1">
                  <Trans>What was queried on Home Page?</Trans>
                </Typography>
                <Typography
                  variant="h5"
                  className={classNames('semiBold', 'mt5')}
                >
                  <Trans>Call Duration</Trans>: {callDuration}
                </Typography>
              </Grid>
              <Grid xs={12} className={classNames('mt30', 'mb30')}>
                <Rating
                  initialRating={userPerformanceData.yourRating}
                  emptySymbol={<StarBorder />}
                  fullSymbol={<StarRate />}
                  className="mt10"
                  readonly
                />
              </Grid>
              <Typography variant="h4">
                <Trans>THIS SITE IS UNDER CONSTRUCTION!!</Trans>
              </Typography>
            </Grid>
          </DialogContent>
          <DialogActions className={classNames(classes.root)}>
            <Button
              onClick={this.handleClose}
              className={classNames(classes.buttonColorBlue, 'mb30')}
            >
              <Trans>SUBMIT</Trans>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(CallTimerDialog);
