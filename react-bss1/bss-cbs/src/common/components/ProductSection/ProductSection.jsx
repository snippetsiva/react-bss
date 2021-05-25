import React, { Fragment } from 'react';
import { Trans } from '@lingui/macro';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Scroll from 'react-scroll';
import dayjs from 'dayjs';
import constants from 'common/constants/constants';
import _get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _compact from 'lodash/compact';
import SvgIcon from 'common/components/SvgIcon';
import Expansion from 'common/components/Expansion';
import classNames from 'classnames';
import InnerTable from './InnerTable';
import RootElement from './RootElement';
import InnerElements from './InnerElements';

const { Element } = Scroll;
const serviceIdLengthLimit = 15;

const styles = theme => ({
  accordionRootClass: {
    margin: 0,
    border: 0,
    padding: '4px 0px',
    borderRadius: '16px !important',
    boxShadow: 'none'
  },
  sectionTitle: {
    verticalAlign: 'middle'
  },
  header: {
    marginTop: 32
  },
  mainTitle: {
    color: theme.palette.common.gray,
    textTransform: 'uppercase'
  },
  headingIcon: {
    width: 30,
    // marginRight: '1em',
    marginLeft: '1em',
    verticalAlign: 'sub'
  },
  link: {
    letterSpacing: '0.01px',
    color: theme.palette.primary.main,
    verticalAlign: 'text-bottom',
    fontWeight: '450',
    display: 'grid',
    justifyContent: 'end',
    marginRight: '0px'
  },
  cursorPointer: {
    cursor: 'pointer'
  },
  detailClass: {
    display: 'block'
  },
  innerHeader: {
    fontWeight: '500',
    marginBottom: '10px'
  },
  rtlOfferDetails: {
    paddingRight: theme.spacing(12)
  },
  ltrOfferDetails: {
    paddingLeft: theme.spacing(12)
  }
});

const getTableHeading = desc => {
  return desc.map(item => {
    if (item.description !== 'MSISDN' && item.name !== 'MSISDN') return item.description || item.name;
    return '';
  });
};

const getTableValues = (characteristic, serviceId) => {
  return characteristic.map(item => {
    if (item.value === serviceId) {
      return '';
    }
    return item.value;
  });
};

const pukLink = (classes, resourceCharacteristic, setOpen, pukDetails, isOpen) => {
  return (
    <Grid
      className={classNames(resourceCharacteristic ? classes.cursorPointer : '')}
      onClick={() => {
        if (!isOpen) pukDetails();
      }}
    >
      {' '}
      <Typography variant="caption" display="inline" gutterBottom />
      <Typography variant="caption" className={classes.link} display="inline" gutterBottom>
        <Trans>Show PUK</Trans>
      </Typography>
    </Grid>
  );
};

const DetailCard = withStyles({
  root: {
    marginLeft: 10
  }
})(({ data = [], classes }) => {
  return (
    <Grid container direction="row" spacing={5} className={classes.root}>
      {data.map((item, index) => {
        return (
          (item.value === 0 || item.value) && (
            <Grid item id={index} xs={4}>
              <Typography variant="caption">{item.name}</Typography>
              <Typography variant="body1">{item.value}</Typography>
            </Grid>
          )
        );
      })}
    </Grid>
  );
});

const getKeyDetailMapping = (
  product,
  productRelationships,
  classes,
  resourceCharacteristic,
  setOpen,
  pukDetails,
  isOpen
) => {
  let headerValues = [];
  let tableValues = [];

  productRelationships &&
    productRelationships.map(item => {
      const characteristic = _get(item, `product.characteristic`, []);
      const productSpecCharacteristic = _get(item, `product.productSpecification.productSpecCharacteristic`);
      const serviceId = product.publicIdentifier;
      const heading = getTableHeading(productSpecCharacteristic || characteristic || []);

      const value = getTableValues(characteristic || [], serviceId);

      if (value && value.join('')) {
        headerValues = headerValues.concat(heading);

        tableValues = tableValues.concat(value);
      }
    });

  tableValues = tableValues.join('') ? tableValues : null;

  switch ((product.LoB || '').toLowerCase()) {
    case 'mobile':
      const linkText = pukLink(classes, resourceCharacteristic, setOpen, pukDetails, isOpen);
      return headerValues && headerValues.length > 0 && tableValues ? (
        <Expansion
          callBackAction={index => {
            if (index !== null) pukDetails();
          }}
          rootClass={classes.accordionRootClass}
          detailClass={classes.detailClass}
          expansionElements={[
            {
              headerElement: (
                <Grid container direction="row" style={{ marginTop: '-50px' }}>
                  <Grid item xs={12}>
                    {linkText}
                  </Grid>
                  <Grid item xs={12}>
                    <InnerTable
                      classes={classes}
                      headings={headerValues}
                      tableValues={[tableValues]}
                      setOpen={setOpen}
                    />
                  </Grid>
                </Grid>
              ),
              detailElement: (
                <>
                  {product.LoB === constants.LOB.MOBILE && (
                    <Grid item xs={4} style={{ fontWeight: '500' }}>
                      <Typography variant="subtitle1" className={classes.innerHeader}>
                        <Trans>PUK Details</Trans>
                      </Typography>
                    </Grid>
                  )}
                  {product.LoB === constants.LOB.MOBILE && (
                    <InnerElements
                      fields={[
                        {
                          header: 'puk1',
                          text:
                            !_.isEmpty(resourceCharacteristic) &&
                            resourceCharacteristic
                              .filter(item => item.name === constants.resourceCharacteristics.PUK1 && item.value)
                              .map(item => item.value)
                        },
                        {
                          header: 'puk2',
                          text:
                            !_.isEmpty(resourceCharacteristic) &&
                            resourceCharacteristic
                              .filter(item => item.name === constants.resourceCharacteristics.PUK2 && item.value)
                              .map(item => item.value)
                        },
                        {
                          header: 'pin1',
                          text:
                            !_.isEmpty(resourceCharacteristic) &&
                            resourceCharacteristic
                              .filter(item => item.name === constants.resourceCharacteristics.pin1Number && item.value)
                              .map(item => item.value)
                        },
                        {
                          header: 'pin2',
                          text:
                            !_.isEmpty(resourceCharacteristic) &&
                            resourceCharacteristic
                              .filter(item => item.name === constants.resourceCharacteristics.pin2Number && item.value)
                              .map(item => item.value)
                        }
                      ]}
                    />
                  )}
                </>
              )
            }
          ]}
        />
      ) : null;
    case 'broadband':
    default:
      return null;
  }
};

const getIcon = loB => {
  switch ((loB || '').toLowerCase()) {
    case 'mobile':
      return 'GSM';
    case 'iptv':
      return 'IP_TV';
    case 'fixedline':
      return 'LandLine';
    default:
      return 'Broadband-1';
  }
};

const HeaderElement = ({ classes, title = '', icon = '', fields = [], language }) => {
  const offerDetails = (language === 'fa') ? 'rtlOfferDetails' : 'ltrOfferDetails';
  return (
    <Grid container justify="space-between" spacing={1}>
      <Grid container item xs={12}>
        <Grid item>
          <SvgIcon iconName={icon} className={classes.headingIcon} iconWidth={30} />
          <Typography variant="h2" className={classes.sectionTitle} display="inline" gutterBottom>
            {title}
          </Typography>
        </Grid>
        {fields.map(({ header, text }, index) => {
          return (
            <Grid item key={index} className={classes[offerDetails]}>
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

const getGroups = product => {
  return _groupBy(product.productRelationship, item => {
    const type =
      _get(item.product, `productSpecification[@referredType]`, '') ||
      _get(item.product, `productSpecification[@type]`, '');
    return constants.productKeyAtributes.indexOf(type) > -1 ? 'keyAttributesGroup' : 'secondaryAttributesGroup';
  });
};

const getKeyAttributeData = (
  product,
  productRelationships,
  idx,
  classes,
  key,
  resourceCharacteristic,
  setOpen,
  pukDetails,
  isOpen,
  characteristicData,
  language
) => {
  const productSpecification = _compact([product.technology, product.LoB, product.businessType]).join(' - ');
  // const detailSection = getKeyDetailMapping(
  //   product,
  //   productRelationships,
  //   classes,
  //   resourceCharacteristic,
  //   setOpen,
  //   pukDetails,
  //   isOpen
  // );
  return (
    <RootElement>
      <Expansion
        // rootClass={classes.accordionRootClass}
        // defaultExpanded={idx === 0}
        expansionElements={[
          {
            headerElement: (
              <HeaderElement
                title={_get(product, 'productOffering.name', '')}
                icon={getIcon(product.LoB)}
                fields={[
                  {
                    header: <Trans>Activation Date</Trans>,
                    text: dayjs(product.createdDate).format(constants.dateFormat.fullDateMonthWithTime)
                  },
                  {
                    header: <Trans>Service id</Trans>,
                    text: (
                      <span
                        title={
                          _get(product, 'publicIdentifier', []).length > serviceIdLengthLimit
                            ? product.publicIdentifier
                            : ''
                        }
                      >
                        {product.publicIdentifier}
                      </span>
                    )
                  },
                  {
                    text: (
                      <Grid item>
                        <Typography variant="body1">{productSpecification}</Typography>
                      </Grid>
                    )
                  }
                ]}
                classes={classes}
                language={language}
              />
            ),

            detailElement:
              product.LoB === 'Mobile' ? null : ( // detailSection
                <DetailCard data={characteristicData} />
              )

            // detailElement: detailSection
          }
        ]}
        // hideBtn={!detailSection}
      />
    </RootElement>
  );
};

const ProductSection = ({ classes, productsData, resourceCharacteristic, pukDetails, isOpen, characteristicData, language }) => {
  const isBundleOffering =
    resourceCharacteristic &&
    productsData &&
    productsData[0] &&
    productsData[0].productOffering['@type'] === 'BundledProductOffering';
  const getProductListing = (product, idx) => {
    const groups = getGroups(product);

    return getKeyAttributeData(
      product,
      groups.keyAttributesGroup,
      idx,
      classes,
      idx,
      resourceCharacteristic,
      null,
      pukDetails,
      isOpen,
      characteristicData,
      language
    );
  };

  const getBundleProductListing = (product, idx) => {
    const productRelationships = product.productRelationship;
    return productRelationships.map((productGroup, inx) => {
      const groups = getGroups(productGroup.product);

      return getKeyAttributeData(
        productGroup.product,
        groups.keyAttributesGroup,
        inx,
        classes,
        `${idx}${inx}`,
        resourceCharacteristic,
        null,
        pukDetails,
        isOpen,
        characteristicData,
        language
      );
    });
  };

  return (
    <Element name="product-details-offering">
      <div className={classes.header}>
        <Typography
          variant="h2"
          // className={classes.mainTitle}
          display="inline"
          gutterBottom
        >
          <Trans>Offering Details</Trans>
        </Typography>
      </div>
      {productsData.map((product, idx) => {
        return isBundleOffering ? getBundleProductListing(product, idx) : getProductListing(product, idx);
      })}
    </Element>
  );
};

export default withStyles(styles)(ProductSection);
