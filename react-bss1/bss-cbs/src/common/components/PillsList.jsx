import React from 'react';
import classNames from 'classnames';
import { withStyles, Box, Grid, Typography, Button } from '@material-ui/core';

const Styles = theme => ({
  listItem: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.common.white
  },
  boxroot: {
    padding: 0
  }
});

const PillsList = ({
  listItems,
  customClasses = {},
  classes,
  paddingX,
  paddingY,
  spacingBetweenCards,
  // onItemClick,
  selected,
  titleKeyName = 'title',
  IdkeyName = 'id'
}) => {
  const finalClasses = { ...classes, ...customClasses };
  const fakeData = [
    {
      'titleKeyName' : 'Hybrid'
    },
    {
      'titleKeyName' : 'LOB'
    },

  ]
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      spacing={spacingBetweenCards || 4}
      className={customClasses ? customClasses.listWrapper : ''}
    >
      {fakeData.map((data, idx) => {
        return (
          <Grid item key={idx}>
            <Button
              variant="contained"
              className={classNames(finalClasses.listItem, {
                [finalClasses.selectedItem]:
                  selected === data[titleKeyName] ||
                  selected === data[IdkeyName]
              })}
              data-cy={data[titleKeyName]}
              // onClick={
              //   data.onClick
              //     ? data.onClick
              //     : () => onItemClick(data[IdkeyName], data[titleKeyName])
              // }
            >
              <Box
                py={paddingY !== undefined ? paddingY : 2}
                px={paddingX || 7}
                className={classes.boxroot}
              >
                <Typography variant="button">{data[titleKeyName]}</Typography>
              </Box>
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default withStyles(Styles)(PillsList);
