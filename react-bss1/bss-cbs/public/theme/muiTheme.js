import { createMuiTheme } from '@material-ui/core/styles';
import vars from './defaultVariables';
import mtnFontTtf from '../assets/fonts/MTNBrighterSans-Regular.woff2';
import config from 'config';
import _ from 'lodash';

const defaultThemeName = _.get(config, 'dev.uiConfig.defaultThemecolor', 'azureBlue');
export const defaultThemeColor = _.get(vars, defaultThemeName, 'azureBlue');
export const defaultThemeTextName = _.get(config, 'dev.uiConfig.defaultThemeTextColor', 'azureBlue');
const defaultThemeTextColor = _.get(vars, defaultThemeTextName, 'black');

const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 600
};
const mtnFont = {
  fontFamily: 'MTNFont',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('MTNFont'),
    local('MTNFont-Regular'),
    url(${mtnFontTtf}) format('woff2')
  `
};
// url(../assets/fonts/${mtnFontTtf}) format('ttf')

const muiThemeV2 = createMuiTheme({
  palette: {
    primary: {
      // light: "#673afc",
      main: defaultThemeColor,
      // dark: "#000096",
      contrastText: vars.white,
      porcelain: vars.porcelain,
      white: vars.white,
      active: defaultThemeColor,
      inActive: vars.grayOne,
      yellow: defaultThemeColor,
      gray: vars.gray,
      lightGray: vars.lightGray
    },
    secondary: {
      main: vars.gray
    },
    custom: {
      charade: vars.charade,
      solitude: vars.solitude,
      purpleHeart: vars.purpleHeart,
      mustard: vars.mustard,
      grayAthens: vars.grayAthens,
      goldOne: vars.goldOne,
      grayOne: vars.grayOne,
      mediumPurple: vars.mediumPurple,
      doveGray: vars.doveGray,
      nobalGrey: vars.nobalGrey,
      blueCornFlower: vars.blueCornFlower,
      blueViolet: vars.blueViolet,
      raven: vars.raven,
      shuttleGray: vars.shuttleGray,
      ShuttleGrey: vars.ShuttleGrey,
      gray: vars.gray,
      visibleGray: vars.visibleGray,
      selectedGray: vars.selectedGray,
      mercury: vars.mercury,
      lightPurple: vars.lightPurple,
      mischka: vars.mischka,
      moonRaker: vars.moonRaker,
      silver: vars.silver,
      coffee: vars.coffee,
      purple: vars.purple
    },
    timeline: {
      moonRacker: vars.moonRacker,
      seaBuckthorn: vars.seaBuckthorn,
      carnation: vars.carnation,
      shamrock: vars.shamrock,
      blueCornFlower: vars.blueCornFlower,
      greyAthens: vars.greyAthens,
      silverCoin: vars.silverCoin,
      violetBlue: vars.violetBlue,
      white: vars.white,
      purpleHeart: vars.purpleHeart
    },
    sidebar: {
      grayOne: vars.grayOne,
      custIdGray: vars.custIdGray
    },
    text: {
      primary: vars.black,
      secondary: vars.nobalGrey,
      blue: vars.blue,
      grey: vars.grayText,
      subtitle: vars.subTitleText,
      silverOne: vars.silverOne,
      whisper: vars.whisper,
      athensGray: vars.athensGray,
      textsolitude: vars.textsolitude,
      textpurpleHeart: vars.textpurpleHeart,
      textBlack: vars.grayOne,
      sundown: vars.sundown,
      wildWatermelon: vars.wildWatermelon,
      boulder: vars.boulder,
      cadetBlue: vars.cadetBlue,
      manatee: vars.manatee,
      darkBlack: defaultThemeTextColor,
      white: vars.white,
      black: vars.black
    },
    background: {
      main: vars.backgroundMain,
      paper: vars.white,
      default: vars.lightShadeGray,
      cadetBlue: vars.cadetBlue,
      yellow: defaultThemeColor,
      hoverYellow: defaultThemeColor,
      athensGray: vars.athensGray,
      mediumGray: vars.mediumGray,
      black: defaultThemeTextColor,
      opacityBlack: vars.opacityBlack,
      success: vars.success,
      warning: vars.seaBuckthorn,
      danger: vars.error,
      highlight: vars.backgroundHighlight,
      light: vars.backgroundLight
    },
    svgColor: {
      light: vars.grayText,
      main: vars.white,
      dark: vars.primaryBlue,
      orange: vars.darkOrange,
      maroon: vars.maroon,
      black: defaultThemeTextColor,
      blue: vars.darkBlue
    },
    border: {
      gainsBoro: vars.lightGray
    },
    error: {
      light: vars.errorHover,
      main: vars.error,
      dark: vars.errorSelected,
      contrastText: vars.white,
      silverChalice: vars.silverChalice
    },
    success: {
      main: vars.success
    },
    icon: {
      main: vars.nobalGrey,
      filled: vars.white,
      stroke: vars.ShuttleGrey,
      background: vars.backgroundHighlight
    },
    common: {
      backdrop: vars.backdrop,
      grayShadow: vars.grayShadow
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      'MTNFont',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    fontWeightLight: fontWeight.light,
    fontWeightRegular: fontWeight.regular,
    fontWeightMedium: fontWeight.medium,
    fontWeightBold: fontWeight.bold,
    h1: {
      fontSize: 34,
      fontWeight: fontWeight.regular
      //color: '#000000'
    },
    h2: {
      fontSize: 29,
      fontWeight: fontWeight.regular
      //color: '#000000'
    },
    h3: {
      fontSize: 29,
      fontWeight: fontWeight.light,
      textTransform: 'uppercase'
      //color: '#000000'
    },
    h4: {
      fontSize: 24,
      fontWeight: fontWeight.regular
      //color: '#1400c8'
    },
    h5: {
      fontSize: 20,
      fontWeight: fontWeight.light
      //textTransform: "uppercase",
      //color: '#000000'
    },
    h6: {
      fontSize: 20,
      fontWeight: fontWeight.bold
      //color: '#161616'
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: fontWeight.regular
      //color: '#191919'
    },
    subtitle2: {
      fontSize: 10
    },
    body1: {
      fontWeight: fontWeight.regular,
      fontSize: 16,
      color: vars.black
    },
    body2: {
      fontWeight: fontWeight.light,
      fontSize: 14
    },
    caption: {
      fontWeight: fontWeight.regular,
      fontSize: 12
    },
    button: {
      fontWeight: fontWeight.medium,
      fontSize: 14,
      textTransform: 'none',
      boxShadow: 'none'
    },
    overline: {
      fontSize: 18,
      fontWeight: fontWeight.light
    }
  },
  spacing: factor => `${0.25 * factor}rem`,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [mtnFont]
      }
    },
    MuiButton: {
      // Name of the rule
      text: {
        boxShadow: 'none'
      },
      contained: {
        boxShadow: 'none'
      },
      containedPrimary: {
        color: defaultThemeTextColor
      }
    },
    MuiTabs: {
      indicator: {
        backgroundColor: 'none',
        height: 0,
        root: {
          height: 0
        }
      }
    },
    MuiTab: {
      root: {
        backgroundColor: vars.nobalGrey,
        minHeight: '35px',
        borderRadius: '5px',
        minWidth: '100px',
        margin: '5px 1px'
      },
      textColorInherit: {
        opacity: 1,
        color: vars.white,
        '&$selected': {
          background: defaultThemeColor,
          color: defaultThemeTextColor
        }
      }
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 14
      }
    },
    MuiDialog: {
      paperScrollPaper: {
        maxHeight: 'calc(100% - 50px)'
      }
    },
    MuiPaper: {
      root: { color: vars.ShuttleGrey },
      rounded: {
        borderRadius: 16,
        padding: 24,
        boxShadow: 'none'
      }
    },
    MuiInputLabel: {
      formControl: {
        fontSize: 14,
        color: vars.darkGray
      },
      shrink: {
        fontSize: 16,
        color: vars.darkGray,
        textTransform: 'uppercase'
      }
    },
    MuiTable: {
      root: {
        background: vars.backgroundMain,
        borderSpacing: '0 8px',
        borderCollapse: 'separate'
        // padding: '0 1em'
      }
    },
    MuiTableCell: {
      root: {
        borderBottom: 'none',
        padding: '4px 12px'
      },
      head: {
        fontSize: 14,
        color: vars.raven
      },
      body: {
        fontSize: 14,
        color: vars.raven,
        backgroundColor: vars.white,
        '&:first-child': {
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5
        },
        '&:last-child': {
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5
        }
      }
    },
    MuiTableRow: {
      root: {
        height: 60
      }
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          fontSize: 18,
          fontWeight: 600,
          color: defaultThemeTextColor
        },
        asterisk: {
          color: defaultThemeTextColor
        },
        '&$filled': {
          fontSize: '16px',
          fontWeight: 300,
          color: vars.raven
        }
      }
    }
  }
});

export default muiThemeV2;
