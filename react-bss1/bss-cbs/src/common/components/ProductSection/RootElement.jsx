import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import SvgIcon from 'common/components/SvgIcon';

const styles = (theme) => ({
  sectionContainer: {
    marginTop: 20
  },
  rootStyleHeader: {
    padding: 0
  },
  root: {
    padding: theme.spacing(8) // 20
  },
  styleHeader: {
    padding: '20px 20px',
    borderRadius: '16px 16px 0px 0px'
  },
  block: {
    display: 'block'
  },
  headingIcon: {
    width: 30,
    marginRight: '1em',
    verticalAlign: 'sub'
  },
  sectionTitle: {
    textTransform: 'capitalize',
    verticalAlign: 'top',
    marginLeft: 24
  },
  link: {
    letterSpacing: '0.01px',
    color: theme.palette.primary.contrastText,
    textAlign: 'left',
    float: 'right',
    cursor: 'pointer'
  },
  imageRoot: {
    width: 48,
    height: 48,
    background: `${theme.palette.background.main} 0% 0% no-repeat padding-box`,
    borderRadius: 100,
    padding: '10px 12px',
    float: 'right',
    display: 'inline-block'
  },
  headerElement: {
    paddingBottom: theme.spacing(3)
  }
});

const RootElement = (props) => {
  const {
    icon,
    title,
    classes,
    disablePadding = false,
    link = '',
    image = null,
    disableMarginTop = false,
    viewHistory = () => { }
  } = props;
  return (
    <Paper
      className={classNames(
        !disableMarginTop && classes.sectionContainer,
        disablePadding ? classes.rootStyleHeader : classes.root
      )}
      elevation={0}
    >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
        className={`${classes.block}`}
      >
        {(icon || title || image) && (
          <Grid item className={`${disablePadding ? classes.styleHeader : ''}`}>
            {icon && <SvgIcon iconName={icon} iconWidth={30} />}
            {title && (
              <Typography
                variant="h2"
                className={classes.sectionTitle}
                display="inline"
                gutterBottom
              >
                {title}
              </Typography>
            )}

            {link && (
              <Typography
                variant="caption"
                className={classes.link}
                display="inline"
                gutterBottom
                onClick={viewHistory}
              >
                {link}
              </Typography>
            )}
            {image && (
              <div className={classes.imageRoot}>
                <SvgIcon iconName={image} iconWidth={30} />
              </div>
            )}
          </Grid>
        )}
        <Grid item className={classes.headerElement}>
          {props.children}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(RootElement);
