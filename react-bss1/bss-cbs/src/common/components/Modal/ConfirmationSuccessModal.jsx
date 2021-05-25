import React from 'react';
import _get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import Modal from './Modal';
import Lottie from 'react-lottie';
import animationData from 'animation/success-tick';

const useStyles = makeStyles(theme => ({
  mainRoot: {
    flexGrow: 1,
    width: '30em'
  },
  spacing: {
    marginTop: theme.spacing(2)
  },
  button: {
    borderRadius: 60
  }
}));

const ConfirmationSuccessModal = ({
  show,
  mainHeading,
  onCancel,
  customerId,
  onSubmit,
  idValue,
  modalTitle,
  subContent,
  customText,
  hideButton = false
}) => {
  const classes = useStyles();
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  return (
    <Modal show={show} handleClose={onCancel} enableCloseIcon={false} enableActionButtons={false}>
      <div className={classes.mainRoot}>
        <Grid container direction="column" spacing={3}>
          <Grid item align="center">
            <Lottie options={defaultOptions} height={45} width={45} />
          </Grid>
          <Grid item align="center">
            <Typography variant={'h6'}>{mainHeading}</Typography>
          </Grid>
          {modalTitle && (
            <Grid item align="center">
              <Typography variant={'subtitle1'}>{`${modalTitle} ${subContent && subContent}`}</Typography>
            </Grid>
          )}
          <Grid item align="center" className={classes.spacing}>
            {idValue && <Typography variant={'body1'}>{`Request ID : ${idValue}`}</Typography>}
            {customerId && <Typography variant={'body1'}>{`Customer ID : ${customerId}`}</Typography>}
          </Grid>
          {customText && (
            <Grid item align="center" className={classes.spacing}>
              <Typography variant={'body1'}>{customText}</Typography>
            </Grid>
          )}
          {!hideButton && (
            <Grid item xs className={classes.spacing} align="center">
              <Button
                data-cy="successModal-doneBtn"
                variant="contained"
                size="small"
                color="primary"
                className={classes.button}
                onClick={onSubmit}
              >
                Done
              </Button>
            </Grid>
          )}
        </Grid>
      </div>
    </Modal>
  );
};

export default ConfirmationSuccessModal;
