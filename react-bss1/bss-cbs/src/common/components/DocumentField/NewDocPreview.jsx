import React, { useState, useCallback } from 'react';
import { Trans } from '@lingui/macro';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Document, Page } from 'react-pdf/dist/entry.webpack';

const PdfPreview = ({ path, autoWidth }) => {
  const [width, setWidth] = useState(autoWidth ? 'auto' : 150);

  const div = useCallback(node => {
    if (node !== null && !autoWidth) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  return (
    <div ref={div}>
      <Document file={path}>
        <Page pageNumber={1} width={width} scale={1} />
      </Document>
    </div>
  );
};

const styles = theme => ({
  img: {
    width: '100%'
  }
});

const NewDocPreview = ({ attachment, classes }) => {
  if (attachment.type === 'application/pdf') {
    return (
      <PdfPreview
        path={''}
      // path={attachment.href.replace(/http:|https:/, window.location.protocol)}
      />
    );
  }
  if (/^image/i.test(attachment.type)) {
    return <img src={attachment.href} className={classes.img} />;
  }
  return (
    <>
      <Typography>
        <Trans>No Preview available</Trans>
      </Typography>
      <Link href={attachment.href} target="blank">
        View Here
      </Link>
    </>
  );
};

export default withStyles(styles)(NewDocPreview);
