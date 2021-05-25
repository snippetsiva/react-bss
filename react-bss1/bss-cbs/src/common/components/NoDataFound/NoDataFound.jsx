import React from 'react';
import config from 'config';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import { Trans } from '@lingui/macro';
import { Grid } from '@material-ui/core';

const NoDataFoundIcon = ({ icon }) => (
  <img className="ml10" style={{ height: '5.3rem' }} src={`${config.basePath}assets/icons/${icon}.svg`} />
);

const BadgeSection = props => {
  const { icon } = props;
  const BadgeElement = () => {
    return (
      <Badge>
        <NoDataFoundIcon icon={icon} />
      </Badge>
    );
  };
  return <BadgeElement />;
};

function NoDataFound(props) {
  const { classes, ctaTitle = <Trans>No information available</Trans> } = props;
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <BadgeSection classes={classes} icon="noData_Found" />
      </Grid>
      <Grid item>
        <Typography variant="subtitle1">{ctaTitle}</Typography>
      </Grid>
    </Grid>
  );
}

export default NoDataFound;
