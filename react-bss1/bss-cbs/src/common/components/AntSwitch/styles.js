export default theme => ({
  root: {
    width: 36,
    height: 20,
    padding: 0,
    marginTop: 5,
    display: 'flex'
  },
  switchBase: {
    padding: 2,
    color: theme.palette.text.secondary,
    '&$checked': {
      transform: 'translateX(15px)',
      color: theme.palette.common.white,
      '& $thumb': {
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.primary.main
      },
      '& + $track': {
        opacity: 1,
        borderColor: theme.palette.primary.main
      }
    }
  },
  thumb: {
    margin: 2,
    width: 12,
    height: 12,
    boxShadow: 'none',
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.grey[500]}`
  },
  track: {
    border: `2px solid ${theme.palette.grey[500]}`,
    borderRadius: 24 / 2,
    opacity: 1,
    backgroundColor: `transparent !important`
  },
  checked: {}
});
