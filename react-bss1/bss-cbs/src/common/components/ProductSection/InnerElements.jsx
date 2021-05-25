import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  sectionTitle: {
    verticalAlign: 'middle'
  },
  innerItems: {
    padding: '2px 10px'
  }
});
const InnerElements = ({ classes, fields = [] }) => {
  return (
    <Grid container spacing={5}>
      <Grid container item xs={12}>
        {fields.map(({ header, text }, index) => {
          return (
            <Grid item xs={3} key={index} className={classes.innerItems}>
              <Typography variant="caption">{header}</Typography>
              <Typography variant="body1" className={classes.sectionTitle}>
                {text}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};
export default withStyles(styles)(InnerElements);
