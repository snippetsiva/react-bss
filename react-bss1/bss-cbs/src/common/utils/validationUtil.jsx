import React from 'react';
import * as Yup from 'yup';
import { Trans } from '@lingui/macro';
import constants from 'common/constants/constants';

export const documentTypeRequiredSchema = Yup.string().required(
  <Trans>Select document type</Trans>
);

export const documentIdNumberSchema = Yup.string()
  .required(<Trans>Enter document number</Trans>)
  .matches(constants.regex.idRegex, <Trans>Enter a valid document ID</Trans>)
  .max(constants.fieldLengths.idNumber, <Trans>Maximum limit exceeded</Trans>);

export const documentIssueDateSchema = Yup.date().required(
  <Trans>Select document issue date</Trans>
);

export const documentExpiryDateSchema = Yup.date().required(
  <Trans>Select document expiry date</Trans>
);

export const documentPlaceOfIssueSchema = Yup.string()
  .required(<Trans>Enter Place of Issue</Trans>)
  .matches(constants.regex.text, <Trans>Enter valid Place of Issue</Trans>);

export const documentIssuedBySchema = Yup.string()
  .required(<Trans>Enter Issued By</Trans>)
  .matches(constants.regex.text, <Trans>Enter valid Issued By</Trans>);

export const generateNestedSchema = (path, schema) => {
  const index = path.indexOf('.');

  if (index === -1) {
    return Yup.object().shape({
      [path]: schema
    });
  }
  const firstProp = path.substr(0, index);
  const remaining = path.substr(index + 1, path.length);
  return Yup.object().shape({
    [firstProp]: generateNestedSchema(remaining, schema)
  });
};
