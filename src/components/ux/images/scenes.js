import React from 'react';
import { makeStyles } from '@material-ui/core';
import Color from '../../../mixins/palette';

const useStyles = makeStyles((/* theme */) => {
	const handColor = Color.hex.salmon;
	const handSize = '8vmin';
	const handProps = {
		background: handColor,
		height: `calc(${handSize} * 0.4)`,
		width: `calc(${handSize} * 0.4)`,
		borderRadius: `calc(${handSize} * 0.14) calc(${handSize} * 0.14) calc(${handSize} * 0.1) calc(${handSize} * 0.1)`,
		position: 'absolute',
		bottom: '15%',
		left: '30%',
		animation: '$wave-hi 15s infinite',
		boxShadow: `3px 10px 5px 0px ${Color.hex.tangerine}`,
	};

	const handSizeSmall = '5vmin';
	const handPropsSmall = {
		background: handColor,
		height: `calc(${handSizeSmall} * 0.4)`,
		width: `calc(${handSizeSmall} * 0.4)`,
		borderRadius: `calc(${handSizeSmall} * 0.14) calc(${handSizeSmall} * 0.14) calc(${handSizeSmall} * 0.1) calc(${handSizeSmall} * 0.1)`,
		position: 'absolute',
		bottom: '15%',
		left: '30%',
		animation: '$wave-hi 15s infinite',
		boxShadow: `3px 10px 5px 0px ${Color.hex.tangerine}`,
	};

	return {
		//TeacherAvatar
		bigsmile: {
			opacity: 0,
			animation: '$smile 3s linear infinite',
		},
		'@keyframes smile': {
			'49%': {
				opacity: 0,
			},
			'50%': {},
			'99%': {
				opacity: 1,
			},
			'100%': {
				opacity: 0,
			},
		},
		apple: {
			animation: '$appleGlow 2s ease-in-out infinite',
			opacity: 0.45,
		},
		'@keyframes appleGlow': {
			'0%': {
				opacity: 0.45,
			},
			'50%': {
				opacity: 1,
			},
			'75%': {
				opacity: 1,
			},
		},
		st1: {
			fill: '#CC9A7F',
		},
		st2: {
			fill: 'none',
			stroke: '#5E290B',
			strokeWidth: 16,
			strokeMiterlimit: 10,
		},
		st3: {
			fill: '#B76E6E',
		},
		st4: {
			display: 'inline',
			fill: '#B76E6E',
		},
		st5: {
			display: 'inline',
			fill: '#562726',
		},
		st6: {
			display: 'inline',
			fill: '#FAFAFA',
		},
		st7: {
			fill: '#CC9A7F',
			stroke: '#5E290B',
			strokeWidth: 9,
			strokeMiterlimit: 10,
		},
		st8: {
			fill: '#CC9A7F',
			stroke: '#5E290B',
			strokeWidth: 13,
			strokeMiterlimit: 10,
		},
		st9: {
			opacity: 0.5,
			fill: '#D3B8AF',
			stroke: '#5E290B',
			strokeWidth: 9,
			strokeMiterlimit: 10,
		},
		st10: {
			fill: '#774224',
		},
		st11: {
			fill: '#262525',
		},
		st12: {
			fill: '#C1927E',
		},
		st13: {
			fill: '#3D2F26',
		},
		st14: {
			fill: '#A5A3A4',
		},
		st15: {
			fill: '#7F8289',
		},
		st16: {
			fill: '#FFFFFF',
		},
		eyes: {
			animation: '$eyesMove 3s linear infinite',
		},
		'@keyframes eyesMove': {
			'0%': {
				transform: `translateY(0px)`,
			},
			'15%': {
				transform: `translateY(10px)`,
			},
			'50%': {
				transform: `translateY(10px)`,
			},
			'60%': {
				transform: 'translateY(0px)',
			},
			'69%': {
				opacity: 1,
			},
			'70%': {
				opacity: 0,
			},
			'71%': {
				opacity: 1,
			},
			'100%': {
				opacity: 1,
			},
		},

		'@keyframes swim': {
			'0%': { marginLeft: -235 },
			'70%': { marginLeft: '100%' },
			'100%': { marginLeft: '100%' },
		},

		fish: {
			overflow: 'visible',
			bottom: '10em',
			width: 235,
			height: 104,
			marginLeft: -235,
			position: ' absolute',
			animation: '$swim 20s',
			'-webkit-animation': '$swim 20s',
			'animation-iteration-count': 'infinite',
			'-webkit-animation-iteration-count': 'infinite',
			'animation-timing-function': 'linear',
			'-webkit-animation-timing-function': 'linear',
		},
		fishId1To6: {
			fill: '#528484',
			'-moz-animation': '$bounce 2s infinite',
			'-webkit-animation': '$bounce 2s infinite',
			animation: '$bounce 2s infinite',
		},
		fish2: {
			'animation-delay': '0.5s',
			'-webkit-animation-delay': '0.5s',
		},
		fish3: {
			'animation-delay': '0.2s',
			'-webkit-animation-delay': '0.2s',
		},
		fish4: {
			'animation-delay': '0.4s',
			'-webkit-animation-delay': '0.4s',
		},
		fish5: {
			'animation-delay': '0.1s',
			'-webkit-animation-delay': '0.1s',
		},
		fish6: {
			'animation-delay': '0.3s',
			'-webkit-animation-delay': '0.3s',
		},

		'@keyframes bounce': {
			'0%': {
				'-moz-transform': 'translateY(0)',
				'-ms-transform': 'translateY(0)',
				'-webkit-transform': 'translateY(0)',
				transform: 'translateY(0)',
			},
			'50%': {
				'-moz-transform': 'translateY(0)',
				'-ms-transform': 'translateY(0)',
				'-webkit-transform': 'translateY(0)',
				transform: 'translateY(0)',
			},
			'100%': {
				'-moz-transform': 'translateY(0)',
				'-ms-transform': 'translateY(0)',
				'-webkit-transform': 'translateY(0)',
				transform: 'translateY(0)',
			},
			'25%': {
				'-moz-transform': 'translateY(-5px)',
				'-ms-transform': 'translateY(-5px)',
				'-webkit-transform': 'translateY(-5px)',
				transform: 'translateY(-5px)',
			},
			'75%': {
				'-moz-transform': 'translateY(-3px)',
				'-ms-transform': 'translateY(-3px)',
				'-webkit-transform': 'translateY(-3px)',
				transform: 'translateY(-3px)',
			},
		},

		//Icon: BriefCase
		iconwrap: {
			display: 'block',
			width: 168,
			height: 170,
			margin: 0,
			padding: 0,
			float: 'left',
			position: 'relative',
			'&:hover': {
				'&.long-shadow': {
					opacity: 1,
					'-moz-transition-delay': '.5s !important',
					'-webkit-transition-delay': '.5s !important',
					'transition-delay': '.5s !important',
				},
			},
		},
		flatShadow: {
			zIndex: 999,
			position: 'relative',
			'&:hover': {
				'&.icon': {
					'-moz-transform': 'scale(1,1)',
					'-webkit-transform': 'scale(1,1)',
					transform: 'scale(1,1)',
					/*animation-name*/
					'-webkit-animation-name': '$shadow-burst',
					'-moz-animation-name': '$shadow-burst',
					'-ms-animation-name': '$shadow-burst',
					'-o-animation-name': '$shadow-burst',
					'animation-name': '$shadow-burst',
					/*animation-duration*/
					'-webkit-animation-duration': '.4s',
					'-moz-animation-duration': '.4s',
					'-ms-animation-duration': '.4s',
					'-o-animation-duration': '.4s',
					'animation-duration': '.4s',
					/*transform-origin*/
					'-webkit-transform-origin': '50% 50%',
					'-moz-transform-origin': '50px 50px !important',
					'-ms-transform-origin': '50% 50%',
					'-o-transform-origin': '50% 50%',
					'transform-origin': '50% 50%',
				},
			},
		},
		// '@-webkit-keyframes shadow-burst': {
		// 	'0%': {
		// 		'-webkit-transform': 'scale(1.1)',
		// 		'animation-timing-function': 'ease-in',
		// 	},
		// 	'37%': {
		// 		'-webkit-transform': 'scale(1.3)',
		// 		'animation-timing-function': 'ease-out',
		// 	},
		// 	'55%': {
		// 		'-webkit-transform': 'scale(1.17)',
		// 		'animation-timing-function': 'ease-in',
		// 	},
		// 	'73%': {
		// 		'-webkit-transform': 'scale(1.05)',
		// 		'animation-timing-function': 'ease-out',
		// 	},
		// 	'82%': {
		// 		'-webkit-transform': 'scale(1.2)',
		// 		'animation-timing-function': 'ease-in',
		// 	},
		// 	'91%': {
		// 		'-webkit-transform': 'scale(1.3)',
		// 		'animation-timing-function': 'ease-out',
		// 	},
		// 	'96%': {
		// 		'-webkit-transform': 'scale(1.2)',
		// 		'animation-timing-function': 'ease-in',
		// 	},
		// 	'100%': {
		// 		'-webkit-transform': 'scale(1.1)',
		// 		'animation-timing-function': 'ease-out',
		// 	},
		// },
		// '@-moz-keyframes shadow-burst': {
		// 	'0%': {
		// 		'-moz-transform': `scale(1,1)`,
		// 		'animation-timing-function': 'ease-in',
		// 	},
		// 	'37%': {
		// 		'-moz-transform': 'scale(1.5,1.5)',
		// 		'animation-timing-function': 'ease-out',
		// 	},
		// 	'55%': {
		// 		'-moz-transform': 'scale(1.37,1.37)',
		// 		'animation-timing-function': 'ease-in',
		// 	},
		// 	'73%': {
		// 		'-moz-transform': `scale(1,1)`,
		// 		'animation-timing-function': 'ease-out',
		// 	},
		// 	'82%': {
		// 		'-moz-transform': `scale(1.45,1.45)`,
		// 		'animation-timing-function': 'ease-in',
		// 	},
		// 	'91%': {
		// 		'-moz-transform': 'scale(1.5,1.5)',
		// 		'animation-timing-function': 'ease-out',
		// 	},
		// 	'96%': {
		// 		'-moz-transform': 'scale(1.4,1.4)',
		// 		'animation-timing-function': 'ease-in',
		// 	},
		// 	'100%': {
		// 		'-moz-transform': `scale(1,1)`,
		// 		'animation-timing-function': 'ease-in',
		// 	},
		// },
		'@keyframes shadow-burst': {
			'0%': {
				transform: `scale(1,1)`,
				'animation-timing-function': 'ease-in',
			},
			'37%': {
				transform: 'scale(1.5,1.5)',
				'animation-timing-function': 'ease-out',
			},
			'55%': {
				transform: 'scale(1.37,1.37)',
				'animation-timing-function': 'ease-in',
			},
			'73%': {
				transform: `scale(1,1)`,
				'animation-timing-function': 'ease-out',
			},
			'82%': {
				transform: `scale(1.45,1.45)`,
				'animation-timing-function': 'ease-in',
			},
			'91%': {
				transform: 'scale(1.5,1.5)',
				'animation-timing-function': 'ease-out',
			},
			'96%': {
				transform: 'scale(1.4, 1.4)',
				'animation-timing-function': 'ease-in',
			},
			'100%': {
				transform: 'scale(1,1)',
				'animation-timing-function': 'ease-out',
			},
		},
	};
});

const MountainScene = () => {
	const classes = useStyles();

	return (
		
	);
};

TeacherAvatar.propTypes = {};
SwimmingFish.propTypes = {};
BriefCaseIcon.propTypes = {};
WavingHandIcon.propTypes = {};

const Stickers = {
	MountainScene,
};

const ScenesSvg = {

	...Stickers,
};

export default ScenesSvg;
