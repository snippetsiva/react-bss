import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import SvgIcon from '../SvgIcon';
import { Trans } from '@lingui/macro';

const useStyles = makeStyles(theme => ({
  modalContainer: {
    padding: 10
  },
  closeIcon: {
    cursor: 'pointer'
  }
}));

const Modal = props => {
  const {
    children,
    handleSubmit,
    handleClose,
    disableBtn,
    modalTitle,
    dialogProps,
    enableActionButtons = true,
    titleClassName = '',
    dialogClassName = '',
    titleVariant = 'h2',
    enableCloseIcon = true,
    show = true,
    customClasses = null
  } = props;
  if (!show) {
    return null;
  }
  const classes = useStyles();
  const finalClasses = customClasses || classes;
  return (
    <Dialog disableBackdropClick disableEscapeKeyDown className={finalClasses.modalContainer} open onClose={handleClose} maxWidth {...dialogProps}>
      {modalTitle || enableCloseIcon ? (
        <DialogTitle id="form-dialog-title" className={titleClassName}>
          <Grid container justify={modalTitle ? 'space-between' : 'flex-end'} alignItems="center">
            {modalTitle ? (
              <Grid item>
                <Typography variant={titleVariant}>{modalTitle}</Typography>
              </Grid>
            ) : null}
            {enableCloseIcon ? (
              <Grid item onClick={handleClose}>
                <SvgIcon iconName="close-black" iconWidth={36} iconColor="grey" className={finalClasses.closeIcon} />
              </Grid>
            ) : null}
          </Grid>
        </DialogTitle>
      ) : null}
      <DialogContent className={dialogClassName}>{children}</DialogContent>
      {enableActionButtons ? (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            <Trans>Cancel</Trans>
          </Button>
          <Button
            onClick={disableBtn ? () => {} : handleSubmit}
            color="primary"
            variant="contained"
            disabled={disableBtn}
          >
            <Trans>Submit</Trans>
          </Button>
        </DialogActions>
      ) : null}
    </Dialog>
  );
};

Modal.propTypes = {
  children: PropTypes.any,
  show: PropTypes.bool,
  enableCloseIcon: PropTypes.bool,
  handleSubmit: PropTypes.func,
  handleClose: PropTypes.func,
  disableBtn: PropTypes.bool,
  modalTitle: PropTypes.string,
  dialogProps: PropTypes.object,
  enableActionButtons: PropTypes.bool,
  titleClassName: PropTypes.string,
  dialogClassName: PropTypes.string,
  titleVariant: PropTypes.string,
  customClasses: PropTypes.object
};

Modal.defaultProps = {
  children: null,
  disableBtn: true,
  enableActionButtons: true,
  show: false,
  enableCloseIcon: true,
  handleSubmit: () => {},
  modalTitle: '',
  dialogProps: {},
  titleClassName: '',
  dialogClassName: '',
  titleVariant: 'h2',
  customClasses: {}
};

export default Modal;
