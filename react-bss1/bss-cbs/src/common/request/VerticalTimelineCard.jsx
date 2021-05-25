import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
// import NoDataFound from 'common/components/NoDataFound';
// import LaptopMacIcon from '@material-ui/icons/LaptopMac';
// import RepeatIcon from '@material-ui/icons/Repeat';
import { Box, Grid, Typography, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main
  },
  completed: {
    backgroundColor: theme.palette.background.success
  },
  pending: {
    backgroundColor: theme.palette.background.paper,
    borderColor: `${theme.palette.success.main} !important`,
    borderRadius: '50%'
  },
  canceled: {
    backgroundColor: theme.palette.background.danger
  },
  rejected: {
    backgroundColor: theme.palette.background.danger
  },
  held: {
    backgroundColor: theme.palette.background.warning
  },
  null: {
    backgroundColor: theme.palette.secondary.main
  },
  loader: {
    color: theme.palette.background.yellow,
    margin: '0px 50%'
  }
}));

function VerticalTimelineCard(props) {
  const classes = useStyles();
  const { 
    // fetchProductOrdersDetails, id, 
    stagesData
   } = props;
  // const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   id && fetchOrderDetails();
  // }, []);

  // const fetchOrderDetails = async () => {
  //   try {
  //     setLoading(true);
  //     const prOrderDetails = await fetchProductOrdersDetails(id);
  //     const stagesData = _.get(prOrderDetails, '[0].orderItem[0].orderItem', []);
  //     const stages =
  //       stagesData.filter(item => _.get(item, 'productSpecification.type') === 'FieldOperationProductSpec') || [];
  //     setStages(stages);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log({ error })
  //     setLoading(false);
  //   }
  // };

  const data = [];

  stagesData.forEach((stage, index) => {
    const orderStatus = _.get(stage, 'status', '');
    const isLast = index === stagesData.length - 1 ? true : false;

    data.push({
      stageName: _.get(stage, 'name', ''),
      status: orderStatus,
      isLast: isLast
    });
  });

  // if (_.isEmpty(stages)) return null

  return (
    <Timeline align="alternate">
      {data.length ? (
        data.map((stage, index) => {
          const { stageName, status, isLast } = stage;
          return (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
                <Typography variant="body2" color="textSecondary">
                  Stage {index + 1}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot className={classes[status]} variant={status === 'pending' ? 'outlined' : 'default'} />
                {!isLast && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="body1" component="h2">
                  {stageName}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          );
        })
      ) : loading ? (
        <Grid container justify="center" alignItems="center">
          <Grid item>
            <Box pb={10}>
              <CircularProgress className={classes.loader} disableShrink />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Grid container justify="center" alignItems="center">
          <Grid item>
            <Box pb={10}>
              <Typography>Task stages not available. Please contact your admin!</Typography>
            </Box>
          </Grid>
        </Grid>
      )
    }
    </Timeline>
  );
}

export default VerticalTimelineCard;
