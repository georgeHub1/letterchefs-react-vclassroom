import React, { Fragment, useState, useCallback } from 'react';
import { useParams /*Link as RouterLink*/ } from 'react-router-dom';
import {
	Button,
	Box,
	CircularProgress,
	Container,
	Grid,
	Icon,
	makeStyles,
	Tooltip,
	Typography,
} from '@material-ui/core';
import AgoraRTC from 'agora-rtc-sdk';
import { common, green, red, grey } from '@material-ui/core/colors';
import Skeleton from '@material-ui/lab/Skeleton';

import Color from '../../mixins/palette';
import Logo from '../../components/Logo';
import LinkButton from '../../components/LinkButton';
import CopyText from './CopyText';
import Settings from './Settings';

import useCopyText from './useCopyText';
import useSettingsDialog from './useSettingsDialog';
import useDevicesId from './useDevicesId';

import { userDetails } from '../../helpers';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		display: 'flex',
		justifyContent: 'center',
	},
	wrapper: {
		backgroundColor: Color.hex.grape,
		justifyContent: 'center',
		minHeight: '100vh',
	},
	videoDetails: {
		width: 'inherit',
		position: 'relative',
	},
	container: {
		backgroundColor: common.white,
	},
	divider: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	userPrepDetails: {
		marginTop: theme.spacing(16),
	},
	buttonContainer: {
		bottom: 0,
		height: 60,
		position: 'absolute',
		width: '100%',
	},
	buttonStateContainer: {
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		margin: theme.spacing(5),
	},
	classContainer: {
		position: 'relative',
	},
	copyContainer: {
		color: grey[900],
	},
	copyIndicator: {
		position: 'absolute',
		top: 0,
	},
	iconOn: {
		color: green[500],
		fontSize: '4rem',
	},
	iconOff: {
		color: red[500],
		fontSize: '4rem',
	},
	micPosition: {
		left: 0,
		position: 'absolute',
		width: 60,
	},
	videocamPosition: {
		right: 0,
		position: 'absolute',
		width: 60,
	},
}));

const userType = userDetails.user_type;

const PrepareToEnterClassView = () => {
	const classes = useStyles();
	const { class_id } = useParams();

	const [isMicOn, setIsMicOn] = useState(false);
	const [isCamOn, setIsCamOn] = useState(false);

	const [settingsDialog, toggleSettingsDialog] = useSettingsDialog();
	const {
		mic: [microphoneId, updateMicId],
		cam: [cameraId, updateCamId],
	} = useDevicesId();

	const devicesSelected = microphoneId && cameraId;

	const [stream, setStream] = useState(null);
	const handleTestDevices = useCallback(() => {
		const streamID = Math.floor(Math.random() * 10000);
		const stream = AgoraRTC.createStream({
			streamID,
			audio: true,
			microphoneId,
			video: true,
			cameraId,
		});
		stream.init(() => {
			stream.play('devices-test', { fit: 'contain' }, () => {
				setIsCamOn(true);
				setIsMicOn(stream.getAudioLevel() > 0);
			});
			const timer = setTimeout(() => {
				setIsMicOn(stream.getAudioLevel() > 0);
				clearInterval(timer);
			}, 500);
		});
		setStream(stream);
	}, [microphoneId, cameraId]);
	const handleStopStream = useCallback(() => {
		stream.stop();
		stream.close();
		setStream(null);
	}, [stream]);

	const meetingUrlPath = `/class/${class_id}/in`;
	const meetingUrl = `${window.location.origin}${meetingUrlPath}`;
	const [copied, setCopied] = useCopyText();

	// useEffect(() => {
	// 	const fontUrl = 'https://use.fontawesome.com/releases/v5.12.0/css/all.css';

	// 	const node = loadCSS(fontUrl,
	// 		document.querySelector('#font-awesome-css'),
	// 	);

	// 	return () => {
	// 		node.parentNode.removeChild(node);
	// 	};
	// }, []);

	const canJoinClass = isCamOn && (isMicOn || userType !== 'teacher');

	return (
		<Fragment>
			<Settings
				open={settingsDialog}
				toggleOpen={toggleSettingsDialog}
				audioDeviceId={microphoneId}
				videoDeviceId={cameraId}
				setAudioDeviceId={updateMicId}
				setVideoDeviceId={updateCamId}
				okText='Enable Devices'
				onOkClick={handleTestDevices}
			/>
			<Grid container className={classes.wrapper}>
				<Grid item xs={12} sm={9} className={classes.container}>
					<Container>
						<Logo />
						<Grid container className={classes.userPrepDetails}>
							<Grid item xs={12} sm={6}>
								<div className={classes.videoDetails}>
									{/* loading
											? <Skeleton><Avatar /></Skeleton>
											: <Avatar src={data.avatar} /> */}
									<Box>
										<div id='devices-test'>
											{!isCamOn && <Skeleton variant='rect' width='100%' height={400} />}
										</div>
									</Box>
								</div>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Container>
									<Typography gutterBottom variant='h3'>
										Ready to Start Class?
									</Typography>
									{canJoinClass && (
										<div className={classes.buttonStateContainer}>
											<div className='mic'>
												<Tooltip
													title={isMicOn ? 'Enabled' : 'Off'}
													aria-label={isMicOn ? 'Mic Enabled' : 'Mic is Off'}
												>
													<Icon className={classes[isMicOn ? 'iconOn' : 'iconOff']}>
														{isMicOn ? 'mic' : 'mic_off'}
													</Icon>
												</Tooltip>
											</div>
											<div className='videocam'>
												<Tooltip
													title={isCamOn ? 'Enabled' : 'Off'}
													aria-label={isCamOn ? 'Videocam Enabled' : 'Videocam is Off'}
												>
													<Icon className={classes[isCamOn ? 'iconOn' : 'iconOff']}>
														{isCamOn ? 'videocam' : 'videocam_off'}
													</Icon>
												</Tooltip>
											</div>
										</div>
									)}

									{!canJoinClass && (
										<Box>
											<Typography gutterBottom variant='body1'>
												Your microphone and webcam are off. Enable devices before you enter class.
											</Typography>
											<Typography align='center' gutterBottom>
												<Button
													className={classes.divider}
													aria-label='Enable Devices'
													color='primary'
													size='large'
													variant='contained'
													disabled={devicesSelected}
													onClick={devicesSelected ? handleTestDevices : toggleSettingsDialog}
													startIcon={devicesSelected && <CircularProgress />}
												>
													Enable Devices
												</Button>
											</Typography>
										</Box>
									)}
									{meetingUrl && meetingUrl.length > 0 ? (
										<Typography gutterBottom variant='body1'>
											Invite attendees to meeting URL below.
										</Typography>
									) : (
										<Typography gutterBottom variant='body1'>
											A meeting URL is required to enter class.
										</Typography>
									)}
									<Box mt={2} mb={2} className={classes.classContainer}>
										<CopyText
											fullWidth
											label='Meeting URL'
											variant='outlined'
											value={meetingUrl}
											// copiedClassName={classes.copyIndicator}
											{...{ copied, setCopied }}
											className={classes.copyContainer}
										/>
									</Box>
									<Box>
										{canJoinClass && (
											<LinkButton
												color='primary'
												variant='contained'
												size='large'
												onClick={handleStopStream}
												href={meetingUrlPath}
											>
												{userType === 'teacher' ? 'Start Class' : 'Enter Class'}
											</LinkButton>
										)}
									</Box>
								</Container>
							</Grid>
						</Grid>
					</Container>
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default PrepareToEnterClassView;
