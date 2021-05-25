import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  buttonProgress: {
    position: 'absolute',
    color: theme.palette.success.main
  },
  btn: {
    borderRadius: theme.spacing(3)
  }
});

class ConfirmationDialog extends Component {
  handleProceed = () => {};

  render() {
    const {
      isVisibile,
      title,
      description,
      onProceed,
      onCancel,
      cancelBtnText,
      confirmBtnText,
      confirmBtnVariant,
      loader,
      maxWidth = 'xs',
      classes
    } = this.props;
    return (
      <>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth={maxWidth}
          aria-labelledby="confirmation-dialog-title"
          open={isVisibile}
          onClose={onCancel}
        >
          <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirmation-dialog-description">
              {description}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {cancelBtnText && (
              <Button onClick={onCancel} color="primary">
                {cancelBtnText}
              </Button>
            )}
            <Button
              onClick={onProceed}
              color="primary"
              autoFocus
              variant="contained"
              className={classes.btn}
            >
              {confirmBtnText}
              {loader && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(ConfirmationDialog);
