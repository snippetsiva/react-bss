import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import _map from 'lodash/map';
import _get from 'lodash/get';
import { withFormik, Form, Field } from 'formik';
import { Trans } from '@lingui/macro';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { TextField } from 'formik-material-ui';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Visible from 'common/components/Visible';
import FormikDatePicker from 'common/components/DatePicker/FormikDatePicker';
import {
  documentTypeRequiredSchema,
  documentIdNumberSchema,
  documentIssueDateSchema,
  documentExpiryDateSchema,
  documentPlaceOfIssueSchema,
  documentIssuedBySchema
} from 'common/utils/validationUtil';
import constants from 'common/constants/constants';
import { CustomCircularProgress } from 'common/components/CustomCircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    width: '100%',
    padding: theme.spacing(8, 8, 4),
    backgroundColor: theme.palette.background.main
  },
  title: {
    marginBottom: theme.spacing(6)
  },
  submitBtn: {
    float: 'right',
    marginTop: theme.spacing(6),
    padding: theme.spacing(2, 6),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.primary.contrastText
  }
}));

const InfoForm = ({
  values,
  readonly,
  customerType,
  onClose,
  handleSubmit,
  specification,
  setFieldValue,
  // getDocumentTypes,
  masterDocumentTypes,
  customerCategory,
  customerSubCategory,
  callDuplicateIdCheck,
  isForeigner = false,
  setFieldError,
  loader = false
}) => {
  const classes = useStyles();
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    setDocumentTypes(specification.eligibleDocumentList);
  }, [specification.idType]);

  const onDoneClick = e => {
    e.preventDefault();
    handleSubmit();
  };

  const onCloseClick = e => {
    e.preventDefault();
    onClose();
  };

  const today = new Date();

  const placeHolders = [
    { placeholder: <Trans>Document Type</Trans> },
    { placeholder: <Trans>Enter ID Number</Trans> },
    { placeholder: <Trans>Enter Issue Date</Trans> },
    { placeholder: <Trans>Enter Expiry Date</Trans> },
    { placeholder: <Trans>Place of Issue</Trans> },
    { placeholder: <Trans>Enter Issued By</Trans> }
  ];

  return (
    <Grid container spacing={6} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h2" className={classes.title}>
          {specification.name}
        </Typography>
        <Form autoComplete="off" noValidate>
          <Grid container spacing={6}>
            <Grid item xs={3}>
              <Field
                select
                required
                fullWidth
                disabled={readonly}
                name="documentType"
                label={<Trans>Document Type</Trans>}
                component={TextField}
                value={values.documentType}
                placeholder={placeHolders[0].placeholder.props.id}
              >
                {_map(documentTypes, (type) => (
                  <MenuItem key={type.idType} value={type.idType}>
                    <Typography variant="body1">{type.name}</Typography>
                  </MenuItem>
                ))}
              </Field>
            </Grid>
            {callDuplicateIdCheck ? (
              <Grid item xs={3}>
                <Field
                  required
                  type="text"
                  label={<Trans>ID Number</Trans>}
                  fullWidth
                  name="idNumber"
                  data-cy="documentId"
                  component={TextField}
                  value={values.idNumber}
                  placeholder={placeHolders[1].placeholder.props.id}
                  // disabled={values.isNumberDisable}
                  inputProps={{
                    onBlur: (e) => callDuplicateIdCheck(e, setFieldError)
                  }}
                />
              </Grid>
            ) : (
                <Grid item xs={3}>
                  <Field
                    required
                    fullWidth
                    name="idNumber"
                    label={<Trans>ID Number</Trans>}
                    // disabled={readonly}
                    component={TextField}
                    value={values.idNumber}
                    placeholder={placeHolders[1].placeholder.props.id}
                    InputProps={{
                      readOnly: readonly,
                    }}
                  />
                </Grid>
              )}
            <Grid item xs={3}>
              <Field
                required
                fullWidth
                name="issueDate"
                label={<Trans>ISSUE DATE</Trans>}
                disabled={readonly}
                maxDate={today}
                component={FormikDatePicker}
                placeholder={placeHolders[2].placeholder.props.id}
              />
            </Grid>
            <Grid item xs={3}>
              <Field
                required
                fullWidth
                name="expiryDate"
                label={<Trans>EXPIRY DATE</Trans>}
                disabled={readonly}
                minDate={Math.max(today, values.issueDate)}
                component={FormikDatePicker}
                placeholder={placeHolders[3].placeholder.props.id}
              />
            </Grid>
            <Grid item xs={3}>
              <Field
                required
                fullWidth
                // disabled={readonly}
                name="placeOfIssue"
                label={<Trans>Place of issue</Trans>}
                component={TextField}
                placeholder={placeHolders[4].placeholder.props.id}
                InputProps={{
                  readOnly: readonly,
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <Field
                required
                fullWidth
                name="issuedBy"
                label={<Trans>Issued By</Trans>}
                // disabled={readonly}
                component={TextField}
                placeholder={placeHolders[5].placeholder.props.id}
                InputProps={{
                  readOnly: readonly,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={6} justify="flex-end">
            <Grid item>
              <Button color="primary" variant="outlined" onClick={onCloseClick}>
                <Visible when={values.id} otherwise={<Trans>Cancel</Trans>}>
                  <Trans>Close</Trans>
                </Visible>
              </Button>
            </Grid>
            <Visible when={!readonly}>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={onDoneClick}
                  disabled={loader}
                >
                  <Trans>Done</Trans>
                  {loader && <CustomCircularProgress />}
                </Button>
              </Grid>
            </Visible>
          </Grid>
        </Form>
      </Grid>
    </Grid>
  );
};

const DocumentInfo = withFormik({
  mapPropsToValues: ({ value, reduxFormData, name, idNumber = null }) => {
    // const { documentCharacteristic = [] } = value || {};
    const documentCharacteristic = _.get(value, `${name}.documentCharacteristic`, _.get(reduxFormData, `${name}.documentCharacteristic`, []));
    const charMap = documentCharacteristic.reduce((res, char) => {
      res[char.name] = char.value;
      return res;
    }, {});

    return {
      id: value && value.id,
      documentType: _get(charMap, 'documentType', ''),
      idNumber: idNumber || _get(charMap, 'identificationId', ''),
      issueDate: _get(charMap, 'issuingDate', null),
      expiryDate: _get(charMap, 'expiryDate', null),
      placeOfIssue: _get(charMap, 'placeOfIssue', ''),
      issuedBy: _get(charMap, 'issuedBy', ''),
      isNumberDisable: Boolean(idNumber)
    };
  },
  validationSchema: Yup.object().shape({
    documentType: documentTypeRequiredSchema,
    idNumber: documentIdNumberSchema,
    issueDate: documentIssueDateSchema,
    expiryDate: documentExpiryDateSchema,
    placeOfIssue: documentPlaceOfIssueSchema,
    issuedBy: documentIssuedBySchema
  }),
  handleSubmit: ({ isEdit, ...values }, { setSubmitting, props }) => {
    setSubmitting(false);
    props.onComplete(values);
  }
})(InfoForm);

export default DocumentInfo;
