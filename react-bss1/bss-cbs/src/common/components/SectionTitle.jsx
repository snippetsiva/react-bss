import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  headingText: {
    color: theme.palette.text.primary
  },
  ctaText: {
    color: theme.palette.primary.main,
    cursor: 'pointer'
  }
});

const SectionTitle = ({
  title,
  ctaTitle,
  classes,
  customClasses,
  onCtaClick = () => {},
  titleVariant
}) => {
  return (
    <Grid container>
      <Grid item>
        <Typography
          variant={titleVariant || 'h6'}
          className={
            customClasses ? customClasses.headingText : classes.headingText
          }
        >
          {title}
        </Typography>
      </Grid>
      {/* <Grid item>
        <Typography
          variant="body1"
          className={classes.ctaText}
          onClick={onCtaClick}
        >
          {ctaTitle || ''}
        </Typography>
      </Grid> */}
    </Grid>
  );
};

export default withStyles(styles)(SectionTitle);
