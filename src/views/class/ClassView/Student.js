import React, { Fragment, useState } from 'react';
import {
	Box,
	Button,
	Grid,
	Icon,
	IconButton,
	Tooltip,
	Typography,
	CircularProgress,
} from '@material-ui/core';
// import { teal } from '@material-ui/core/colors';

import VideoDisplay from '../../../components/Video';
import RemoteStream from '../RemoteStream';
import clsx from 'clsx';

import { userDetails } from '../../../helpers';
import ClassSvg from '../../../components/ux/images/teacher';
import useStyles from './useStyles';

const StudentClassView = ({
	actionBtnName,
	clearStream,
	isLoading,
	joined,
	localStreamObj,
	guestStreamObj,
	guestTeacherStream,
	hostTeacherID,
	hostStreamObj,
	hostTeacherStream,
	readingEventInfo,
	readingEventStartsBy,
	resumePlaying,
	remoteStreamCommons,
	remoteStreamsObj,
	remoteStreams,
	startStream,
	toggleMic,
	toggleCam,
	toggleSettingsDialogOpen,
}) => {
	const { email, user_type } = userDetails;
	const classes = useStyles();

	const localVideoDisplay = (
		<Grid item xs={6} sm={4} md={3}>
			<VideoDisplay
				{...{
					...localStreamObj,
					...remoteStreamCommons,
					hostTeacherID,
					resumePlaying,
					toggleMic,
					toggleCam,
					joined,
				}}
				isLocal
			/>
		</Grid>
	);

	const remoteStreamsMapper = (stream, ind) => (
		<RemoteStream key={ind} {...{ ...stream, ...remoteStreamCommons }} stream={remoteStreams[ind]}>
			{(props) => <VideoDisplay {...{ ...props, joined }} iconSize='small' noControls />}
		</RemoteStream>
	);

	const remoteStreamsMapperSmall = (stream, ind) => (
		<RemoteStream key={ind} {...{ ...stream, ...remoteStreamCommons }} stream={remoteStreams[ind]}>
			{(props) => (
				<Grid item xs={6} sm={4} md={3}>
					<VideoDisplay {...{ ...props, joined }} iconSize='small' isDisplayingForTeacher />
				</Grid>
			)}
		</RemoteStream>
	);

	const { TeacherAvatar, SwimmingFish, WavingHandIcon } = ClassSvg;

	const { isRaisedHand, setRaisedHand } = useState(false);

	const handleRaisingHand = (e) => {
		e.preventDefault();
		console.log('handleRaisingHand');
		if (isRaisedHand) {
			return;
		}
		setRaisedHand(true);
		const { msgClient } = remoteStreamCommons;
		if (!msgClient || typeof msgClient.sendMessageToPeer !== 'function') {
			return;
		}

		msgClient
			.sendMessageToPeer({ text: '___raise-hand___' }, hostTeacherID + '')
			.then((sendResult) => {
				if (sendResult.hasPeerReceived) {
					console.log('Raise hand message sent to host');
					setRaisedHand(false);
				} else {
					console.error('Raise hand message was not sent to host');
				}
			});
	};

	return (
		<Fragment>
			<div className={classes.wrapper}>
				{joined && hostStreamObj.id && (
					<Tooltip title='Raise Your Hand' aria-label='Raise Your Hand' placement='top'>
						<IconButton
							aria-label='Raise Your Hand'
							onClick={handleRaisingHand}
							className={classes.fab}
						>
							<WavingHandIcon className={classes.iconsRight} />
						</IconButton>
					</Tooltip>
				)}
				<Grid container>
					<Grid item xs={12}>
						<div className={classes.classControls}>
							<Box mt={1} mb={1}>
								<Button
									fullWidth
									className={clsx({
										[classes.buttonWithLoadingIcon]: true,
										[classes.buttonEndClass]: joined && !isLoading, //only when open === true
									})}
									color='primary'
									disabled={readingEventStartsBy > 0 || isLoading}
									variant='contained'
									size='large'
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

							<Tooltip title='Settings' aria-label='Settings' placement='bottom'>
								<Button aria-label='settings' onClick={toggleSettingsDialogOpen}>
									<Icon className={classes.icon}>settings</Icon>
								</Button>
							</Tooltip>
						</div>
					</Grid>
					<Grid item xs={12} sm={4} md={3} className={classes.container}>
						{!hostStreamObj.id && <SwimmingFish />}
						<Grid container>
							<Grid item xs={12} className={classes.teacher}>
								{!hostStreamObj.id && <TeacherAvatar />}
								{hostStreamObj.id && (
									<Box>
										<RemoteStream
											{...{ ...remoteStreamCommons, ...hostStreamObj }}
											stream={hostTeacherStream}
										>
											{(props) => <VideoDisplay {...props} isTeacher />}
										</RemoteStream>
									</Box>
								)}
								{guestStreamObj.id && (
									<Box mt={3}>
										<RemoteStream
											{...{ ...remoteStreamCommons, ...guestStreamObj }}
											stream={guestTeacherStream}
										>
											{(props) => <VideoDisplay {...props} isTeacher />}
										</RemoteStream>
									</Box>
								)}
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={8} md={9} className={classes.item}>
						{readingEventInfo}
						<div className='is-projecting'>
							{remoteStreamsObj.filter((x) => x.isProjecting).map(remoteStreamsMapper)}
						</div>
						<div className='thumbnails'>
							{joined && localVideoDisplay}
							{remoteStreamsObj
								.filter((x) => x.id !== localStreamObj.id)
								.map(remoteStreamsMapperSmall)}
						</div>
					</Grid>
				</Grid>
			</div>
		</Fragment>
	);
};

export default StudentClassView;
