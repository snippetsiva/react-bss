import React, { Fragment } from 'react';
import { Box, CircularProgress, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import _get from 'lodash/get';
import _compact from 'lodash/compact';
import { Trans } from '@lingui/macro';
import Scroll from 'react-scroll';
import { SvgIcon } from '@tt-dclm/dclm-web-ui';
import Expansion from 'common/components/Expansion/Expansion';
import constants from 'common/constants/constants';
import InfoCard from 'components/Product/InfoCard';
import { SectionDetails } from './SectionDetails';
import VerticalTimelineCard from './VerticalTimelineCard';

const { Element } = Scroll;

const DetailCard = ({ data = [] }) => {
  return (
    <Grid container direction="row" spacing={5}>
      {data.map((item, index) => {
        return (
          item.value && (
            <Grid item id={index} xs={4}>
              <Typography variant="caption">{item.name}</Typography>
              <Typography variant="body1">{item.value}</Typography>
            </Grid>
          )
        );
      })}
    </Grid>
  );
};

const getIcon = loB => {
  switch ((loB || '').toLowerCase()) {
    case 'mobile':
      return 'GSM';
    case 'iptv':
      return 'IP_TV';
    case 'fixedline':
      return 'LandLine';
    case 'productSpecification':
      return 'Broadband-1';
    default:
      return 'Broadband-1';
  }
};

const ServiceDetails = withStyles(theme => ({
  main: {
    paddingBottom: theme.spacing(3),
    minWidth: theme.spacing(200),
    maxWidth: theme.spacing(200)
  },
  headingIcon: {
    width: 30,
    marginRight: '1em',
    verticalAlign: 'sub'
  }
}))(({ classes, data, handleLoader, task, getTimeLine, choosenInteraction, showServiceLoader }) => {
  let icon = 'noData_Found';
  if (data && data.length) {
    return _.map(data || [], items => {
      let product = '';
      if (items !== null) {
        product = items.product;
      }
      let publicIdentifier = _get(product, 'publicIdentifier', '');
      icon = getIcon(product.LoB);

      const productSpecification2 = _compact([
        _.get(product, 'technology', ''),
        _.get(product, 'LoB', ''),
        _.get(product, 'businessType', '')
      ]).join(' - ');
      const stagesData = _.get(items, 'tasks', []).filter(
        item => _.get(item, 'referredType') === 'FieldOperationProductSpec' || _.get(item, 'referredType') === ''
      );

      const timelineComponent = (
        <Grid item>
          {getTimeLine(choosenInteraction,'modalcard', choosenInteraction.id, true, true, _.get(items, 'tasks', []))}
        </Grid>
      );   
      
      const detailedComponent = (
        <Fragment>
          {/* Stages */}

          <SectionDetails title={<Trans>Stages</Trans>} classes={classes} disablePadding>
            <Box mb={-12}>
              <VerticalTimelineCard
                // handleLoader={this.handleLoader}
                stagesData={stagesData}
                id=""
              />
            </Box>
          </SectionDetails>
        </Fragment>
      );
      return (
        <Element key={items.id} name="service-section-request">
          <div className={classes.main}>
            <Expansion
              expansionElements={[
                {
                  headerElement: (
                    <Grid container direction="row" alignItems="center">
                      <Grid item xs={12}>
                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Grid container direction="column">
                              <Grid item>
                                <SvgIcon iconName={icon} className={classes.headingIcon} iconWidth={30} />
                                <Typography
                                  variant="body1"
                                  gutterBottom
                                  color="textPrimary"
                                  className="bold"
                                  display="inline"
                                ></Typography>
                              </Grid>
                              <Grid item>
                                <Typography variant="button" gutterBottom color="textSecondary">
                                  {productSpecification2}
                                </Typography>
                              </Grid>

                              {publicIdentifier && (
                                <Grid item>
                                  <Typography variant="body1" display="inline">
                                    <Trans>Service ID </Trans>:
                                  </Typography>
                                  <Typography variant="body1" display="inline">
                                    {publicIdentifier}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                          <Grid item>{timelineComponent}</Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ),
                  detailElement: detailedComponent
                }
              ]}
            />
          </div>
        </Element>
      );
    });
  }
  return (
    <Box mt={8}>
      {showServiceLoader ? (
        <CircularProgress disableShrink />
      ) : (
        <Fragment>
          <SvgIcon iconName={icon} className={classes.headingIcon} iconWidth={30} />
          <Typography variant="subtitle1">
            <Trans>No information available</Trans>
          </Typography>
        </Fragment>
      )}
    </Box>
  );
});

export default ServiceDetails;
