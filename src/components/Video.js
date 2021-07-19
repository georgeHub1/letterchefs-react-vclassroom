import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import { Box, Button, Icon, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { Mic, MicOff, Videocam, VideocamOff } from '@material-ui/icons';
import { common, green, red } from '@material-ui/core/colors';
import Color from '../mixins/palette';
import clsx from 'clsx';

const useStyles = makeStyles((/* theme */) => {
	return {
		root: {
			width: '100%',
			border: `2px solid transparent`,
		},
		activeSpeaker: {
			border: `2px solid ${green[500]}`,
		},
		controlsWrapper: {
			position: 'relative',
		},
		controlsContainerSmall: {
			width: '100%',
		},
		controlsBox: {
			width: '100%',
			display: 'flex',
		},
		controlsBoxSmall: {
			width: '100%',
		},
		iconOff: {
			color: red[700],
			'&:hover': {
				color: red[300],
			},
		},
		iconOn: {
			color: green[500],
			'&:hover': {
				color: green[300],
			},
		},
		iconsRight: {
			justifyContent: 'flex-end',
		},
		emojisContainer: {
			display: 'flex',
			flexWrap: 'noWrap',
			background: `rgba(255,255,255,0.1)`,
			margin: 0,
			height: 40,
			lineHeight: 40,
		},
		pauseText: {
			'-webkit-text-fill-color': common.white /* Will override color (regardless of order) */,
			'-webkit-text-stroke-width': 1,
			'-webkit-text-stroke-color': common.black,
		},
		isUnmuted: {
			background: Color.hex.grape,
			border: `2px solid ${Color.hex.grape}`,
		},
		studentControls: {
			position: 'relative',
			display: 'flex',
			flexWrap: 'nowrap',
			justifyContent: 'flex-end',
		},
		staged: {
			width: '100%',
		},
		unstaged: {
			width: '33%',
		},
		studentIcons: {
			position: 'relative',
		},
	};
});

const Video = ({
	clearRaisingHand,
	errMsg,
	hostTeacherID,
	iconSize,
	id,
	isDisplayingForTeacher,
	isLocal,
	isLoading,
	isRaisingHand,
	isProjecting,
	isScreenStream,
	isTeacher,
	isUsingMic,
	isUsingCam,
	handleProjectStudent,
	handleUnProjectStudent,
	msgClient,
	msgChannel,
	noControls,
	remoteSpeaking,
	streamId,
	toggleMic,
	toggleCam,
}) => {
	const hasControls = isLocal || isDisplayingForTeacher;
	const classes = useStyles();
	const _id = id || (isLocal ? 'local-stream' : '');

	const [isActiveSpeaker, setActiveSpeaker] = useState(false);
	if (remoteSpeaking) {
		console.log('remoteSpeaking', remoteSpeaking);
		setActiveSpeaker(true);
	}

	const controlsContainer = iconSize === 'small' ? classes.controlsContainerSmall : '';
	const controlsBox = iconSize === 'small' ? classes.controlsBoxSmall : classes.controlsBox;

	const emojis = ['A', 'B'];
	// const { WavingHandIcon } = ClassSvg;

	const handleRaisingHand = () => {
		if (isDisplayingForTeacher) {
			clearRaisingHand(streamId);
			return;
		}

		if (!msgClient || typeof msgClient.sendMessageToPeer !== 'function') {
			return;
		}

		msgClient
			.sendMessageToPeer({ text: '___raise-hand___' }, hostTeacherID + '')
			.then((sendResult) => {
				if (sendResult.hasPeerReceived) {
					console.log('Raise hand message sent to host');
				} else {
					console.error('Raise hand message was not sent to host');
				}
			});
	};

	return (
		<div className='stream-display'>
			<div
				{...(_id ? { id: _id } : {})}
				className={clsx({
					'video-view': true,
					'video-placeholder': true,
					[`${classes.root}`]: true,
					[`${classes.activeSpeaker}`]: isActiveSpeaker,
				})}
			>
				{errMsg && errMsg.length > 0 && <Alert severity='error'>{errMsg}</Alert>}
				{streamId && !isLoading && (
					<div className={`controls ${controlsContainer} `}>
						<div className={classes.controlsWrapper}>
							<Box className={controlsBox}>
								{isDisplayingForTeacher && isRaisingHand && (
									<Tooltip
										title='Set Question As Addressed'
										aria-label='Set Question As Addressed'
										placement='bottom'
									>
										<Button onClick={handleRaisingHand}>
											<Icon className={clsx(classes.iconsRight, classes.iconOn)}>pan_tool</Icon>
										</Button>
									</Tooltip>
								)}
								{/* (showAudioPlayBtn || showVideoPlayBtn) && (									
									{isDisplayingForTeacher && isProjecting && (
									<Tooltip title='Resume playing' aria-label='Resume playing' placement='bottom'>										<Tooltip title='Unstage Student' aria-label='Unstage Student' placement='bottom'>
										<IconButton onClick={resumePlaying}>											<IconButton onClick={handleProjectStudent('___unproject___')}>
											<Icon className={classes.iconOn}>play_arrow</Icon>												<Icon className={classes.iconOff}>open_in_full</Icon>
										</IconButton>	
									</Tooltip>	
								) */}

								{/*!isTeacher && isLocal && (	
									<Tooltip title='Raise Your Hand' aria-label='Raise Your Hand' placement='bottom'>	
										<IconButton onClick={handleRaisingHand}>	
								<WavingHandIcon className={classes.iconsRight} />*/}

								{!noControls && (isTeacher || !isLocal) && (
									<Tooltip
										title={isUsingMic ? 'Mute' : 'Unmute'}
										aria-label={isUsingMic ? 'Mute' : 'Unmute'}
										placement='bottom'
									>
										<span>
											<IconButton
												color='primary'
												disabled={!hasControls}
												onClick={toggleMic}
												className={classes.left}
											>
												{isUsingMic ? (
													<Mic className={classes.iconOn} fontSize={iconSize || 'small'} />
												) : (
													<MicOff className={classes.iconOff} fontSize={iconSize || 'small'} />
												)}
											</IconButton>
										</span>
									</Tooltip>
								)}
								{!noControls && (
									<Tooltip
										title={isUsingCam ? 'Turn Off' : 'Turn On'}
										aria-label={isUsingCam ? 'Turn Off' : 'Turn On'}
										placement='bottom'
										data-user-type='student'
									>
										<span>
											<IconButton
												color='primary'
												disabled={!hasControls}
												onClick={toggleCam}
												className={classes.right}
											>
												{isUsingCam ? (
													<Videocam className={classes.iconOn} fontSize={iconSize || 'small'} />
												) : (
													<VideocamOff className={classes.iconOff} fontSize={iconSize || 'small'} />
												)}
											</IconButton>
										</span>
									</Tooltip>
								)}
								{!isTeacher && isDisplayingForTeacher && !isProjecting && (
									<Tooltip
										title='Project student to Stage'
										aria-label='Project student to Stage'
										placement='bottom'
									>
										<IconButton onClick={handleProjectStudent}>
											<Icon className={classes.iconOn}>open_in_full</Icon>
										</IconButton>
									</Tooltip>
								)}
								{!isTeacher && isDisplayingForTeacher && isProjecting && (
									<Tooltip title='Unstage Student' aria-label='Unstage Student' placement='bottom'>
										<IconButton onClick={handleUnProjectStudent}>
											<Icon className={classes.iconOff}>open_in_full</Icon>
										</IconButton>
									</Tooltip>
								)}
							</Box>
						</div>
					</div>
				)}

				{isDisplayingForTeacher && !isScreenStream && msgChannel && (
					<Box mb={1} className={classes.emojisContainer}>
						{emojis.map((emo, index) => {
							return (
								<Button
									key={index}
									size='small'
									onClick={() => {
										if (
											!isDisplayingForTeacher ||
											!msgChannel ||
											typeof msgChannel.sendMessage !== 'function'
										) {
											return;
										}
										msgChannel
											.sendMessage({ text: JSON.stringify({ to: streamId, msg: emo }) })
											.then(() => {
												console.log(emo, ' channel message sent');
											})
											.catch((e) => {
												console.error('could not send channel message', emo, e);
											});
									}}
								>
									{emo}
								</Button>
							);
						})}
					</Box>
				)}
			</div>
		</div>
	);
};

Video.displayName = 'Video Display';
Video.defaultProps = {
	toggleMic: () => {},
	toggleCam: () => {},
	resumePlaying: () => {},
};
Video.propTypes = {
	isLocal: PropTypes.bool,
	isLoading: PropTypes.bool,
	noControls: PropTypes.bool,
	showPlayBtn: PropTypes.any,
	isUsingMic: PropTypes.bool,
	isUsingCam: PropTypes.bool,
	resumePlaying: PropTypes.func,
	toggleMic: PropTypes.func,
	toggleCam: PropTypes.func,
	width: PropTypes.number,
	height: PropTypes.number,
};

export default Video;
