/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import AvTimerOutlinedIcon from '@material-ui/icons/AvTimerOutlined';
import { withStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import { convertMS } from 'common/utils/dateUtil';

const styles = theme => ({
  timer: {
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    },
    width: 104,
    maxHeight: 35,
    marginLeft: 20,
    marginRight: 15
  },
  relative: {
    position: 'relative'
  },
  avgTimeLabel: {
    marginTop: 28
  },
  iconColor: {
    color: theme.palette.text.primary
  },
  timerRoot: {
    // TODO: Need to replace the color after theme fix merge
    boxShadow: `1px 1px 3px ${theme.palette.text.primary}88`,
    backgroundColor: theme.palette.common.white
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: 500
  }
});
class CallTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      callDropFlag: false
    };
  }

  componentDidMount() {
    const {
      callTimer,
      activeCustomer,
      startCustomerTimer,
      customerId
    } = this.props;
    if (callTimer) {
      this.startTimer(callTimer.startTime);
    } else {
      const time = new Date().getTime();
      startCustomerTimer({
        time,
        customerId: customerId || activeCustomer
      });
      this.startTimer(time);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick(startTime) {
    const currentTime = new Date().getTime();
    const timerElapsed = Math.floor((currentTime - startTime) / 1000);
    this.setState({ count: timerElapsed });
  }

  startTimer(startTime) {
    clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this, startTime), 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.props.onStopTimer();
  }

  render() {
    const { classes, callTimer } = this.props;
    let callDuration;

    if (callTimer) {
      const { hour, minute, seconds } = convertMS(
        dayjs().diff(dayjs(callTimer.startTime))
      );
      callDuration = `${hour}:${minute}:${seconds}`;
    }
    if (!this.state.count) {
      return null;
    }
    return (
      // <div className={classNames('mb5 inSameline', classes.relative)}>
      //   <Fab
      //     onClick={this.stopTimer.bind(this)}
      //     variant="extended"
      //     className={classNames(classes.timer)}
      //   >
      //     <Grid container spacing={3} alignItems="center">
      //       <Grid item xs={3}>
      //         <AvTimerOutlinedIcon className={classes.iconColor} />
      //       </Grid>
      //       <Grid item xs={9}>
      //         <Typography variant="body1" className="inline">
      //           {callDuration}
      //         </Typography>
      //       </Grid>
      //     </Grid>
      //   </Fab>
      // </div>
      <Chip
        classes={{
          root: classes.timerRoot,
          label: classes.timerLabel
        }}
        label={callDuration}
        icon={<AvTimerOutlinedIcon />}
      />
    );
  }
}

export default withStyles(styles)(CallTimer);
