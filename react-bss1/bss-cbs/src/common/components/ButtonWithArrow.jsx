import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import classNames from 'classnames';

const styles = theme => ({
  actionButton: {
    minWidth: theme.spacing(30),
    maxWidth: theme.spacing(35),
    height: theme.spacing(10),
    float: 'right',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    background: `${theme.palette.background.hoverYellow} 0% 0% no-repeat padding-box`,
    borderRadius: 27,
    opacity: 1,
    cursor: 'pointer'
  },
  disabled: {
    background: theme.palette.custom.nobalGrey,
    cursor: 'default'
  },
  link: {
    color: theme.palette.text.darkBlack,
    cursor: 'pointer'
  },
  arrow: {
    lineHeight: theme.spacing(2),
    width: '0.9rem',
    paddingTop: '0.4rem'
  },
  approveBtn: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.darkBlack
  },
  engView: {
    transform: 'rotate(0deg)', 
  },
  faView: {
    transform: 'rotateY(180deg)', 
  }
});

const ButtonWithArrow = ({ onClick = ()=>{}, text, disabled, classes, language }) => {
  const languageRotation = (language === 'fa') ? 'faView' : 'engView';
  return (
    <Grid
      container
      className={`${classes.actionButton} ${disabled ? classes.disabled : ''}`}
      onClick={(!disabled) ? onClick : null}
      justify="space-between"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="body2" className={`${classes.approveBtn}`}>
          {text}
        </Typography>
      </Grid>
      <Grid item>
        <ArrowForwardIosIcon 
        // className={classNames(classes.link, classes.arrow)}
        className={classNames(classes.link, classes.arrow, classes[languageRotation])}
         />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ButtonWithArrow);
