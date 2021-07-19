import React, { Fragment } from 'react';
import {
	Box,
	Button,
	Container,
	Grid,
	Icon,
	makeStyles,
	Tooltip,
	Typography,
	CircularProgress,
} from '@material-ui/core';
import { common, green, grey, indigo, pink } from '@material-ui/core/colors';

import VideoDisplay from '../../../components/Video';
import CopyText from '../CopyText';
import RemoteStream from '../RemoteStream';
import clsx from 'clsx';

import { userDetails } from '../../../helpers';
import Color from '../../../mixins/palette';

const useStyles = makeStyles(() => {
	// const { indigo } = colors;

	return {
		root: {
			display: 'flex',
			backgroundImage: `url('/static/images/background/bubble.svg')`,
			backgroundColor: indigo[700],
			minHeight: '100vh',
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
		wrapper: {
			height: '100%',
			backgroundImage: `url('/static/images/background/bubble.svg')`,
			backgroundColor: indigo[700],
			overflowY: 'scroll',
		},
		container: {
			display: 'flex',
			flexFlow: 'row wrap',
			minHeight: '100vh',
		},
		icon: {
			color: Color.hex.grape,
			fontSize: 36,
		},
		item: {
			position: 'relative',
		},
		permissionsMessage: {
			position: 'absolute',
			right: 200,
			top: 80,
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
			width: '65%',
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
		userDetails: {
			color: common.white,
		},
		activeSpeaker: {
			border: `1px solid ${green[500]}`,
		},
		guestTeacher: {
			border: `1px solid ${Color.hex.grape}`,
		},
	};
});

const GuestTeacherClassView = ({
	actionBtnName,
	clearRaisingHand,
	clearScreenStream,
	clearStream,
	copied,
	setCopied,
	hostTeacherID,
	hostStreamObj,
	hostTeacherStream,
	isLoading,
	isSharingScreen,
	joined,
	joinUrl,
	localStreamObj,
	numHandRaisers,
	readingEventInfo,
	readingEventStartsBy,
	toggleMic,
	toggleCam,
	remoteStreams,
	remoteStreamsObj,
	remoteStreamCommons,
	resumePlaying,
	startStream,
	startScreenStream,
	toggleSettingsDialogOpen,
}) => {
	const { email, user_type } = userDetails;

	const classes = useStyles();

	const localVideoDisplay = (
		<Fragment>
			<Box mt={3} mb={3}>
				<VideoDisplay
					{...{
						hostTeacherID,
						resumePlaying,
						toggleMic,
						toggleCam,
						joined,
						...localStreamObj,
					}}
					isDisplayingForTeacher
					isTeacher
					isLocal
				/>
			</Box>
		</Fragment>
	);

	const remoteStreamsMapper = (stream, ind) => (
		<RemoteStream key={ind} {...{ ...stream, ...remoteStreamCommons }} stream={remoteStreams[ind]}>
			{(props) => (
				<VideoDisplay
					{...{ ...props, clearRaisingHand, joined }}
					iconSize='small'
					isDisplayingForTeacher
				/>
			)}
		</RemoteStream>
	);

	return (
		<Grid container className={classes.wrapper}>
			<Grid item xs={12}>
				<div className={classes.classControls}>
					<Box>{numHandRaisers.length > 0 && numHandRaisers}</Box>
					<Box mt={1} mb={1}>
						<Button
							fullWidth
							className={clsx({
								[classes.buttonWithLoadingIcon]: true,
								[classes.buttonEndClass]: joined && !isLoading, //only when open === true
							})}
							color='primary'
							size='large'
							disabled={readingEventStartsBy || isLoading}
							variant='contained'
							onClick={joined ? clearStream : startStream}
							startIcon={isLoading && <CircularProgress className={classes.circularProgress} />}
						>
							{actionBtnName}
						</Button>
					</Box>
					<Box pl={2} pr={2} pt={1}>
						<Typography variant='h6' className={classes.userDetails}>
							{email} ({user_type})
						</Typography>
					</Box>
					{/* Icon Control Icons */}
					{joined && (
						<Tooltip
							title={`${isSharingScreen ? 'Stop Sharing' : 'Share Your'} Screen`}
							aria-label={`${isSharingScreen ? 'Stop Sharing' : 'Share Your'} Screen`}
							placement='top'
						>
							<Button
								aria-label='present to all'
								onClick={isSharingScreen ? clearScreenStream : startScreenStream}
							>
								<Icon className={classes.icon}>
									{isSharingScreen ? 'cancel_presentation' : 'present_to_all'}
								</Icon>
							</Button>
						</Tooltip>
					)}
					<Tooltip title='Settings' aria-label='Settings' placement='bottom'>
						<Button aria-label='settings' onClick={toggleSettingsDialogOpen}>
							<Icon className={classes.icon}>settings</Icon>
						</Button>
					</Tooltip>
				</div>
			</Grid>
			<Grid item xs={12} sm={4} md={3} className={classes.container}>
				<Container>
					<Grid container>
						<Grid item xs={12} className={classes.teacher}>
							{hostStreamObj.id && (
								<RemoteStream
									{...{ ...remoteStreamCommons, ...hostStreamObj }}
									stream={hostTeacherStream}
								>
									{(props) => <VideoDisplay {...props} isDisplayingForTeacher isTeacher />}
								</RemoteStream>
							)}
							<div className={classes.guestTeacher}>{joined && localVideoDisplay}</div>
						</Grid>
					</Grid>
				</Container>
			</Grid>
			<Grid item xs={12} sm={8} md={9} className={classes.item}>
				{readingEventInfo}
				<div className={classes.permissionsMessage}>
					{/* Permissions Request */}
					{isLoading && localStreamObj.length > 0 && (
						<Fragment>
							<Typography variant='h6' color='primary'>
								Click Allow
							</Typography>
							<Typography variant='body1' color='secondary'>
								to grant browser access to camera and microphone.
							</Typography>
						</Fragment>
					)}
				</div>

				<Grid container>
					<Grid item xs={6} lg={4}>
						<VideoDisplay id='screen-share' joined={joined} isDisplayingForTeacher noControls />
					</Grid>
					{remoteStreamsObj.filter((x) => x.isScreenStream === true).map(remoteStreamsMapper)}
					{remoteStreamsObj.filter((x) => x.isScreenStream !== true).map(remoteStreamsMapper)}
				</Grid>
				{remoteStreams.length === 0 && (
					<Fragment>
						<div className={classes.shareUrlContainer}>
							<Box mt={5}>
								<Typography gutterBottom variant='h4' align='center' className={classes.message}>
									Your students will appear here when they join
								</Typography>
								<Typography
									gutterBottom
									variant='body1'
									align='center'
									className={classes.messageSubtitle}
								>
									Share the following URL to invite attendees to class.
								</Typography>
							</Box>
							<Box mt={5}>
								<CopyText
									fullWidth
									variant='outlined'
									value={joinUrl}
									copiedClassName={classes.shareUrl}
									{...{ copied, setCopied }}
								/>
							</Box>
						</div>
					</Fragment>
				)}
			</Grid>
		</Grid>
	);
};

export default GuestTeacherClassView;
