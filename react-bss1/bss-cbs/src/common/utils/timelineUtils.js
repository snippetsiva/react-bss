export const STATUS_COLOR_VALUES = (theme, value, restStyle = {}) => {
  return {
    idle: {
      [value]: theme.palette.secondary.main,
      ...restStyle
    },
    open: {
      [value]: theme.palette.secondary.main,
      ...restStyle
    },
    created: {
      [value]: theme.palette.secondary.main,
      ...restStyle
    },
    inProgress: {
      [value]: theme.palette.warning.main,
      ...restStyle
    },
    partial: {
      [value]: theme.palette.warning.main,
      ...restStyle
    },
    captured: {
      [value]: theme.palette.warning.main,
      ...restStyle
    },
    active: {
      [value]: theme.palette.success.main,
      ...restStyle
    },
    pending: {
      [value]: theme.palette.warning.main,
      ...restStyle
    },
    draft: {
      [value]: theme.palette.text.secondary,
      ...restStyle
    },
    cancelled: {
      [value]: theme.palette.error.main,
      ...restStyle
    },
    held: {
      [value]: theme.palette.error.main,
      ...restStyle
    },
    failed: {
      [value]: theme.palette.error.main,
      ...restStyle
    },
    suspended: {
      [value]: theme.palette.error.main,
      ...restStyle
    },
    softSuspended: {
      [value]: theme.palette.error.main,
      ...restStyle
    },
    rejected: {
      [value]: theme.palette.error.main,
      ...restStyle
    },
    inactive: {
      [value]: theme.palette.error.main,
      ...restStyle
    },
    completed: {
      [value]: theme.palette.success.main,
      ...restStyle
    },
    resolved: {
      [value]: theme.palette.success.main,
      ...restStyle
    },
    fulfilled: {
      [value]: theme.palette.success.main,
      ...restStyle
    },
    uploaded: {
      [value]: theme.palette.success.main,
      ...restStyle
    },
    acknowledged: {
      [value]: theme.palette.success.main,
      ...restStyle
    },
    initialized: {
      [value]: theme.palette.common.manhattan,
      ...restStyle
    }
  };
};