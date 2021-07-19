import React, { Fragment } from 'react';
import {
	Box,
	Button,
	// Container,
	Grid,
	Icon,
	// makeStyles,
	Tooltip,
	Typography,
	CircularProgress,
} from '@material-ui/core';
// import { common, green, grey, indigo, pink, teal } from '@material-ui/core/colors';
import VideoDisplay from '../../../components/Video';
import CopyText from '../CopyText';
import RemoteStream from '../RemoteStream';
import clsx from 'clsx';
import { userDetails } from '../../../helpers';
import ClassSvg from '../../../components/ux/images/teacher';
import useStyles from './useStyles';

const HostTeacherClassView = ({
	actionBtnName,
	clearRaisingHand,
	clearStream,
	clearScreenStream,
	copied,
	setCopied,
	isLoading,
	isSharingScreen,
	isProjecting,
	joined,
	toggleMic,
	toggleCam,
	guestStreamObj,
	guestTeacherStream,
	joinUrl,
	localStreamObj,
	numHandRaisers,
	readingEventInfo,
	readingEventStartsBy,
	remoteStreamCommons,
	remoteStreams,
	remoteStreamsObj,
	resumePlaying,
	startScreenStream,
	startStream,
	// handRaisers,
	toggleSettingsDialogOpen,
}) => {
	const classes = useStyles();
	const { email, user_type } = userDetails;
	const { TeacherAvatar, SwimmingFish } = ClassSvg;

	const remoteStreamsMapper = (stream, ind) => (
		<RemoteStream key={ind} {...{ ...stream, ...remoteStreamCommons }} stream={remoteStreams[ind]}>
			{(props) => (
				<VideoDisplay
					{...{ ...props, clearRaisingHand, joined }}
					iconSize='small'
					isDisplayingForTeacher
					noControls
				/>
			)}
		</RemoteStream>
	);

	const remoteStreamsMapperSmall = (stream, ind) => (
		<RemoteStream key={ind} {...{ ...stream, ...remoteStreamCommons }} stream={remoteStreams[ind]}>
			{(props) => (
				<Grid item xs={6} sm={4} md={3}>
					<VideoDisplay
						{...{ ...props, clearRaisingHand, joined }}
						iconSize='small'
						isDisplayingForTeacher
					/>
				</Grid>
			)}
		</RemoteStream>
	);

	const localVideoDisplay = (
		<Fragment>
			<Box mb={3}>
				<VideoDisplay
					{...{ resumePlaying, toggleMic, toggleCam, joined, ...localStreamObj }}
					isDisplayingForTeacher
					isTeacher
					isLocal
				/>
			</Box>
		</Fragment>
	);
	// console.log('hand raisers', handRaisers, numHandRaisers);

	return (
		<Grid container className={classes.wrapper}>
			<Grid item xs={12}>
				<div className={classes.classControls}>
					<Box pl={2} pr={2} pt={1}>
						{numHandRaisers > 0 && (
							<Tooltip
								title={`${numHandRaisers} Students Raised Their Hand`}
								aria-label={`${numHandRaisers} Students Raised Their Hand`}
								placement='bottom'
							>
								<Icon className={classes.icon}>pan_tool</Icon>
							</Tooltip>
						)}
						<span className={classes.userDetails}>{numHandRaisers > 0 && numHandRaisers}</span>
					</Box>
					<Box mt={1} mb={1}>
						<Button
							fullWidth
							className={clsx({
								[classes.buttonWithLoadingIcon]: true,
								[classes.buttonEndClass]: joined && !isLoading, //only when open === true
							})}
							color='primary'
							size='large'
							disabled={readingEventStartsBy > 0 || isLoading}
							variant='contained'
							onClick={joined ? clearStream : startStream}
							startIcon={isLoading && <CircularProgress className={classes.circularProgress} />}
						>
							{actionBtnName}
						</Button>
					</Box>
					<Box pl={2} pr={2} className={classes.userDetailsContainer}>
						<Typography variant='h6' className={classes.userDetails}>
							{email} ({user_type})
						</Typography>
					</Box>
					{/* Icon Control Icons */}
					{joined && (
						<Box className={classes.userDetailsContainer}>
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
						</Box>
					)}
					<Box className={classes.userDetailsContainer}>
						<Tooltip title='Settings' aria-label='Settings' placement='bottom'>
							<Button aria-label='settings' onClick={toggleSettingsDialogOpen}>
								<Icon className={classes.icon}>settings</Icon>
							</Button>
						</Tooltip>
					</Box>
				</div>
			</Grid>
			<Grid item xs={12} className={classes.container}>
				{!joined && <SwimmingFish />}

				<Grid container>
					<Grid item xs={12} sm={4} md={3} className={classes.teacher}>
						{/* Host Teacher */}
						{/* local stream: What the Host Teacher sees */}
						{!joined && <TeacherAvatar />}
						{joined && localVideoDisplay}
						{/* remote stream: What Students + HOst Teacher see */}
						{guestStreamObj.id && (
							<RemoteStream
								{...{ ...remoteStreamCommons, ...guestStreamObj }}
								stream={guestTeacherStream}
								isTeacher
							>
								{(props) => <VideoDisplay {...props} isDisplayingForTeacher isTeacher />}
							</RemoteStream>
						)}
					</Grid>
					<Grid item xs={12} sm={8} lg={9} className={classes.item}>
						{readingEventInfo}
						<div id='is-projecting' className={classes.stage}>
							{/* projected screen */}
							<div className={classes.screenOnStage}>
								{!isProjecting &&
									remoteStreamsObj.filter((x) => x.isScreenStream).map(remoteStreamsMapper)}
							</div>
							<div className={classes.studentOnStage}>
								{/* projected student */}
								{isProjecting &&
									remoteStreamsObj.filter((x) => x.isProjecting).map(remoteStreamsMapper)}
							</div>
						</div>
						<div id='video-thumbnails'>
							{/* video thumbnails, screen stream should be first box */}
							{remoteStreamsObj.filter((x) => x.isScreenStream).map(remoteStreamsMapperSmall)}
							{remoteStreamsObj.filter((x) => !x.isScreenStream).map(remoteStreamsMapperSmall)}
						</div>

						{remoteStreams.length === 0 && (
							<Fragment>
								<div className={classes.shareUrlContainer}>
									<Box mt={5}>
										<Typography
											gutterBottom
											variant='h4'
											align='center'
											className={classes.message}
										>
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
			</Grid>
		</Grid>
	);
};

export default HostTeacherClassView;
