import { makeStyles } from '@material-ui/core';
import { common, green, grey, indigo, pink, teal } from '@material-ui/core/colors';

const useStyles = makeStyles(() => {
	return {
		root: {
			display: 'flex',
			backgroundImage: `url('/static/images/background/bubble.svg')`,
			backgroundColor: indigo[700],
			minHeight: '100vh',
		},
		activeSpeaker: {
			border: `1px solid ${green[500]}`,
		},
		buttonWithLoadingIcon: {
			'&:disabled': {
				backgroundColor: common.grey,
				color: common.white,
			},
		},
		buttonEndClass: {
			backgroundColor: pink[700],
		},
		circularProgress: {
			height: 20,
		},
		container: {
			display: 'flex',
			flexFlow: 'row wrap',
			minHeight: '100vh',
		},
		fab: {
			position: 'fixed',
			bottom: 0,
			right: 0,
			zIndex: 1000,
		},
		icon: {
			color: teal['A700'],
			fontSize: 36,
		},
		item: {
			position: 'relative',
		},
		teacher: {
			color: grey[300],
		},
		message: {
			color: grey[300],
		},
		messageSubtitle: {
			color: grey[400],
		},
		noStudentMessage: {
			alignSelf: 'center',
			color: grey[400],
		},
		shareUrlContainer: {
			width: '65%',
			margin: 'auto',
		},
		startClassContainer: {
			display: 'flex',
			flexFlow: 'row nowrap',
			margin: 'auto',
		},
		shareUrl: {
			backgroundColor: common.white,
			borderRadius: 2,
		},
		title: {
			justifyContent: 'center',
			alignContent: 'center',
		},
		classControls: {
			display: 'flex',
			justifyContent: 'flex-end',
		},
		userDetailsContainer: {
			display: 'flex',
			alignSelf: 'center',
		},
		userDetails: {
			color: common.white,
		},
		screen: {
			// border: `1px solid ${green[500]}`,
		},
		stage: {
			position: 'absolute',
		},
		screenOnStage: {
			top: 0,
			zIndex: 99,
		},
		studentOnStage: {
			background: indigo[700],
			top: 0,
			zIndex: 100,
		},
		wrapper: {
			height: '100%',
			backgroundColor: indigo[700],
			backgroundImage: `url('/static/images/background/bubble.svg')`,
			overflowY: 'scroll',
			width: '100%',
			position: 'relative',
		},
	};
});

export default useStyles;
