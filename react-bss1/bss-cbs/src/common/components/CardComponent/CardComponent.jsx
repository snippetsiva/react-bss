import React, { useState, useEffect, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Button, IconButton, Typography, Box, CircularProgress } from '@material-ui/core';
import SVGIcon from 'common/components/SvgIcon';
import classNames from 'classnames';
import { Trans } from '@lingui/macro';
import _get from 'lodash/get';
import _pickBy from 'lodash/pickBy';
import _has from 'lodash/has';
import _cloneDeep from 'lodash/cloneDeep';
import _flatten from 'lodash/flatten';
import MuiForm from '@rjsf/material-ui';
import EditIcon from '@material-ui/icons/Edit';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CustomStringWrapper from './CustomStringWrapper';
import constants from 'common/constants/constants';

const useStyles = makeStyles(theme => ({
  paperWrapper: {
    padding: theme.spacing(13.2),
    marginBottom: theme.spacing(5)
  },
  titleWrapper: {
    marginBottom: theme.spacing(3.17)
  },
  plainCard: {
    padding: 0,
    marginBottom: 0
  },
  success: {
    color: theme.palette.success.main,
    marginLeft: theme.spacing(4.17),
    verticalAlign: 'sub'
  },
  mainWrapper: {
    maxWidth: '100%'
  },
  headerTitle: {
    marginLeft: theme.spacing(4.17)
  },
  horizontalLine: {
    borderTop: `${theme.spacing(0.2)} solid ${theme.palette.custom.grayAthens}`,
    marginTop: theme.spacing(6.17),
    marginBottom: theme.spacing(3.17),
    paddingBottom: 0
  },
  actionBtn: {
    width: theme.spacing(24.17)
  },
  subHeading: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase'
  },
  subHeadingWrapper: {
    paddingTop: '0 !important'
  },
  showMore: {
    marginTop: theme.spacing(11.17),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '& svg': {
      verticalAlign: 'text-bottom',
      marginLeft: theme.spacing(3.17)
    }
  },
  errorTitle: {
    '& span': {
      color: theme.palette.error.main
    },
    '& label': {
      color: `${theme.palette.error.main} !important`
    },
    '& .MuiInput-underline': {
      '&:after': {
        borderBottom: `${theme.spacing(0.6)} solid ${theme.palette.error.main}`,
        transform: 'scale(1)'
      }
    }
  },
  inputWrapper: {
    flexGrow: 1,
    '& label': {
      ...theme.typography.body1
    },
    '& .MuiInputLabel-shrink': {
      ...theme.typography.caption
    },
    '& input': {
      ...theme.typography.body1
    },
    '& .MuiInputBase-input': {
      ...theme.typography.body1,
      borderBottom: `${theme.spacing(0.4)} solid ${theme.palette.custom.grayAthens}`
      // borderBottom: `${theme.spacing(0.4)} solid ${theme.palette.icon.filled}`
    },
    '& .MuiInput-underline': {
      '&:before': {
        content: 'none'
      }
    },
    '& .MuiSelect-selectMenu': {
      borderBottom: `${theme.spacing(0.4)} solid ${theme.palette.custom.grayAthens}`
    },
    '& .Mui-disabled': {
      opacity: 0.8
    },
    '& .MuiFormGroup-root': {
      flexDirection: 'row',
      '& .MuiFormControlLabel-label': {
        ...theme.typography.body1
      },
      '& input[type="radio"]:checked + div': {
        color: theme.palette.primary.main
      }
    },
    '& .MuiFormControlLabel-root': {
      '& .MuiFormControlLabel-label': {
        ...theme.typography.body1,
        textTransform: 'capitalize'
      },
      '& input[type="radio"]:checked + div': {
        color: theme.palette.primary.main
      }
    },
    '& .Mui-error': {
      ...theme.typography.body1,
      color: theme.palette.error.main
    }
  },
  isReadOnly: {
    '& .MuiFormLabel-asterisk': {
      color: 'transparent'
    },
    '& .MuiInputBase-input': {
      borderColor: 'transparent'
    },
    '& .MuiSelect-selectMenu': {
      borderColor: 'transparent'
    },
    '& .Mui-disabled': {
      opacity: 1
    }
  },
  buttonProgress: {
    position: 'absolute',
    color: theme.palette.success.main
  }
}));

const persistedFormData = {};
let formErrors = [];
let alreadyLoaded = false;

const getRefInstance = (ref, innerRef) => {
  return ref ? ref.current : innerRef.current;
};

const getKeysData = (data, jsonSchema, optionalProperties = true) => {
  /**
   * this function returns the filtered data which is required for form
   */
  const allPropertyKeys = [
    ...Object.keys(jsonSchema.properties),
    ...(optionalProperties ? Object.keys(jsonSchema.optionalProperties || {}) : []),
    ...Object.keys(jsonSchema.dependantProperties || {})
  ];
  return _pickBy(data, (value, key) => {
    return allPropertyKeys.indexOf(key) > -1;
  });
};
const CardComponent = React.forwardRef(
  (
    {
      name,
      isEdit,
      isDisabled = false,
      permission = true,
      titleData,
      data,
      jsonSchema,
      uiSchema,
      layout = {},
      customClasses = {},
      handleToggle,
      onSubmit,
      onUpdate,
      hideToggle,
      autoFocus,
      cardCssConfig = {},
      triggeredFormSubmit,
      handleCancel,
      customErrors,
      loader = false
    },
    ref
  ) => {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({});
    const [defaultUISchema, setUiSchema] = useState({ customFields: {} });
    const [showMore, setShowMore] = useState(true);
    const [isSubmitting, setSubmitting] = useState(triggeredFormSubmit || false);
    const updatedFormData = () => {
      let updatedData = persistedFormData[name] || '';
      if (isEdit && updatedData) {
        const dataArr = Object.keys(updatedData.customFields);
        dataArr.forEach(element => {
          if (updatedData.customFields[element] === constants.placeHolderValue) {
            delete updatedData.customFields[element];
          }
        });
      }
      return updatedData;
    };

    const innerRef = ref ? React.useRef(ref) : React.createRef(null); // set ref as an initial value
    const circleRef = createRef(null);
    const classes = useStyles();

    const updateUiSchema = () => {
      const currentUiSchema = { customFields: uiSchema || {} };
      if (!alreadyLoaded) {
        const firstElement = autoFocus || Object.keys(jsonSchema.properties)[0];
        currentUiSchema.customFields[firstElement] = { 'ui:autofocus': true };
        alreadyLoaded = true;
      }
      setUiSchema(currentUiSchema);
    };

    const updateCircle = () => {
      if (circleRef && circleRef.current && formErrors.length) {
        circleRef.current.style.display = 'none';
      } else if (circleRef && circleRef.current) {
        circleRef.current.style.display = 'inline-block';
      }
    };

    const getError = (data = formData) => {
      const refIns = getRefInstance(ref, innerRef);
      return refIns ? _get(refIns.validate(data), 'errors', []) : [];
    };

    useEffect(() => {
      if (jsonSchema) {
        const customSchema = {
          properties: {
            customFields: jsonSchema
          }
        };
        if (!showMore) {
          customSchema.properties.customFields.properties = {
            ..._get(customSchema, 'properties.customFields.properties', {}),
            ...(jsonSchema.optionalProperties || {})
          };
        }
        const newFormData = { customFields: getKeysData(data, jsonSchema) };

        setFormData(newFormData);
        persistedFormData[name] = newFormData;
        setSchema(customSchema);
      }
      updateUiSchema();
      updateCircle();
      return () => {
        persistedFormData[name] = '';
      };
    }, []);

    useEffect(() => {
      const newData = { ...updatedFormData().customFields, ...data };
      const newFormData = { customFields: getKeysData(newData, jsonSchema) };
      setFormData(newFormData);
      persistedFormData[name] = newFormData;
      updateCircle();
      updateUiSchema();
    }, [data]);

    useEffect(() => {
      setShowMore(true);
      setSubmitting(false);
    }, [isEdit]);

    useEffect(() => {
      if (jsonSchema) {
        const customSchema = {
          properties: {
            customFields: jsonSchema
          }
        };
        if (!showMore) {
          customSchema.properties.customFields.properties = {
            ..._get(customSchema, 'properties.customFields.properties', {}),
            ...(jsonSchema.optionalProperties || {})
          };
        }
        setSchema(customSchema);
      }
    }, [jsonSchema]);

    const updateShowMore = () => {
      const newJsonSchema = _cloneDeep(jsonSchema);
      newJsonSchema.properties = {
        ...newJsonSchema.properties,
        ...jsonSchema.optionalProperties
      };
      const newFormData = updatedFormData() ? { ...data, ...updatedFormData().customFields } : { ...data };
      const filteredData = getKeysData(newFormData, jsonSchema);
      setFormData({ customFields: filteredData });
      persistedFormData[name] = { customFields: filteredData };
      setSchema({
        properties: {
          customFields: newJsonSchema
        }
      });
      setShowMore(false);
    };

    const showLess = () => {
      const customSchema = {
        properties: {
          customFields: {
            properties: {},
            ...jsonSchema
          }
        }
      };
      const newFormData = updatedFormData() ? { ...data, ...updatedFormData().customFields } : { ...data };
      const filteredData = getKeysData(newFormData, jsonSchema);
      persistedFormData[name] = { customFields: filteredData };
      Object.keys(jsonSchema.optionalProperties || {}).forEach(key => {
        delete customSchema.properties.customFields.properties[key];
      });
      const filteredDataNoOptional = getKeysData(newFormData, jsonSchema, false);
      setFormData({ customFields: filteredDataNoOptional });
      setSchema(customSchema);
      setShowMore(true);
    };

    const updatePersistedFormData = newFormData => {
      persistedFormData[name] = newFormData;
    };

    const onChange = value => {
      updatePersistedFormData(value.formData);
      isSubmitting && setSubmitting(false);
      formErrors = getError(value.formData);
      updateCircle();
      onUpdate &&
        onUpdate({
          updatedFormData: value.formData.customFields,
          optionalKeys: Object.keys(jsonSchema.optionalProperties || {})
        });
    };

    const submitClick = async () => {
      !isSubmitting && setSubmitting(true);
      const refIns = getRefInstance(ref, innerRef);
      let newFormData = {
        ...updatedFormData().customFields,
        ...refIns.state.formData.customFields
      };
      persistedFormData[name].customFields = newFormData;
      setFormData(updatedFormData());
      refIns && refIns.submit();
      window.setTimeout(async () => {
        const { errors } = refIns && refIns.validate(updatedFormData());
        const isValid = _flatten(errors).length === 0;
        if (!isValid) {
          setSubmitting(false);
        } else {
          onSubmit && (await onSubmit(newFormData));
          setSubmitting(false);
        }
      }, 1000);
    };

    const cancelClick = () => {
      handleCancel && handleCancel();
      persistedFormData[name] = {
        customFields: {}
      };
      setFormData({
        customFields: {}
      });
    };

    const transformErrors = errorData => {
      formErrors = errorData.concat(customErrors);
      return formErrors.map(error => {
        if (error.name === 'required') {
          error.message = <Trans>This field is required</Trans>;
        } else if (error.name === 'pattern') {
          error.message = <Trans>Pattern required for field doesn't match</Trans>;
        }
        return isEdit && (isSubmitting || triggeredFormSubmit) ? error : [];
      });
    };

    if (alreadyLoaded) {
      formErrors = getError(updatedFormData());
    }
    const getObjectFieldTemplate = (props, classes) => {
      const { fieldSpacing } = layout;
      return (
        <Grid container spacing={fieldSpacing || 4}>
          {props.properties.map((element, idx) => {
            const title = _get(element, 'content.props.schema.title', '');
            const variant = _get(element, 'content.props.schema.variant', '');
            const componentId = _get(element, 'content.props.schema.id');
            const isSelectInput = _has(element.content.props.schema, 'enumNames');
            const eleHasError = _get(element, 'content.props.errorSchema.__errors', []).length > 0;
            if (variant === 'horizontalLine') {
              return (
                <Grid item xl={12} md={12} sm={12} xs={12} className={classes.horizontalLine}>
                  {' '}
                </Grid>
              );
            }
            if (variant === 'subHeading') {
              return (
                <Grid
                  item
                  xl={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classNames({
                    [classes.subHeadingWrapper]: variant === 'horizontalLine'
                  })}
                >
                  <Typography variant="body1" className={classes.subHeading}>
                    {title}
                  </Typography>
                </Grid>
              );
            }
            const { xl = 3, md = 3, sm = 6, xs = 12 } = {
              ...layout,
              ..._get(element, 'content.props.schema.layout', {})
            };
            const schema = _get(element, 'content.props.schema', {});
            return Object.keys(schema).length ? (
              <Grid
                item
                xl={xl}
                md={md}
                sm={sm}
                xs={xs}
                className={classNames(
                  {
                    [classes.mainWrapper]: idx === 0
                  },
                  { [classes.isReadOnly]: !isEdit },
                  {
                    [classes.errorTitle]: isEdit && eleHasError
                  },
                  classes.inputWrapper
                )}
                key={element.content.key}
                data-cy={isSelectInput ? componentId : undefined}
              >
                {element.content}
              </Grid>
            ) : null;
          })}
        </Grid>
      );
    };

    const {
      elevation,
      btnsAtBottom,
      plainCard,
      saveBtnLabel = <Trans>Done</Trans>,
      cancelBtnLabel = <Trans>Cancel</Trans>
    } = cardCssConfig;

    const validator = (formData, errors) => {
      jsonSchema.required.forEach(field => {
        if (_.isEmpty(formData.customFields[`${field}`])) {
          errors.customFields[`${field}`].addError(`${_.startCase(field)} is Required`);
        }
      });
      return errors;
    };

    const actionBtns = (
      <Grid container justify="flex-end">
        <Grid item align="right">
          <Button
            border="none"
            onClick={handleToggle || cancelClick}
            className={classNames(classes.actionBtn, customClasses.cancelBtn)}
          >
            <Typography variant="button">{cancelBtnLabel}</Typography>
          </Button>
        </Grid>
        <Grid item>
          <Box width={20} />
        </Grid>
        <Grid item align="right">
          <Button
            disabled={!isEdit}
            className={classNames(classes.actionBtn, customClasses.saveBtn)}
            variant="contained"
            color="primary"
            type="submit"
            onClick={submitClick}
          >
            <Typography variant="button">{saveBtnLabel}</Typography>
            {isSubmitting || loader ? <CircularProgress size={24} className={classes.buttonProgress} /> : null}
          </Button>
        </Grid>
      </Grid>
    );

    return (
      <Paper
        elevation={elevation !== undefined ? elevation : 1}
        variant="elevation"
        className={classNames(classes.paperWrapper, customClasses.container, {
          [classes.plainCard]: plainCard
        })}
      >
        <Grid
          container
          spacing={layout.rootSpacing || 5}
          className={classNames({
            [classes.titleWrapper]: !plainCard
          })}
        >
          {titleData ? (
            <Grid item xs={12} md={handleToggle ? 6 : 12}>
              {titleData.icon ? <SVGIcon iconName={titleData.icon} /> : null}
              <Typography
                variant="h2"
                className={classNames({
                  [classes.headerTitle]: titleData.icon
                })}
                display="inline"
              >
                {titleData.label}
              </Typography>
              {isEdit && !plainCard && getRefInstance(ref, innerRef) && formErrors.length < 1 ? (
                <CheckCircleIcon className={classes.success} ref={circleRef} />
              ) : null}
            </Grid>
          ) : null}
          {hideToggle ? null : (
            <Grid item xs={12} md={6} align="right">
              {!isEdit && permission && (
                <IconButton onClick={handleToggle} disabled={isDisabled || isEdit}>
                  <EditIcon color={isDisabled || isEdit ? 'disabled' : 'primary'} shapeRendering="outline" />
                </IconButton>
              )}
              {isEdit && !btnsAtBottom ? actionBtns : null}
            </Grid>
          )}
        </Grid>
        {schema && Object.keys(_get(schema, 'properties.customFields', {})).length > 0 ? (
          <Fragment>
            <MuiForm
              ref={ref || innerRef}
              noHtml5Validate
              schema={schema}
              uiSchema={defaultUISchema}
              widgets={{
                TextWidget: CustomStringWrapper
              }}
              formData={formData}
              liveValidate
              validate={(formData, errors) => validator(formData, errors)}
              showError={false}
              showErrorList={false}
              ObjectFieldTemplate={props => getObjectFieldTemplate(props, classes)}
              onChange={onChange}
              disabled={!isEdit}
              transformErrors={transformErrors}
            >
              {btnsAtBottom && isEdit ? (
                <Box mt={10}>{actionBtns}</Box>
              ) : (
                <Grid
                  container
                  justify="flex-end"
                  style={{
                    display: schema ? 'flex' : 'none'
                  }}
                />
              )}
            </MuiForm>
            {(Object.keys((jsonSchema || {}).optionalProperties || {}) || {}).length ? (
              <div className={classes.showMore} onClick={showMore ? updateShowMore : showLess}>
                {showMore ? (
                  <Fragment>
                    <Typography variant="body1" color="primary">
                      <Trans>View optional details</Trans>
                    </Typography>
                    <ArrowDownwardIcon color="primary" fontSize="default" />{' '}
                  </Fragment>
                ) : (
                  <Fragment>
                    <Typography variant="body1" color="primary">
                      <Trans>Hide optional details</Trans>
                    </Typography>
                    <ArrowUpwardIcon color="primary" fontSize="default" />
                  </Fragment>
                )}
              </div>
            ) : null}
          </Fragment>
        ) : null}
      </Paper>
    );
  }
);

export default CardComponent;

CardComponent.propTypes = {
  isEdit: PropTypes.bool,
  titleData: PropTypes.string,
  data: PropTypes.object,
  jsonSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  layout: PropTypes.object,
  customClasses: PropTypes.object,
  handleToggle: PropTypes.func,
  onSubmit: PropTypes.func,
  autoFocus: PropTypes.string,
  hideToggle: PropTypes.bool,
  cardCssConfig: PropTypes.object,
  onUpdate: PropTypes.func,
  triggeredFormSubmit: PropTypes.bool,
  customErrors: PropTypes.array
};

CardComponent.defaultProps = {
  isEdit: false,
  titleData: '',
  data: {},
  jsonSchema: {},
  uiSchema: {},
  layout: {},
  customClasses: {},
  handleToggle: {},
  onSubmit: () => {},
  onUpdate: () => {},
  hideToggle: false,
  cardCssConfig: {},
  autoFocus: '',
  triggeredFormSubmit: false,
  handleCancel: () => {},
  customErrors: []
};
