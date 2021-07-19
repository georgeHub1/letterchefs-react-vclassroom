import { createMuiTheme } from '@material-ui/core';
import { common, grey, indigo, teal } from '@material-ui/core/colors';
import Color from '../mixins/palette';
import shadows from './shadows';
import typography from './typography';

const fontWeight400 = {
	fontWeight: 400,
};
const fontWeight300 = {
	fontWeight: 300,
};

const fontWeight600 = {
	fontWeight: 600,
};

const paddingSizeLarge = `10px 20px`;

const theme = createMuiTheme({
	palette: {
		background: {
			dark: '#F4F6F8',
			default: common.white,
			paper: common.white,
		},
		primary: {
			main: Color.hex.grape,
		},
		secondary: {
			main: '#FABA9E',
		},
		text: {
			primary: common.black,
			secondary: grey[800],
		},
	},
	shadows,
	typography,
	props: {
		MuiButton: {
			disableElevation: true,
			disableFocusRipple: true,
			disableRipple: true,
			disableTouchRipple: true,
		},
	},
	overrides: {
		MuiIconButton: {
			colorPrimary: {
				color: teal['A700'],
			},
			colorSecondary: {
				color: Color.hex.grape,
			},
		},
		MuiButton: {
			root: {
				disableElevation: true,
				disableRipple: true,
				disableTouchRipple: true,
				borderRadius: 2,
			},
			containedPrimary: {
				backgroundColor: teal['A700'],
				color: common.white,
				'&:hover': {
					backgroundColor: teal['A400'],
					color: common.white,
				},
			},
			containedSizeLarge: {
				padding: paddingSizeLarge,
			},
			containedSizeSmall: {
				// padding: paddingSizeSmall,
			},
			containedSecondary: {
				backgroundColor: Color.hex.blue,
				color: teal[700],
				'&:hover': {
					backgroundColor: indigo[800],
					color: common.white,
				},
			},
			outlinedPrimary: {
				border: `1px solid ${teal['A700']}`,
				color: teal['A700'],
				'&:hover': {
					backgroundColor: grey[300],
					border: `1px solid ${teal['A700']}`,
				},
			},
			outlinedSecondary: {
				border: `1px solid ${Color.hex.grape}`,
				color: Color.hex.grape,
				backgroundColor: Color.hex.blue,
				'&:hover': {
					backgroundColor: Color.hex.berry,
					color: common.white,
					border: `1px solid ${Color.hex.grape}`,
				},
			},
			outlinedSizeLarge: {
				padding: paddingSizeLarge,
			},
		},
		MuiCircularProgress: {
			size: 20,
		},
		MuiOutlinedInputBase: {
			root: {
				'& $notchedOutline': {
					color: Color.hex.grey,
				},
				'&:hover $notchedOutline': {
					color: Color.hex.grey,
				},
				'&$focused $notchedOutline': {
					color: Color.hex.grey,
				},
			},
		},
		MuiTableCell: {
			root: {
				fontSize: '1rem',
			},
		},
		MuiTooltip: {
			tooltip: {
				fontSize: '1.2rem',
			},
		},
		MuiTypography: {
			h1: fontWeight300,
			h2: fontWeight300,
			h3: fontWeight300,
			h4: fontWeight600,
			h5: fontWeight300,
			h6: fontWeight300,
			subtitle1: fontWeight400,
			subtitle2: fontWeight400,
			body1: fontWeight400,
			body2: fontWeight400,
		},
	},
});

export default theme;
