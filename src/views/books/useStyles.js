import { makeStyles } from '@material-ui/core/styles';
// import Color from '../../mixins/palette';
import { common, /*green,*/ lightBlue, teal, grey } from '@material-ui/core/colors';

const useStyles = makeStyles(() => {
	return {
		theEnd: {
			height: 720,
			lineHeight: '100%',
			width: `calc(100% - 40px)`,
		},
		arrow: {
			fontSize: 48,
			display: 'flex',
			alignItems: 'center',
		},
		arrowBack: {
			fontSize: 48,
			display: 'flex',
			alignItems: 'center',
			transform: 'rotate(180deg)',
		},
		buttonContainer: {
			display: 'flex',
			justifyContent: 'center',
		},
		carouselContainer: {
			display: 'flex',
			justifyContent: 'center',
		},
		carouselSlide: {
			display: 'flex',
			justifyContent: 'center',
		},
		textContainer: {
			animation: '$textAppear 0s 1s forwards',
			background: 'rgba(0,0,0,0.4)',
			color: common.white,
			fontSize: '2.5em',
			maxHeight: '90%',
			opacity: 0,
			overflowY: 'scroll',
			padding: 30,
			position: 'absolute',
			right: 0,
			textAlign: 'left',
			textShadow: `-2px -2px 0 #000,  2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`,
			top: 0,
			width: 500,
			zIndex: 100,
		},
		'@keyframes textAppear': {
			to: { opacity: 1 },
		},
		prevButton: {
			background: lightBlue[700],
			border: `1px solid ${lightBlue['700']}`,
			color: common.white,
			'&:hover': {
				border: `1px solid ${teal['A700']}`,
			},
		},
		nextButton: {
			background: teal['A700'],
			borderColor: teal['A700'],
			color: common.white,
		},
		pageIndex: {
			padding: 5,
		},
		pageIndexContainer: {
			display: 'flex',
			margin: 10,
			justifyContent: 'center',
		},
		[`@supports (-webkit-text-stroke: 2px ${grey[500]})`]: {
			textContainer: {
				'-webkit-text-stroke': `2px ${teal['700']}`,
				'-webkit-text-fill-color': common.white,
			},
		},
	};
});

export default useStyles;
