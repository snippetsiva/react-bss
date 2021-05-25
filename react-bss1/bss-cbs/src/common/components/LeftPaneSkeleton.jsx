import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';

const LeftPaneSkeleton = ({ classes, loading }) => (
  <Fade
    in={loading}
    style={{
      transitionDelay: loading ? '800ms' : '0ms'
    }}
    unmountOnExit
    className={classes.centerLoading}
  >
    <CircularProgress />
  </Fade>
);

export default LeftPaneSkeleton;
