import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import Dayjs from 'dayjs';
import Avatar from '@material-ui/core/Avatar';
import constants from 'common/constants/constants';

const styles = theme => ({
  root: {
    marginTop: '20px'
  },
  rootWrapper: {
    width: '100%'
  },
  name: {
    padding: 5,
    fontWeight: 'bold',
    color: theme.palette.text.primary
  },
  desc: {
    padding: 5,
    fontWeight: 'regular',
    color: theme.palette.text.primary,
    wordBreak: 'break-all'
  },
  commentTime: {
    padding: 5,
    fontWeight: 'light',
    color: theme.palette.text.primary
  },
  profile: {
    height: '3em',
    width: '3em'
  },
  comments: {
    width: '82%',
    padding: 5
  },
  avatarContainer: {
    alignSelf: 'baseline',
    paddingTop: '0.5em',
    paddingRight: '1em'
  },
  textContainer: {
    flex: 2
  },
  headingWrapper: {
    justifyContent: 'space-between'
  },
  dotSeparator: {
    width: '4px',
    height: '4px',
    background: `${theme.palette.text.primary} 0% 0% no-repeat padding-box`,
    borderRadius: '4px'
  }
});

const getFormattedDate = createdDate => {
  const dateArr = new Date(createdDate)
    .toDateString()
    .substr(4, 9)
    .split(' ');
  const dateValue = Dayjs(dateArr).format(constants.dateFormat.date);
  const timeValue = Dayjs(dateArr).format(constants.dateFormat.time);
  return `${dateValue} | ${timeValue}`;
};

const UserComments = ({ classes, data = [] }) => {
  return (
    <div className={classes.rootWrapper}>
      {_.map(data, obj => {
        return (
          <Grid container direction="row" justify="flex-start" alignItems="center" className={classes.root}>
            <Grid item className={classes.avatarContainer}>
              <Avatar alt={obj.id} src={obj.imgUrl} className={classes.profile} />
            </Grid>
            <Grid item className={classes.textContainer}>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                className={classes.headingWrapper}
              >
                <Grid item>
                  <Typography variant="label1" className={classes.name}>
                    {`${obj.name || 'Name : NA'}`}
                  </Typography>
                </Grid>
                {obj.createdDate ? <Grid item className={classes.dotSeparator} /> : null}
                <Grid item>
                  <Typography variant="label1" className={classes.commentTime}>
                    {obj.createdDate ? getFormattedDate(obj.createdDate) : ''}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography className={classes.desc} inline>
                  {obj.text}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(UserComments);
