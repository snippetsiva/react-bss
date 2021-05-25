import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

function FadeModalComponent({ children, isOpen, onClose }) {
  const classes = useStyles();

  return (
    <>
      <Modal
        aria-labelledby="fade-modal-component-title"
        aria-describedby="fade-modal-component-description"
        className={classes.modal}
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300
        }}
      >
        <Fade in={open}>{children}</Fade>
      </Modal>
    </>
  );
}

export default FadeModalComponent;
