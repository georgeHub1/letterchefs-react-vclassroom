import React, { Fragment, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
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
import { common, grey, indigo, pink } from '@material-ui/core/colors';
import AgoraRTC from 'agora-rtc-sdk';
import AgoraRTM from 'agora-rtm-sdk';

import Page from '../../components/Page';
import VideoDisplay from '../../components/Video';
import CopyText from './CopyText';
import RemoteStream from './RemoteStream';
import Settings from './Settings';
import clsx from 'clsx';
import './video.css';

import {
	userID as uid,
	userDetails,
	// isChrome,
	isFirefox,
	// isSafari,
	Http,
	tryAgainMsg,
} from '../../helpers';
import useCopyText from './useCopyText';
import useSettingsDialog from './useSettingsDialog';
import useDevicesId from './useDevicesId';
import LinkButton from '../../components/LinkButton';
import Color from '../../mixins/palette';

const shouldUseMic = true;
const shouldUseCam = true;

const useStyles = makeStyles((theme) => {
	// const { indigo } = colors;

	return {
		root: {
			display: 'flex',
			backgroundImage: `url('/static/images/background/bubble.svg')`,
			backgroundColor: indigo[700],
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
			// backgroundColor: indigo[700],
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
	};
});

const ClassView = () => {
	const pageTitle = 'LetterChefs | Livestream Book Reading';
	const appID = 'd5dea6c37c864df28cc08b6eb94abb48';
	const token = null;
	const { user_type } = userDetails;

	let { class_id } = useParams();

	const [users, setUsers] = useState({});

	const [hostTeacherID, setHostTeacherID] = useState(0);
	const [guestTeacherIDs, setGuestTeacherIDs] = useState([]);
	const isGuestTeacher = guestTeacherIDs.includes(uid);

	const channel = `${hostTeacherID}-${class_id}`;

	const isHostTeacher = uid === hostTeacherID;
	const isStudent = !isGuestTeacher && user_type === 'student';

	const classes = useStyles();

	const [settingsDialogOpen, toggleSettingsDialogOpen] = useSettingsDialog();
	const {
		mic: [audioDeviceId, updateAudioDeviceId],
		cam: [videoDeviceId, updateVideoDeviceId],
	} = useDevicesId();

	const joinUrl = `${window.location.origin}/class/${class_id}/in`;
	const [copied, setCopied] = useCopyText();

	// rtc resources
	const client = useRef(null);
	const screenClient = useRef(null);
	const messageClient = useRef(null);
	const messageChannel = useRef(null);

	const [joined, setJoined] = useState(false);
	// const [joinedMsgChannel, setJoinedMsgChannel] = useState(false);
	const [shareScreenClient, setShareScreenClient] = useState(false);

	const localStream = useRef(null);
	const screenStream = useRef(null);
	const hostTeacherStream = useRef(null);
	const guestTeacherStream = useRef(null);
	const remoteStreams = useRef([]);

	const [localStreamObj, setLocalStreamObj] = useState(() => ({
		isLoading: false,
		showAudioPlayBtn: false,
		showVideoPlayBtn: false,
		isUsingMic: shouldUseMic,
		isUsingCam: shouldUseCam,
	}));
	const [screenStreamObj, setScreenStreamObj] = useState({});
	const [hostStreamObj, setHostStreamObj] = useState({});
	const [guestStreamObj, setGuestStreamObj] = useState({});
	const [remoteStreamsObj, setRemoteStreamsObj] = useState([]);
	const updateARemoteStream = useCallback(
		(id, key, value) => {
			id *= 1;
			const upd = (x) => ({ [key]: value === '!' ? !x.value : value });
			if (id === localStreamObj.streamId) {
				setLocalStreamObj((x) => ({ ...x, ...upd(x) }));
			} else if (id === screenStreamObj.streamId) {
				setScreenStreamObj((x) => ({ ...x, ...upd(x) }));
			} else if (id === hostTeacherID) {
				setHostStreamObj((x) => ({ ...x, ...upd(x) }));
			} else if (guestTeacherIDs.includes(id)) {
				setGuestStreamObj((x) => ({ ...x, ...upd(x) }));
			} else {
				setRemoteStreamsObj((x) => {
					const newRemotes = [...x];
					const index = newRemotes.findIndex((x) => x.streamId === id);
					if (index > -1) newRemotes[index][key] = value;
					return newRemotes;
				});
			}
		},
		[localStreamObj.streamId, screenStreamObj.streamId, hostTeacherID, guestTeacherIDs]
	);
	const navigate = useNavigate();
	const [loadingClass, setLoadingClass] = useState(true);
	const [loadingClassErr, setLoadingClassErr] = useState('');
	const [classInfo, setClassInfo] = useState(null);
	useEffect(() => {
		const rq = Http().secureRequest({
			url: `/classes/${class_id}`,
			successCallback: ({ status, data, error }) => {
				if (status !== true) return setLoadingClassErr(error || 'Error reading class info');
				setClassInfo(data);
				setHostTeacherID(data.created_by * 1);
				setGuestTeacherIDs((data.teachers || '').split(/,+\s+/));
			},
			noContent: () => navigate('error'),
			errorCallback: () => setLoadingClassErr('Unable to read class info. ' + tryAgainMsg()),
		});

		rq.finally(() => setLoadingClass(false));
	}, [class_id, hostTeacherID, navigate]);

	const toggleMic = useCallback(() => {
		if (!localStream.current) {
			return;
		}
		let set = localStream.current[localStreamObj.isUsingMic ? 'muteAudio' : 'unmuteAudio']();

		if (set) {
			setLocalStreamObj((x) => ({ ...x, isUsingMic: !x.isUsingMic }));
		} else {
			set = localStream.current[localStreamObj.isUsingMic ? 'unmuteAudio' : 'muteAudio']();
		}
	}, [localStreamObj.isUsingMic]);

	const toggleCam = useCallback(() => {
		if (!localStream.current) return;
		let set = localStream.current[localStreamObj.isUsingCam ? 'muteVideo' : 'unmuteVideo']();

		if (set) {
			setLocalStreamObj((x) => ({ ...x, isUsingCam: !x.isUsingCam }));
		} else {
			set = localStream.current[localStreamObj.isUsingCam ? 'unmuteVideo' : 'muteVideo']();
		}
	}, [localStreamObj.isUsingCam]);

	const stopRemoteStream = useCallback(
		(id) => {
			if (id === localStreamObj.streamId) {
				if (localStream.current) {
					localStream.current.stop();
				}
				if (localStream.current) {
					localStream.current.close();
				}
				setLocalStreamObj({});
				localStream.current = null;
				return;
			}
			if (id === hostStreamObj.streamId) {
				if (hostTeacherStream.current) {
					hostTeacherStream.current.stop();
				}
				if (hostTeacherStream.current) {
					hostTeacherStream.current.close();
				}
				setHostStreamObj({});
				hostTeacherStream.current = null;
				return;
			}
			if (id === guestStreamObj.streamId) {
				if (hostTeacherStream.current) {
					guestTeacherStream.current.stop();
				}
				if (hostTeacherStream.current) {
					guestTeacherStream.current.close();
				}
				setGuestStreamObj({});
				guestTeacherStream.current = null;
				return;
			}
			setRemoteStreamsObj((x) => {
				const newRemotes = [...x];
				const index = newRemotes.findIndex((x) => x.streamId === id);
				if (index > -1) {
					if (remoteStreams.current[index]) {
						remoteStreams.current[index].stop();
					}
					if (remoteStreams.current[index]) {
						remoteStreams.current[index].close();
					}
					newRemotes.splice(index, 1);
				}
				return [...newRemotes];
			});
		},
		[localStreamObj.streamId, hostStreamObj.streamId, guestStreamObj.streamId]
	);

	const clearScreenStream = useCallback(() => {
		console.log('clearScreenStream========');

		if (screenStream.current) {
			screenStream.current.stop();
			screenStream.current.close();
			screenStream.current = null;
			setScreenStreamObj({});
		}
		if (screenClient.current)
			screenClient.current.leave(
				() => {
					screenClient.current = null;
					console.log('stopped sharing screen success');
					setShareScreenClient(false);
				},
				(err) => {
					console.log('stop sharing screen failed', err);
				}
			);
	}, []);

	const clearStream = useCallback(() => {
		clearScreenStream();

		if (messageChannel.current) {
			messageChannel.current.leave();
			messageChannel.current = null;
		}
		if (messageClient.current) {
			messageClient.current.logout();
			messageClient.current = null;
		}

		if (client.current)
			client.current.leave(
				() => {
					stopRemoteStream(localStreamObj.streamId);
					if (hostTeacherStream.current) {
						stopRemoteStream(hostStreamObj.streamId);
					}
					if (guestTeacherStream.current) {
						stopRemoteStream(guestStreamObj.streamId);
					}
					for (const { streamId } of remoteStreamsObj) {
						stopRemoteStream(streamId);
					}
					setJoined(false);
					client.current = null;
					console.log('client leaves classroom success');
				},
				(err) => {
					console.log('classroom leave failed', err);
				}
			);
	}, [
		clearScreenStream,
		stopRemoteStream,
		localStreamObj.streamId,
		hostStreamObj.streamId,
		guestStreamObj.streamId,
		remoteStreamsObj,
	]);

	const agoraClientObj = useMemo(
		() => ({
			mode: 'live',
			codec: 'h264',
			areaCode: [AgoraRTC.AREAS.GLOBAL],
		}),
		[]
	);

	// const startScreenStream = useCallback(() => {
	const startScreenStream = (e) => {
		e.preventDefault();
		screenClient.current = AgoraRTC.createClient(agoraClientObj);

		screenClient.current.init(appID, () => {
			screenClient.current.join(
				token,
				channel,
				uid,
				(screenUid) => {
					// Create the screen-sharing stream, screenStream.
					setScreenStreamObj((x) => ({
						...x,
						streamId: screenUid,
					}));

					let screenStreamObj = {
						streamID: screenUid,
						audio: false,
						video: false,
						screen: true,
						screenAudio: true,
					};

					if (audioDeviceId) screenStreamObj.microphoneId = audioDeviceId;
					if (videoDeviceId) screenStreamObj.cameraId = videoDeviceId;
					if (isFirefox) screenStreamObj.mediaSource = 'screen';

					screenStream.current = AgoraRTC.createStream(screenStreamObj);
					screenStream.current.setScreenProfile('480p_1');
					screenStream.current.init(
						() => {
							screenStream.current.play('screen-share', { fit: 'contain' }, () => {
								console.log('sharing screen');
								setShareScreenClient(true);
							});
							screenClient.current.publish(screenStream.current, (err) => {
								console.error('publish failed', err);
								//clearScreenStream();
							});
						},
						(err) => {
							screenStream.current = null;
							setScreenStreamObj({});
							console.error('could not init stream', err);
						}
					);
				},
				(err) => {
					screenClient.current = null;
					console.error('Could not join channel', err);
				}
			);
		});
	};
	// }, [classroom, audioDeviceId, videoDeviceId, agoraClientObj, clearScreenStream]);

	const resumePlaying = () => {
		if (!localStream.current) return;
		console.error('clicked!');
		const res = localStream.current.resume();
		console.error('res', res);
		res
			.then(() => console.log(`Stream is resumed successfully`))
			.catch((e) => console.error(`Failed to resume stream. Error ${e.name} Reason ${e.message}`));
	};

	useEffect(() => {
		if (!document.addEventListener) return;

		let hidden, visibilityChange;
		if (typeof document.hidden !== 'undefined') {
			hidden = 'hidden';
			visibilityChange = 'visibilitychange';
		} else if (typeof document.msHidden !== 'undefined') {
			hidden = 'msHidden';
			visibilityChange = 'msvisibilitychange';
		} else if (typeof document.webkitHidden !== 'undefined') {
			hidden = 'webkitHidden';
			visibilityChange = 'webkitvisibilitychange';
		}

		if (!hidden || !visibilityChange) return;

		const handleVisibilityChange = () => {
			if (!document[hidden] && localStream.current && !localStream.current.isPlaying())
				resumePlaying();
		};

		document.addEventListener(visibilityChange, handleVisibilityChange, false);

		// clean up
		return () => {
			document.removeEventListener(visibilityChange, handleVisibilityChange, false);
		};
	});

	const muteMicEvt = useCallback(
		(id, val) => updateARemoteStream(id, 'isUsingMic', typeof val === 'boolean' ? val : '!'),
		[updateARemoteStream]
	);
	const muteCamEvt = useCallback(
		(id, val) => updateARemoteStream(id, 'isUsingCam', typeof val === 'boolean' ? val : '!'),
		[updateARemoteStream]
	);

	const playStatChangeEvt = useCallback((e, setterFunc) => {
		let obj = {};
		const showPlayBtnKey = e.mediaType === 'audio' ? 'showAudioPlayBtn' : 'showVideoPlayBtn';
		if (!e.isErrorState || e.status === 'play') {
			obj = { [showPlayBtnKey]: false, isLoading: false };
		} else if (e.status === 'paused' || e.reason === 'suspend') {
			obj = { [showPlayBtnKey]: true, isLoading: false };
		} else if (e.reason === 'stalled') {
			obj = { isLoading: true, [showPlayBtnKey]: false };
		}
		if (setterFunc) setterFunc((x) => ({ ...x, ...obj }));
		else return obj;
	}, []);

	const startStream = useCallback(() => {
		const setIsLoading = (s) => setLocalStreamObj((x) => ({ ...x, isLoading: s }));
		setIsLoading(true);

		// Initialize the client
		client.current = AgoraRTC.createClient(agoraClientObj);
		client.current.init(
			appID,
			() => {
				client.current.join(
					token,
					channel,
					uid,
					async (uid) => {
						const clearStreamTimer = setTimeout(() => {
							clearStream();
							clearTimeout(clearStreamTimer);
						}, 75 * 60 * 1000);
						setJoined(true);
						console.log('join channel: ', channel, 'success, uid: ', uid);
						setLocalStreamObj((x) => ({ ...x, streamId: uid }));

						client.current.enableDualStream(
							() => console.log('using dual stream'),
							(err) => console.error('not using dual stream', err)
						);
						client.current.enableAudioVolumeIndicator();
						client.current.setClientRole(isHostTeacher ? 'host' : 'audience');

						let audioSource;
						let videoSource;

						if (audioDeviceId || videoDeviceId) {
							let constraints = {
								audio: false,
							};
							//constraints.audio = audioDeviceId ? { deviceId: audioDeviceId } : true;
							constraints.video = videoDeviceId ? { deviceId: videoDeviceId } : true;
							navigator.mediaDevices
								.getUserMedia(constraints)
								.then((mediaStream) => {
									audioSource = mediaStream.getAudioTracks()[0];
									if (window.webkitURL) {
										videoSource = window.webkitURL.createObjectURL(mediaStream.getVideoTracks()[0]);
									} else {
										videoSource = mediaStream.getVideoTracks()[0];
									}
								})
								.catch((e) => console.error('Error using specific media devices', e));
						}

						localStream.current = AgoraRTC.createStream({
							streamID: uid,
							audio: shouldUseMic,
							video: shouldUseCam,
							screen: false,
							audioSource,
							videoSource,
						});

						localStream.current.init(
							() => {
								console.log('init local stream success');
								localStream.current.play('local-stream', { fit: 'contain' }, () => {
									setIsLoading(false);
									if (isStudent) {
										localStream.current.muteAudio();
									}
									/* else
										localStream.current.getStats((stats) => {
											const width = stats.videoSendResolutionWidth * 1;
											const height = stats.videoSendResolutionHeight * 1;
											setLocalStreamObj((x) => ({ ...x, width, height }));
										}); */

									client.current.publish(localStream.current, (err) => {
										console.error('publish failed', err);
										clearStream();
									});
								});

								localStream.current.on('player-status-change', (e) => {
									playStatChangeEvt(e, setLocalStreamObj);
								});
							},
							(err) => {
								setIsLoading(false);
								localStream.current = null;
								setLocalStreamObj({});
								console.error('init local stream failed', err);
							}
						);
					},
					(err) => {
						setIsLoading(false);
						console.error('client join failed', err);
					}
				);
			},
			(err) => {
				setIsLoading(false);
				client.current = null;
				console.error('Could not init video client', err);
			}
		);

		const streamAddedEvt = (evt) => {
			var remoteStream = evt.stream;
			var id = remoteStream.getId();
			if (id !== localStreamObj.streamId && id !== screenStreamObj.streamId) {
				Http().secureRequest({
					url: `/users/${id}`,
					successCallback: ({ status, data, error }) => {
						if (status !== true) return setLoadingClassErr(error || 'Error reading user info');
						setUsers((x) => ({ ...x, [id]: { email: data.email, username: data.email } }));
						client.current.subscribe(remoteStream, (err) => {
							console.log('stream subscribe failed', err);
						});
					},
					errorCallback: () => setLoadingClassErr('Unable to read user info. ' + tryAgainMsg()),
				});
			}
			console.log('stream-added remote-uid: ', id);
		};
		const streamSubscribedEvt = (evt) => {
			const remoteStream = evt.stream;
			const id = remoteStream.getId();
			let streamObj = {
				id: 'remote_video_' + id,
				streamId: id,
			};
			if (id === hostTeacherID) {
				hostTeacherStream.current = remoteStream;
				setHostStreamObj(streamObj);
			} else if (guestTeacherIDs.includes(id)) {
				guestTeacherStream.current = remoteStream;
				setGuestStreamObj(streamObj);
			} else {
				remoteStreams.current.push(remoteStream);
				setRemoteStreamsObj((x) => [...x, streamObj]);
			}
			console.log('stream-subscribed remote-uid: ', id);
		};
		const streamRemovedEvt = (evt) => {
			var remoteStream = evt.stream;
			var id = remoteStream.getId();
			stopRemoteStream(id);
			console.log('stream-removed remote-uid: ', id);
		};

		const peerOnlineEvt = (evt) => updateARemoteStream(evt.uid, 'errMsg', '');
		const peerLeaveEvt = (evt) => {
			let errMsg;
			switch (evt.reason) {
				case 'Quit':
					errMsg = '';
					stopRemoteStream(evt.stream.getId());
					break;
				case 'ServerTimeOut':
					errMsg = 'Poor Connection';
					break;
				case 'BecomeAudience':
					errMsg = 'User is now an audience';
					break;
				default:
					errMsg = `User is having an unknown issue`;
			}
			updateARemoteStream(evt.uid, 'errMsg', errMsg);
		};

		const clientBannedEvt = (evt) => {
			setLocalStreamObj((x) => {
				return { ...x, errMsg: `You are banned ${evt.attr}` };
			});
		};
		const volumeIndicatorEvt = (evt) => {
			evt.attr.forEach((vol) => {
				updateARemoteStream(vol.uid, 'remoteSpeaking', vol.level > 2);
			});
		};

		const msgClient = AgoraRTM.createInstance(appID);
		msgClient.on('ConnectionStateChange', (newState, reason) => {
			console.log('on connection state changed to ' + newState + ' reason: ' + reason);
		});
		msgClient.on('MessageFromPeer', ({ text }, peerId) => {
			console.log(`message ${text} received from`, peerId);
			if (text === 'toggle-mic') toggleMic();
			if (text === 'toggle-cam') toggleCam();
		});

		msgClient
			.login({ uid: uid + '' })
			.then(() => {
				// console.error('AgoraRTM client login success');
				messageClient.current = msgClient;

				const msgChannel = msgClient.createChannel(channel);
				msgChannel.on('ChannelMessage', ({ text }, senderId) => {
					let to = '';
					let msg = '';
					try {
						const parse = JSON.parse(text);
						msg = parse.msg || '';
						to = parse.to || '';
					} catch (e) {
						console.error('could not parse channel text');
					}
					console.log(`channel message ${text} received from`, senderId);
					console.log('to', to);
					console.log('msg', msg);
					if (text === 'toggle-mic') toggleMic();
					if (text === 'toggle-cam') toggleCam();
				});
				msgChannel
					.join()
					.then(() => {
						messageChannel.current = msgChannel;
						// setJoinedMsgChannel(true);
					})
					.catch((err) => {
						msgChannel.leave();
						messageChannel.current = null;
						// setJoinedMsgChannel(false);
						console.error('Could not join channel', err);
					});
			})
			.catch((err) => {
				console.error('AgoraRTM client login failure', err);
				msgClient.logout();
			});

		const muteAudioEvt = (evt) => muteMicEvt(evt.uid, true);
		const unmuteAudioEvt = (evt) => muteMicEvt(evt.uid, false);
		const muteVideoEvt = (evt) => muteCamEvt(evt.uid, true);
		const unmuteVideoEvt = (evt) => muteCamEvt(evt.uid, false);

		client.current.on('stream-added', streamAddedEvt);
		client.current.on('stream-subscribed', streamSubscribedEvt);
		client.current.on('stream-removed', streamRemovedEvt);

		client.current.on('peer-online', peerOnlineEvt);
		client.current.on('peer-leave', peerLeaveEvt);

		client.current.on('mute-audio', muteAudioEvt);
		client.current.on('unmute-audio', unmuteAudioEvt);
		client.current.on('mute-video', muteVideoEvt);
		client.current.on('unmute-video', unmuteVideoEvt);

		client.current.on('client-banned', clientBannedEvt);
		client.current.on('volume-indicator', volumeIndicatorEvt);
	}, [
		isStudent,
		agoraClientObj,
		isHostTeacher,
		hostTeacherID,
		guestTeacherIDs,
		localStreamObj.streamId,
		screenStreamObj.streamId,
		channel,
		audioDeviceId,
		videoDeviceId,
		muteMicEvt,
		muteCamEvt,
		playStatChangeEvt,
		remoteStreams,
		stopRemoteStream,
		updateARemoteStream,
		clearStream,
		toggleCam,
		toggleMic,
	]);

	useEffect(() => {
		if (!hostTeacherStream.current) return;
		hostTeacherStream.current.play(hostStreamObj.id, { fit: 'contain' }, () => {
			console.log('streaming host remote');
		});
		hostTeacherStream.current.on('player-status-change', (e) =>
			playStatChangeEvt(e, setHostStreamObj)
		);
	}, [hostStreamObj.id, playStatChangeEvt]);

	useEffect(() => {
		if (!guestTeacherStream.current) return;
		guestTeacherStream.current.play(guestStreamObj.id, { fit: 'contain' }, () => {
			console.log('streaming host remote');
		});
		guestTeacherStream.current.on('player-status-change', (e) =>
			playStatChangeEvt(e, setGuestStreamObj)
		);
	}, [guestStreamObj.id, playStatChangeEvt]);

	useEffect(() => {
		for (const ind in remoteStreamsObj) {
			const { id, streamId, playedOnce, evtSet } = remoteStreamsObj[ind];
			const stream = remoteStreams.current[ind];
			if (!stream.isPlaying()) {
				if (!playedOnce)
					stream.play(id, { fit: 'contain' }, () =>
						updateARemoteStream(streamId, 'playedOnce', true)
					);
				else stream.resume();
			}
			if (evtSet) continue;
			stream.on('player-status-change', (e) => {
				const ret = playStatChangeEvt(e);
				for (const key in ret) {
					updateARemoteStream(streamId, key, ret[key]);
				}
				updateARemoteStream(streamId, 'evtSet', true);
			});
		}
	}, [remoteStreamsObj, muteMicEvt, playStatChangeEvt, updateARemoteStream]);
	// const navigate = useNavigate();

	if (!classInfo) {
		return (
			<Page className={classes.root} title={pageTitle}>
				<Container>
					<Typography gutterBottom>
						{loadingClass && <CircularProgress />}
						{loadingClassErr}
					</Typography>
					<Typography gutterBottom>
						<LinkButton href='/'>Home</LinkButton>
					</Typography>
				</Container>
			</Page>
		);
	}

	const { isLoading } = localStreamObj;
	const isTeacher = isHostTeacher || isGuestTeacher;
	const remoteStreamCommons = {
		isTeacher,
		msgClient: messageClient.current,
		msgChannel: messageChannel.current,
	};

	const vidDisp = (
		<Fragment>
			{joined && (
				<VideoDisplay
					isTeacher={isTeacher}
					isLocal
					{...{ resumePlaying, toggleMic, toggleCam, ...localStreamObj }}
				/>
			)}
		</Fragment>
	);

	return (
		<Fragment>
			{/* Settings Dialog Box */}
			<Settings
				open={settingsDialogOpen}
				toggleOpen={toggleSettingsDialogOpen}
				audioDeviceId={audioDeviceId}
				videoDeviceId={videoDeviceId}
				setAudioDeviceId={updateAudioDeviceId}
				setVideoDeviceId={updateVideoDeviceId}
			/>
			<Page title={pageTitle}>
				<Grid container className={classes.wrapper}>
					<Grid item xs={12}>
						<div className={classes.classControls}>
							{/* Permissions Request */}
							{isLoading && (
								<Box>
									<Typography variant='h6' color='primary'>
										Click &ldquo;Allow&rdquo;
									</Typography>
									<Typography variant='body1' color='secondary'>
										to grant browser access to camera and microphone.
									</Typography>
								</Box>
							)}
							<Box mt={1} mb={1}>
								<Button
									fullWidth
									className={clsx({
										[classes.buttonWithLoadingIcon]: true,
										[classes.buttonEndClass]: joined && !isLoading, //only when open === true
									})}
									color='primary'
									disabled={isLoading}
									variant='contained'
									onClick={joined ? clearStream : startStream}
									startIcon={isLoading && <CircularProgress className={classes.circularProgress} />}
								>
									{joined && !isLoading ? 'End Class' : 'Start Class'}
								</Button>
							</Box>
							{/* Icon Control Icons */}
							{!isStudent && joined && (
								<Tooltip
									title={`${shareScreenClient ? 'Stop Sharing' : 'Share Your'} Screen`}
									aria-label={`${shareScreenClient ? 'Stop Sharing' : 'Share Your'} Screen`}
									placement='top'
								>
									<Button
										aria-label='present to all'
										onClick={shareScreenClient ? clearScreenStream : startScreenStream}
									>
										<Icon className={classes.icon}>
											{shareScreenClient ? 'cancel_presentation' : 'present_to_all'}
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
					<Grid item xs={12} sm={4} className={classes.container}>
						<Container>
							<Grid container>
								<Grid item xs={12} className={classes.teacher}>
									{/* Host Teacher */}
									{isHostTeacher && vidDisp}
									{!isHostTeacher && hostStreamObj.id && (
										<RemoteStream
											{...{ ...remoteStreamCommons, ...hostStreamObj }}
											stream={hostTeacherStream.current}
										>
											{(props) => <VideoDisplay {...props} />}
										</RemoteStream>
									)}
									{/* Guest Teacher */}
									{isGuestTeacher && vidDisp} {/* local stream: what the teacher sees */}
									{!isGuestTeacher && guestStreamObj.id && (
										<RemoteStream
											{...{ ...remoteStreamCommons, ...guestStreamObj }}
											stream={guestTeacherStream.current}
										>
											{(props) => <VideoDisplay {...props} />}
										</RemoteStream>
									)}
								</Grid>
							</Grid>
						</Container>
					</Grid>
					<Grid item xs={12} sm={8} className={classes.item}>
						<VideoDisplay id='screen-share' noControls />

						<Grid container>
							<Grid item xs={6} sm={4}>
								{isStudent && vidDisp}
							</Grid>
							{remoteStreamsObj.map((stream, ind) => {
								return (
									<RemoteStream
										key={ind}
										{...{ ...stream, ...remoteStreamCommons }}
										stream={remoteStreams.current[ind]}
									>
										{(props) => (
											<Grid item xs={6} sm={2} key={ind}>
												<VideoDisplay iconSize='small' {...props} />
											</Grid>
										)}
									</RemoteStream>
								);
							})}
						</Grid>
						{!isStudent && remoteStreams.length === 0 && (
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
			</Page>
		</Fragment>
	);
};

ClassView.propTypes = {
	isGuestTeacher: PropTypes.bool,
};

export default ClassView;
