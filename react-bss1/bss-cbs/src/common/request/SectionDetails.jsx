import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { SvgIcon } from '@tt-dclm/dclm-web-ui';

export const SectionDetails = props => {
  const { icon, title, classes = {}, disablePadding = false, disablePaper = false } = props;
  return (
    <Paper className={`${classes.sectionContainer} ${disablePadding ? classes.rootStyleHeader : ''} ${disablePaper ? classes.transparentBackground : ''}`} elevation={0}>
      <Grid container direction="column" justify="center" className={`${classes.block}`} spacing={3}>
        <Grid item className={`${disablePadding ? classes.styleHeader : ''}`}>
          {icon && <SvgIcon iconName={icon} iconWidth={25} />}
          <Typography variant="h4" className={classes.sectionTitle} display="inline" gutterBottom>
            {title}
          </Typography>
        </Grid>
        <Grid item>{props.children}</Grid>
      </Grid>
    </Paper>
  );
};
