import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import { Trans } from '@lingui/macro';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/EditOutlined';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ViewIcon from '@material-ui/icons/VisibilityOutlined';
import _get from 'lodash/get';
import SvgIcon from 'common/components/SvgIcon';
import Visible from 'common/components/Visible';
import constants from 'common/constants/constants';
import { getRelatedParty } from 'actions/partyInteraction';
import { bytesToMbs } from 'common/utils/stringUtil';
import DocumentInfo from './DocumentInfo';
import DocumentPreview from './DocumentPreview';
// import NewDocPreview from './NewDocPreview';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  paper: {
    height: '100%',
    borderRadius: 5,
    padding: theme.spacing(4)
  },
  title: {
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    height: theme.spacing(12),
    color: theme.palette.text.primary
  },
  filePicker: {
    cursor: 'pointer'
  },
  fileArea: {
    overflow: 'hidden',
    textAlign: 'center',
    height: theme.spacing(26),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    border: `2px dotted ${theme.palette.custom.mercury}`
  },
  scanIcon: {
    display: 'inline-block',
    margin: theme.spacing(2, 0, 4),
    color: theme.palette.primary.main
  },
  uploadedIcon: {
    fontSize: 30,
    margin: theme.spacing(4),
    color: theme.palette.success.main
  },
  previewTitle: {
    margin: 0,
    padding: 0
  },
  previewClose: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(2)
  },
  errorField: {
    boxShadow: `0 0 3px ${theme.palette.error.main}`
  }
}));

const DocumentField = ({
  customerType,
  specification,
  masterDocumentTypes,
  uploadDocument,
  handleShowToast,
  field: { name, value },
  form: { setFieldValue, errors },
  characteristics,
  handleFileSelect = null,
  maxSize = constants.fileSpecs.maxSize,
  allowedTypesRegex = constants.fileSpecs.allowedTypesRegex,
  allowedTypes = constants.fileSpecs.allowedTypes,
  icon,
  upload,
  required = false,
  customerCategory,
  customerSubCategory,
  callDuplicateIdCheck,
  setFieldError,
  customerRegistrationPayload,
  reduxFormData,
  isSummaryStep = false,
  ...restProps
}) => {
  const idNumber = _get(restProps, 'value.formData.companyDetails.registrationNumber', '');
  const isForeigner = _get(restProps, 'value.isForeigner', false);

  const classes = useStyles();
  const fileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [document, setDocument] = useState(null);
  const [base64, setBase64] = useState("");
  const [loader, setLoader] = useState(false);

  const onClear = () => {
    setFieldValue(name, null);
    setDocument(null);
    fileRef.current.value = '';
  };

  const pickFile = () => {
    onClear();
    fileRef.current.click();
  };

  const onChange = e => {
    const file = e.target.files[0];
    if (!allowedTypesRegex.exec(file.name)) {
      handleShowToast({
        type: 'error',
        message: (
          <Trans>
            Only PDF, XLS, DOC, TXT, PNG and JPEG formats are accepted.
          </Trans>
        )
      });
    } else if (file.size > maxSize) {
      const mbs = bytesToMbs(maxSize);
      handleShowToast({
        type: 'error',
        message: <Trans>File must be less than {mbs}MB</Trans>
      });
    } else {
      convertToBase64(e);
      setDocument(e.target.files[0]);
      if (handleFileSelect) {
        handleFileSelect(e.target.files[0]);
      } else {
        setOpen(true);
      }
      fileRef.current.value = '';
    }
  };

  function convertToBase64(event) {
    var file = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = function () {
      // it also contains the Data URI, if you need only Base64 String, then please remove the prefix and keep only Base64 string
      // let b64 = reader.result.replace(/^data:.+;base64,/, '');
      let b64 = reader.result;
      setBase64(b64); //-> "R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs="
      // console.log('b64', b64);
    };
    reader.readAsDataURL(file);
  };

  const onComplete = async item => {
    const documentCharacteristic = [
      {
        name: 'placeOfIssue',
        value: item.placeOfIssue
      },
      {
        name: 'documentType',
        value: item.documentType
      },
      {
        name: 'issuingDate',
        value: item.issueDate || ''
      },
      {
        name: 'expiryDate',
        value: item.expiryDate || ''
      },
      {
        name: 'identificationId',
        value: item.idNumber
      },
      {
        name: 'issuedBy',
        value: item.issuedBy
      },
    ];

    if (document) {
      const formattedIssueDate = moment(item.issueDate, constants.dateFormat.reverseDate).format(
        constants.dateFormat.reverseDate
      );
      const formattedExpiryDate = moment(item.expiryDate, constants.dateFormat.reverseDate).format(
        constants.dateFormat.reverseDate
      );

      const requestObject = {
        image: base64,
        place: item.placeOfIssue,
        selectValue: item.documentType,
        issueDate: formattedIssueDate,
        expDate: formattedExpiryDate,
        idNumber: item.idNumber,
        fileName: document.name,
        idType: specification.idType,
        isCompareRequired: false
      }

      const uploadPayload = {
        request: JSON.stringify(requestObject),
        requestType: "CorporateRegistrationRequest",
        customerName: _.get(restProps, 'value.formData.companyDetails.companyName', ""),
        partyInteractionId: _.get(customerRegistrationPayload, 'id', ""),
      }

      setLoader(true);
      const response = await uploadDocument(uploadPayload);
      setLoader(false);
      setFieldValue(name, { ...response, documentCharacteristic: documentCharacteristic });

    } else {
      setFieldValue(`${name}.documentCharacteristic`, documentCharacteristic);
    }
    setOpen(false);
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  const onEdit = () => {
    setOpen(true);
  };

  const onClose = () => {
    setLoader(false);
    setOpen(false);
  };

  const attachment = _get(value, `attachment[0]`, _get(reduxFormData, `${name}.attachment[0]`, ''));
  const errorMsg = _get(errors, `${name}`);

  return (
    <Paper
      elevation={1}
      className={classNames({
        [classes.paper]: true,
        [classes.errorField]: !!errorMsg
      })}
    >
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography
            component="div"
            variant="button"
            className={classes.title}
          >
            {specification.name}
            {required && (
              <Typography component="span" color="error">
                {' '}
                *
              </Typography>
            )}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.fileArea}>
            <Visible
              when={!attachment}
              otherwise={<DocumentPreview attachment={attachment} />}
            >
              {icon ? (
                <SvgIcon
                  iconName="BulkUpload"
                  className={classes.scanIcon}
                  iconWidth={40}
                />
              ) : (
                  <SvgIcon iconName="Scan" className={classes.scanIcon} />
                )}
              <Typography component="div" variant="subtitle2">
                <Trans>Drop your file here</Trans>
              </Typography>
              <Typography component="div" variant="subtitle2">
                {' '}
                <Trans>Or</Trans>{' '}
                <Link className={classes.filePicker} onClick={pickFile}>
                  <Trans>Select File</Trans>
                </Link>
              </Typography>
            </Visible>
            <input
              hidden
              type="file"
              ref={fileRef}
              onChange={e => onChange(e)}
              accept={allowedTypes}
            />
          </Box>
        </Grid>
        {specification.eligibleDocumentList && (
          <Grid item xs={12}>
            {errorMsg ? (
              <Typography color="error">{errorMsg}</Typography>
            ) : null}
            <Visible when={attachment}>
              <Grid container spacing={6} justify="flex-end">
                <Grid item>
                  <IconButton size="small" onClick={onEdit}>
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton size="small" onClick={togglePreview}>
                    <ViewIcon />
                  </IconButton>
                </Grid>
                {!isSummaryStep ? (
                  <Grid item>
                    <IconButton size="small" onClick={onClear}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                ) : null}
              </Grid>
            </Visible>
          </Grid>
        )}
      </Grid>

      <Drawer open={open} anchor="bottom" onClose={onClose}>
        {specification.eligibleDocumentList && (
          <DocumentInfo
            value={restProps.value}
            reduxFormData={reduxFormData}
            onClose={onClose}
            onComplete={onComplete}
            document={document}
            customerType={customerType}
            specification={specification}
            name={name}
            masterDocumentTypes={masterDocumentTypes}
            customerCategory={customerCategory}
            customerSubCategory={customerSubCategory}
            callDuplicateIdCheck={callDuplicateIdCheck}
            isForeigner={isForeigner}
            setFieldError={setFieldError}
            idNumber={idNumber}
            loader={loader}
            readonly={isSummaryStep}
          />
        )}
      </Drawer>

      <Dialog fullWidth maxWidth="md" open={preview} onClose={togglePreview}>
        <DialogTitle disableTypography className={classes.previewTitle}>
          <Typography variant="h6">{specification.name}</Typography>
          <IconButton className={classes.previewClose} onClick={togglePreview}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogTitle>{ }</DialogTitle>
        <DocumentPreview attachment={attachment} autoWidth />
      </Dialog>
    </Paper>
  );
};

export default DocumentField;
