import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	// TextField,
	MenuItem,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	// makeStyles,
	Select,
	// Typography,
	FormControl,
	Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// const useStyles = makeStyles((theme) => ({
// 	root: {},
// 	dialogContainer: {
// 		// maxWidth: 600,
// 	},
// }));

const Settings = ({
	open,
	toggleOpen,
	audioDeviceId,
	videoDeviceId,
	setAudioDeviceId,
	setVideoDeviceId,
	okText,
	onOkClick,
}) => {
	// const classes = useStyles();

	const [errMsg, setErrorMessage] = useState('');

	const [audioDevices, setAudioDevices] = useState([]);
	const [videoDevices, setVideoDevices] = useState([]);

	const [audioDevice, setAudioDevice] = useState('');
	const updateAudioDevice = useCallback(
		(e) => {
			const index = e.target.value;
			setAudioDeviceId(index);
			setAudioDevice(index);
		},
		[setAudioDeviceId]
	);

	const [videoDevice, setVideoDevice] = useState('');
	const updateVideoDevice = useCallback(
		(e) => {
			const index = e.target.value;
			setVideoDeviceId(index);
			setVideoDevice(index);
		},
		[setVideoDeviceId]
	);

	useEffect(() => {
		if (!navigator.mediaDevices) {
			return setErrorMessage('Looks like your browser does not support the use of media devices');
		}

		navigator.mediaDevices.enumerateDevices().then((devs) => {
			const mics = devs.filter((x) => x.kind === 'audioinput');
			const cams = devs.filter((x) => x.kind === 'videoinput');
			if (audioDeviceId) {
				const defMicIndex = mics.findIndex((x) => x.deviceId === audioDeviceId);
				if (defMicIndex > -1) setAudioDevice(mics[defMicIndex].deviceId);
			}
			if (videoDeviceId) {
				const defCamIndex = cams.findIndex((x) => x.deviceId === videoDeviceId);
				if (defCamIndex > -1) setVideoDevice(cams[defCamIndex].deviceId);
			}
			setAudioDevices(mics);
			setVideoDevices(cams);
		});
	}, [audioDeviceId, videoDeviceId]);

	return (
		<Dialog fullWidth open={open} onClose={toggleOpen} aria-labelledby='streaming-settings'>
			<DialogTitle id='streaming-settings'>
				<Typography variant='h4'>Enable microphone and camera</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					The teacher will mute and unmute students during class.
				</DialogContentText>
				{errMsg && <Alert severity='error'>{errMsg}</Alert>}
				<DeviceSelector
					label='Audio Device'
					helperText='Select an Audio Device'
					devices={audioDevices}
					value={audioDevice}
					onChange={updateAudioDevice}
				/>
				<DeviceSelector
					label='Video Device'
					helperText='Select a Video Device'
					devices={videoDevices}
					value={videoDevice}
					onChange={updateVideoDevice}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						toggleOpen();
						onOkClick();
					}}
					color='primary'
					variant='contained'
					size='large'
					aria-label='Continue'
				>
					{okText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

var DeviceSelector = ({ devices, ...props }) => (
	<FormControl fullWidth>
		<Select select {...props}>
			{[...devices].map(({ deviceId, label }) => (
				<MenuItem key={deviceId} value={deviceId}>
					{label}
				</MenuItem>
			))}
		</Select>
	</FormControl>
);

Settings.defaultProps = { okText: 'Enable Devices', onOkClick: () => {} };

Settings.propTypes = {
	open: PropTypes.bool.isRequired,
	toggleOpen: PropTypes.func.isRequired,
	setAudioDeviceId: PropTypes.func.isRequired,
	setVideoDeviceId: PropTypes.func.isRequired,
	onOkClick: PropTypes.func,
};

export default Settings;
