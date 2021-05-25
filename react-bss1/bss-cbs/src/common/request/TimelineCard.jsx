import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import classNames from 'classnames';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import Chip from '@material-ui/core/Chip';
import * as _ from 'lodash';
import { getSessionData } from 'utils/utilService';
import constants from 'common/constants/constants';
import config from 'config';
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
    // marginBottom: theme.spacing(6)
  },
  mainText: {
    color: theme.palette.custom.ShuttleGrey
  },
  root: {
    // marginBottom: theme.spacing(3)
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
  },
  disabled: {
    background: theme.palette.custom.nobalGrey,
    cursor: 'default'
  },
  rejectDisabled: {
    cursor: 'default',
    color: theme.palette.custom.nobalGrey
  }
});

const TimelineCard = ({
  classes,
  children,
  onAction,
  status,
  subText,
  productName = '',
  // headerTitle,
  onClick,
  requestData,
  noMargin,
  user,
  taskData = [],
  key
}) => {
  let isApprove = false;
  let isReject = false;
  const userInfo = getSessionData(constants.userInfo);
  const isProfileOwner = _.get(userInfo, 'assets.role', 'ProfileOwner') === 'ProfileOwner';
  const onReject = (e, item, orderId) => {
    e && e.preventDefault();
    e && e.stopPropagation();
    if (item.isReject && isProfileOwner) {
      onAction({
        title: 'Reject?',
        description: `Reject the confirmation request by ${user.name}`,
        showReasons: true,
        inputTitle: 'ADD NOTES',
        inputPlaceholder: 'Your notes here',
        requestId: subText,
        type: 'reject',
        orderId,
        item
      });
    }
  };

  const onApprove = (e, item, orderId) => {
    e && e.preventDefault();
    e && e.stopPropagation();
    if (item.isApprove && isProfileOwner) {
      onAction({
        title: 'Approval?',
        description: `Approve the confirmation request for ${productName}`,
        showReasons: false,
        inputTitle: 'Description',
        inputPlaceholder: 'Your description here',
        requestId: subText,
        type: 'approve',
        orderId,
        item
      });
    }
  };

  let prodName = '';
  let prodStatus = '';
  let prodOrderId = '';
  let item = {}
 
  taskData.forEach(order => {
    if (_.get(order, 'name', '') === _.get(config, 'dev.uiConfig.labels.customerUATAcceptance')) {
      prodName = _.get(order, 'name', '');
      prodStatus = _.get(order, 'status', '');
      prodOrderId = _.get(order, 'orderId', '');
      item = order;
    }

    isApprove =
      prodName === _.get(config, 'dev.uiConfig.labels.customerUATAcceptance') && prodStatus === 'pending'
        ? true
        : false;
    order['isApprove'] = isApprove;
    order['isReject'] = isApprove;
  });

 

  return (
    <Fragment key={key}>
      <Paper elevation={0} className={noMargin ? '' : classes.root} onClick={() => onClick(requestData)}>
        <Grid container direction="row" justify="center" alignItems="flex-start">
          <Grid item xs={12} className={classes.firstFold}>
            <Grid container direction="row" justify="space-between" alignItems="flex-start">
              {/*<Grid item>
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
                        {subText
                        //  + '-' + _.get(item, 'id')
                        }
                      </Typography>
                    </Grid>
                    <Grid item>
                      {/*<Typography variant="h4" className={classes.mainText}>
                        {/* {`${headerTitle} ${productName ? '-' + productName : ''}`} *
                      {/* headerTitle + '-' + _.get(item, 'offeringName')*
                      {productName}
                      </Typography>*
                    </Grid>
                  </Grid>
                    </Grid>*/}
              {/* {isProfileOwner && ( */}
              <Grid item>
                <Grid container onClick={e => onReject(e, item, prodOrderId)} direction="column" spacing={4}>
                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <Typography
                          variant="body1"
                          className={`${classes.rejectButton} ${
                            !isReject || !isProfileOwner ? classes.rejectDisabled : ''
                          }`}
                        >
                          {/* <Trans>Reject</Trans> */}
                          {status !== 'rejected' ? <Trans>Reject</Trans> : <Trans>Rejected</Trans>}
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        className={`${classes.actionButton} ${!isApprove || !isProfileOwner ? classes.disabled : ''}`}
                        onClick={e => onApprove(e, item, prodOrderId)}
                        justify="space-between"
                      >
                        <Grid item>
                          <Typography variant="body2" className={`${classes.approveBtn}`}>
                            {isApprove ? <Trans>Approve</Trans> : <Trans>Approved</Trans>}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <ArrowForwardIosIcon className={classNames(classes.link, classes.arrow)} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* ) } */}
            </Grid>
          </Grid>
          {/* 
            <Grid item xs={12}>
              <Grid item>{/* <Typography variant={'subtitle1'}>{cardStatus}</Typography> *</Grid>
              <Grid item className={classes.child}>
                {children}
              </Grid>
            </Grid>*/}
        </Grid>
      </Paper>
      <br />
    </Fragment>
  );
  // });
};

export default withStyles(styles)(TimelineCard);
