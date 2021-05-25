import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Lottie from 'react-lottie';
import laptopGuyAnimationData from 'animation/custom-guy-with-laptop';
import warningPaperAnimationData from 'animation/warning-with-paper';
import { Trans } from '@lingui/react';

function DoNotHavePermissionComponent({ textToDisplay }) {
  const laptopGuyDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: laptopGuyAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  const warningPaperDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: warningPaperAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const defaultText = <Trans>Sorry, you do not have permission to perform this task.</Trans>;


  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <Lottie options={laptopGuyDefaultOptions} height={300} width={330} />
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <Typography variant='h5'>{textToDisplay ? textToDisplay : defaultText}</Typography>
          </Grid>
          <Grid item>
            <Lottie options={warningPaperDefaultOptions} height={50} width={50} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}

export default DoNotHavePermissionComponent;
