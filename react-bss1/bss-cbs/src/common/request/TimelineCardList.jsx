import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import classNames from 'classnames';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import Chip from '@material-ui/core/Chip';
import * as _ from 'lodash';

const styles = theme => ({
  pill: {
    borderRadius: 10,
    height: 16,
    textTransform: 'uppercase',
    color: theme.palette.common.white,
    fontSize: 10
  },
  secondaryText: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase'
  },
  actionButton: {
    width: 144,
    height: 47,
    float: 'right',
    padding: theme.spacing(3),
    background: `${theme.palette.background.hoverYellow} 0% 0% no-repeat padding-box`,
    borderRadius: 27,
    opacity: 1,
    cursor: 'pointer'
  },
  rejectButton: {
    float: 'left',
    margin: theme.spacing(3, 12),
    cursor: 'pointer'
  },
  approveBtn: {
    fontWeight: theme.typography.fontWeightBold
  },
  firstFold: {
    marginBottom: theme.spacing(6)
  },
  mainText: {
    color: theme.palette.custom.ShuttleGrey
  },
  root: {
    marginBottom: theme.spacing(3)
  },
  child: {
    padding: theme.spacing(4, 0)
  },
  link: {
    color: theme.palette.custom.ShuttleGrey,
    cursor: 'pointer'
  },
  arrow: {
    lineHeight: '0.5rem',
    width: '1rem'
  },
  inprogress: {
    background: theme.palette.background.warning
  },
  completed: {
    background: theme.palette.background.success
  },
  draft: {
    background: theme.palette.background.hoverYellow
  }
});

const TimelineCardList = ({
  classes,
  children,
  onAction,
  status,
  subText,
  productName,
  headerTitle,
  timelineHeader,
  onClick,
  requestData,
  noMargin,
  user,
  taskData = []
}) => {
  const onReject = e => {
    e && e.preventDefault();
    e && e.stopPropagation();
    onAction({
      title: 'Reject?',
      description: `Reject the confirmation request by ${user.name}`,
      showReasons: true,
      inputTitle: 'ADD NOTES',
      inputPlaceholder: 'Your notes here',
      requestId: subText,
      type: 'reject'
    });
  };

  const onApprove = e => {
    e && e.preventDefault();
    e && e.stopPropagation();
    onAction({
      title: 'Approval?',
      description: `Approve the confirmation request by ${user.name}`,
      showReasons: false,
      inputTitle: 'Description',
      inputPlaceholder: 'Your description here',
      requestId: subText,
      type: 'approve'
    });
  };
  return (
    <Paper elevation={0} className={noMargin ? '' : classes.root}>
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item xs={12} className={classes.firstFold}>
          <Grid container direction="row" justify="space-between" alignItems="flex-start">
            <Grid item>
              <Grid container direction="column" spacing={4}>
                <Grid item align="left">
                  <Chip
                    className={clsx(classes.pill, {
                      [classes[_.toLower(status)]]: true
                    })}
                    label={status}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2" className={classes.secondaryText}>
                    {subText} 
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h4" className={classes.mainText}>
                    {/* {`${headerTitle} ${productName ? '-' + productName : '' }`} */}
                    {_.startCase(headerTitle)} 
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* {requestData.status !== 'completed' ? ( */}
            <Grid item>
              <Grid container direction="column" spacing={4}>
                <Grid item>
                  <Grid container>
                    {/* <Grid item>
                        <Typography variant="body1" className={classes.rejectButton} onClick={onReject}>
                          <Trans>Reject</Trans>
                        </Typography>
                      </Grid> */}
                    <Grid
                      container
                      className={classes.actionButton}
                      onClick={() => onClick(requestData)}
                      justify="center"
                    >
                      <Grid item>
                        <Typography variant="body2" className={classes.approveBtn}>
                          <Trans>View</Trans>
                        </Typography>
                      </Grid>
                      {/* <Grid item>
                          <ArrowForwardIosIcon className={classNames(classes.link, classes.arrow)} />
                        </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* ) : null} */}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item>
            <Typography variant={'subtitle1'}>{timelineHeader}</Typography>
          </Grid>
          <Grid item className={classes.child}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(TimelineCardList);
