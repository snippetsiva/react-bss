import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordion from '@material-ui/core/Accordion';
import { SvgIcon } from '@tt-dclm/dclm-web-ui';

const ExpansionPanel = withStyles(theme => ({
  root: {
    padding: 0,
    marginTop: '35px',
    borderRadius: '10px',
    '&:before': {
      backgroundColor: 'transparent'
    },
    // boxShadow: 'none',
    // border: `1px solid ${theme.palette.common.grayShadow}`
  },
  rounded: {
    padding: 0
  },
  expanded: {
    marginTop: '20px',
    marginLeft: '0',
    marginRight: '0',
    borderRadius: '0px',
    border: 0
    // boxShadow: `0px 0px 10px ${theme.palette.primary.main}`
  }
}))(MuiAccordion);

const Expansion = withStyles(theme => ({
  root: {
    // margin: '0px 40px 20px !important'
  },
  expansionRoot: {
    padding: '0px 20px'
  },
  rootContainer: {
    display: 'block'
  }
}))(
  ({
    expansionElements = [],
    classes,
    rootClass = '',
    expansionRootClass = '',
    detailClass = '',
    hideBtn,
    defaultExpanded,
    iconClassName = '',
    callBackAction = () => {},
    customIndex
  }) => {
    const [expanded, setExpanded] = useState(
      defaultExpanded ? 'panel0' : false
    );
    const handleChange = (panel, index) => (event, isExpanded) => {
      const isExpand = isExpanded ? panel : false;
      setExpanded(isExpand);
      callBackAction(isExpand ? index : null);
    };

    return expansionElements.map((expansion, index) => {
      const { headerElement = null, detailElement = null } = expansion;
      return (
        <ExpansionPanel
          key={index}
          className={`${rootClass || classes.root}`}
          expanded={(customIndex && expanded === `panel${customIndex}`) || expanded === `panel${index}`}
          onChange={hideBtn ? () => {} : handleChange(`panel${index}`, index)}
        >
          <AccordionSummary
            className={`${expansionRootClass} ${classes.expansionRoot} `}
            expandIcon={
              hideBtn ? null : (
                <SvgIcon
                  className={iconClassName}
                  iconName="Drop-down"
                  iconWidth={10}
                />
              )
            }
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
          >
            {headerElement}
          </AccordionSummary>
          <AccordionDetails
            className={`${detailClass || classes.rootContainer}`}
          >
            {detailElement}
          </AccordionDetails>
        </ExpansionPanel>
      );
    });
  }
);

Expansion.propTypes = {
  classes: PropTypes.object.isRequired,
  detailClass: PropTypes.string,
  expansionRootClass: PropTypes.string,
  expansionElements: PropTypes.array,
  hideBtn: PropTypes.bool,
  rootClass: PropTypes.string
};

Expansion.defaultProps = {
  expansionElements: [],
  classes: {},
  rootClass: '',
  expansionRootClass: '',
  detailClass: '',
  hideBtn: false
};

export default Expansion;
