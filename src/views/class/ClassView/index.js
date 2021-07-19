import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Grid,
	// Typography,
	CircularProgress,
	makeStyles,
	Link,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { common, green, grey, indigo, pink, teal } from '@material-ui/core/colors';
import AgoraRTC from 'agora-rtc-sdk';
import AgoraRTM from 'agora-rtm-sdk';
import { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } from 'agora-access-token';

import Page from '../../../components/Page';
import LinkButton from '../../../components/LinkButton';
import HostTeacherView from './HostTeacher';
import GuestTeacherView from './GuestTeacher';
import StudentClassView from './Student';
import Settings from '../Settings';
import useCopyText from '../useCopyText';
import useSettingsDialog from '../useSettingsDialog';
import useDevicesId from '../useDevicesId';
// import VideoDisplay from '../../../components/Video';
// import RemoteStream from '../RemoteStream';

import ClassSvg from '../../../components/ux/images/teacher';

import {
	Http,
	userID as uid,
	// isChrome,
	isFirefox,
	// isSafari,
} from '../../../helpers';
import '../video.css';
import useGetEventInfo from './useGetEventInfo';

const appID = 'cc21d8682d134a83a07846acf43cdec5';
const appCert = 'aae04864ee774d05be532e4feca2ec19';
const role = RtcRole.PUBLISHER;
const xpiredTs = Math.floor(Date.now() / 1000) + 75 * 60;
const screenUidFactor = 50000000;
const screenUid = uid * screenUidFactor;

// const shouldUseMic = true;
// const shouldUseCam = true;

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
			color: teal['A700'],
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
		error: { color: 'red' },
	};
});

const ClassView = () => {
	let { class_id, event_id } = useParams();
	const navigate = useNavigate();

	const classes = useStyles();

	const { WavingHandIcon } = ClassSvg;

	const [hostTeacherID, setHostTeacherID] = useState(0);
	const [guestTeacherIDs, setGuestTeacherIDs] = useState([]);
	const isGuestTeacher = guestTeacherIDs.includes(uid);

	const channel = `${hostTeacherID}-${class_id}`;
	const rtcToken = RtcTokenBuilder.buildTokenWithUid(appID, appCert, channel, uid, role, xpiredTs);
	const rtmToken = RtmTokenBuilder.buildToken(appID, appCert, uid + '', RtmRole, xpiredTs);

	const isHostTeacher = uid === hostTeacherID;
	const isTeacher = isHostTeacher || isGuestTeacher;
	const isStudent = !isTeacher;

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

	const localStream = useRef(null);
	const screenStream = useRef(null);
	const hostTeacherStream = useRef(null);
	const guestTeacherStream = useRef(null);
	const remoteStreams = useRef([]);

	const [localStreamObj, setLocalStreamObj] = useState({});
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
					if (index > -1) {
						newRemotes[index][key] = value;
					}
					return newRemotes;
				});
			}
		},
		[localStreamObj.streamId, screenStreamObj.streamId, hostTeacherID, guestTeacherIDs]
	);

	const [isSharingScreen, setSharingScreen] = useState(0);
	useEffect(() => {
		if (isTeacher || isSharingScreen === 0 || !localStream.current) {
			return;
		}

		if (isSharingScreen) {
			localStream.current.muteAudio();
			localStream.current.muteVideo();
		} else {
			if (localStreamObj.isUsingMic) localStream.current.unmuteAudio();
			if (localStreamObj.isUsingCam) localStream.current.unmuteVideo();
		}
	}, [isSharingScreen, isTeacher, localStreamObj.isUsingMic, localStreamObj.isUsingCam]);

	const [projectingId, setProjectingId] = useState(0);
	useEffect(() => {
		if (projectingId === 0) {
			return;
		}
		if (projectingId === -1) {
			setLocalStreamObj((x) => ({ ...x, isProjecting: false }));
			setRemoteStreamsObj((x) => {
				let newRemotes = [...x];
				for (const ind in newRemotes) {
					newRemotes[ind].isProjecting = false;
				}
				return newRemotes;
			});
			return;
		}
		if (projectingId > 0) {
			setLocalStreamObj((x) => ({ ...x, isProjecting: projectingId === localStreamObj.streamId }));
			setRemoteStreamsObj((x) => {
				let newRemotes = [...x];
				for (const ind in newRemotes) {
					if (newRemotes[ind].streamId === projectingId)
						newRemotes[ind].isProjecting = !newRemotes[ind].isProjecting;
					else newRemotes[ind].isProjecting = false;
				}
				return newRemotes;
			});
		}
	}, [projectingId, localStreamObj.streamId]);

	const cameraNums = remoteStreamsObj.filter((stream) => stream.showingCamera === true);

	const { isLoading: isLoadingClass, error: loadingClassErr, eventInfo } = useGetEventInfo(
		event_id
	);

	const [readingEventError, setReadingEventError] = useState('');
	const [readingEventStartsBy, setReadingEventStartsBy] = useState(-1);
	const readingEventStartsByInterval = useRef(null);

	useEffect(() => {
		if (readingEventStartsBy === 0) {
			setReadingEventError('');
			if (readingEventStartsByInterval.current !== null)
				clearInterval(readingEventStartsByInterval.current);
		}
		if (readingEventStartsBy > 0 && readingEventStartsByInterval.current === null) {
			const step = 1000;
			readingEventStartsByInterval.current = setInterval(() => {
				setReadingEventStartsBy((x) => x - step);
			}, step);
		}
	}, [readingEventStartsBy]);

	useEffect(() => {
		if (eventInfo.id && eventInfo.pay_status !== 'succeeded')
			navigate(`/tickets/${eventInfo.id}/mustpay`);

		if (eventInfo.created_by && eventInfo.created_by.id)
			setHostTeacherID(eventInfo.created_by.id * 1);
		if (eventInfo.teachers) setGuestTeacherIDs((eventInfo.teachers || '').split(/,+\s+/));

		if (!eventInfo.start_date) return;
		const startDateStr = eventInfo.start_date.split('T')[0];
		const startDateTimeInt = new Date(startDateStr + 'T' + eventInfo.start_time) * 1;
		const endDateTimeInt = new Date(startDateStr + 'T' + eventInfo.end_time) * 1;
		const nowDateTimeInt = new Date() * 1;
		const startsBy = startDateTimeInt - nowDateTimeInt;

		if (nowDateTimeInt > endDateTimeInt) {
			setReadingEventError('The time of this reading event has passed');
		} else if (startsBy > 0) {
			setReadingEventStartsBy(startsBy);
		}
	}, [eventInfo, navigate]);

	useEffect(() => {}, []);

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
		if (!localStream.current) {
			return;
		}
		let set = localStream.current[localStreamObj.isUsingCam ? 'muteVideo' : 'unmuteVideo']();
		if (set) {
			setLocalStreamObj((x) => ({ ...x, isUsingCam: !x.isUsingCam }));
		} else {
			set = localStream.current[localStreamObj.isUsingCam ? 'unmuteVideo' : 'muteVideo']();
		}
	}, [localStreamObj.isUsingCam]);

	const clearRaisingHand = useCallback(
		(streamId) => {
			if (!isTeacher) return;
			updateARemoteStream(streamId, 'isRaisingHand', false);
			//@john - implement clearRaisingHand, student raises hand, and teacher should clear it.
		},
		[isTeacher, updateARemoteStream]
	);

	const stopRemoteStream = useCallback(
		(id) => {
			if (id === localStreamObj.streamId) {
				if (localStream.current) {
					localStream.current.stop();
					localStream.current.close();
				}
				localStream.current = null;
				setLocalStreamObj({});
				return;
			}
			if (id === hostStreamObj.streamId) {
				if (hostTeacherStream.current) {
					hostTeacherStream.current.stop();
					hostTeacherStream.current.close();
				}
				hostTeacherStream.current = null;
				setHostStreamObj({});
				return;
			}
			if (id === guestStreamObj.streamId) {
				if (guestTeacherStream.current) {
					guestTeacherStream.current.stop();
					guestTeacherStream.current.close();
				}
				guestTeacherStream.current = null;
				setGuestStreamObj({});
				return;
			}
			setRemoteStreamsObj((x) => {
				const newRemotes = [...x];
				const index = newRemotes.findIndex((x) => x.streamId === id);
				if (index > -1) {
					if (remoteStreams.current[index]) {
						remoteStreams.current[index].stop();
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
		console.log('clearing screen stream');
		if (screenStream.current) {
			screenStream.current.stop();
			screenStream.current.close();
		}
		screenStream.current = null;
		setScreenStreamObj({});

		if (screenClient.current) {
			screenClient.current.leave(
				() => {
					screenClient.current = null;
					console.log('stopped sharing screen success');
					setSharingScreen(false);
				},
				(err) => {
					console.log('stop sharing screen failed', err);
				}
			);
		}
	}, []);

	const clearStream = useCallback(() => {
		clearScreenStream();

		const stopMsgChannel = () => {
			if (!messageChannel.current) return;
			messageChannel.current.leave();
			messageChannel.current = null;
		};
		const stopMsgClient = () => {
			if (!messageClient.current) return;
			messageClient.current.logout();
			messageClient.current = null;
		};

		if (isHostTeacher) {
			if (messageChannel.current) {
				messageChannel.current
					.sendMessage({ text: '___end-class___' })
					.then(() => {
						console.log('channel message sent');
					})
					.catch((e) => console.error('could not send channel message', e))
					.finally(() => {
						stopMsgChannel();
						stopMsgClient();
					});
			} else stopMsgClient();
		} else {
			stopMsgChannel();
			stopMsgClient();
		}

		if (localStream.current) {
			localStream.current.stop();
			localStream.current.close();
		}
		localStream.current = null;
		setLocalStreamObj({});

		if (hostTeacherStream.current) {
			hostTeacherStream.current.stop();
			hostTeacherStream.current.close();
		}
		hostTeacherStream.current = null;
		setHostStreamObj({});

		if (guestTeacherStream.current) {
			guestTeacherStream.current.stop();
			guestTeacherStream.current.close();
		}
		guestTeacherStream.current = null;
		setGuestStreamObj({});

		remoteStreams.current.forEach((rem) => {
			rem.stop();
			rem.close();
		});
		remoteStreams.current = [];
		setRemoteStreamsObj([]);

		const finishOff = () => {
			client.current = null;
			setJoined(false);
		};

		if (client.current)
			client.current.leave(
				() => {
					finishOff();
					console.log('client leaves classroom success');
				},
				(err) => {
					finishOff();
					console.log('classroom leave failed', err);
				}
			);
		else finishOff();
	}, [clearScreenStream, isHostTeacher]);

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
				rtcToken,
				channel,
				screenUid,
				(screenUid) => {
					// Create the screen-sharing stream, screenStream.
					setScreenStreamObj({ streamId: screenUid, isScreenStream: true });

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
					screenStream.current.setScreenProfile('1080p_2');
					screenStream.current.init(
						() => {
							screenStream.current.play('screen-share', () => {
								console.log('sharing screen');
								setSharingScreen(true);
								screenClient.current.publish(screenStream.current, (err) => {
									console.error('publish failed', err);
									//clearScreenStream();
								});
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
		if (!localStream.current) {
			return;
		}
		console.error('clicked!');
		const res = localStream.current.resume();
		console.error('res', res);
		res
			.then(() => console.log(`Stream is resumed successfully`))
			.catch((e) => console.error(`Failed to resume stream. Error ${e.name} Reason ${e.message}`));
	};

	useEffect(() => {
		if (!document.addEventListener) {
			return;
		}

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

		if (!hidden || !visibilityChange) {
			return;
		}

		const handleVisibilityChange = () => {
			// const stream = localStream.current;
			// if (!stream) {
			// 	return;
			// }
			// if (document[hidden]) {
			// 	stream.muteAudio();
			// 	stream.muteVideo();
			// } else {
			// 	if (localStreamObj.isUsingMic) stream.unmuteAudio();
			// 	if (localStreamObj.isUsingCam) stream.unmuteVideo();
			// }
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

	const playStatChangeEvt = useCallback((e, stream, setterFunc) => {
		let obj = {};
		const isVideo = e.mediaType === 'video';
		const showPlayBtnKey = isVideo ? 'showVideoPlayBtn' : 'showAudioPlayBtn';
		if (!e.isErrorState) {
			if (e.status === 'play') {
				obj = { [showPlayBtnKey]: false, isLoading: false };
			}
		} else {
			if (e.status === 'paused' || e.reason === 'suspend') {
				obj = { [showPlayBtnKey]: true, isLoading: false };
				if (isVideo) {
					stream
						.resume()
						.then(() => console.log(`Stream is resumed successfully`))
						.catch((e) =>
							console.error(`Failed to resume stream. Error ${e.name} Reason ${e.message}`)
						);
				}
			} else if (e.reason === 'stalled') {
				obj = { isLoading: true, [showPlayBtnKey]: false };
			}
		}
		if (setterFunc) setterFunc((x) => ({ ...x, ...obj }));
		else return obj;
	}, []);

	useEffect(() => {
		if (!joined) return;

		const clearStreamTimer = setTimeout(() => {
			clearStream();
		}, 75 * 60 * 1000);

		return () => {
			clearTimeout(clearStreamTimer);
		};
	}, [joined, clearStream]);

	const startStream = useCallback(() => {
		const setIsLoading = (s) => setLocalStreamObj((x) => ({ ...x, isLoading: s }));
		setIsLoading(true);

		// Initialize the client
		client.current = AgoraRTC.createClient(agoraClientObj);
		client.current.init(
			appID,
			() => {
				client.current.join(
					rtcToken,
					channel,
					uid,
					async (uid) => {
						setJoined(true);
						setLocalStreamObj({
							isLoading: false,
							showAudioPlayBtn: false,
							showVideoPlayBtn: false,
							isUsingMic: isTeacher,
							isUsingCam: true,
							showingCamera: true,
							streamId: uid,
						});

						console.log('join channel: ', channel, 'success, uid: ', uid);

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
							audio: true,
							video: true,
							screen: false,
							audioSource,
							videoSource,
						});

						localStream.current.init(
							() => {
								console.log('init local stream success');
								localStream.current.play('local-stream', () => {
									setIsLoading(false);
									if (isStudent) {
										localStream.current.muteAudio();
									}

									client.current.publish(localStream.current, (err) => {
										console.error('publish failed', err);
										clearStream();
									});
								});

								localStream.current.on('player-status-change', (e) => {
									playStatChangeEvt(e, localStream.current, setLocalStreamObj);
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
				if (remoteStreams.current < 16) {
					client.current.subscribe(remoteStream, (err) => {
						console.log('stream subscribe failed', err);
					});
				} else {
					clearStream();
					setReadingEventError('There cannot be more than 15 students in a class');
				}
			}
			console.log('stream-added remote-uid: ', id);
		};
		const streamSubscribedEvt = (evt) => {
			const remoteStream = evt.stream;
			const id = remoteStream.getId();
			const showingCamera = isTeacher || cameraNums <= 15;
			const isScreenStream = id % screenUidFactor === 0;
			let streamObj = {
				id: 'remote_video_' + id,
				streamId: id,
				isRaisingHand: false,
				isUsingMic: remoteStream.hasAudio() || isTeacher,
				isUsingCam: remoteStream.hasVideo() || !showingCamera,
				showingCamera,
				isScreenStream,
				isProjecting: false,
			};

			const handleSub = () => {
				if (isScreenStream) {
					// stop projecting any students
					setProjectingId(-1);
				}

				// play remote streams
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

				if (isScreenStream) {
					setSharingScreen(true);
				}
			};

			if (isScreenStream) {
				return handleSub();
			}

			Http().secureRequest({
				url: `/users/${id}`,
				successCallback: ({ status, data }) => {
					if (!status) return handleSub();

					streamObj = { ...streamObj, userDetails: data };
					handleSub();
				},
				errorCallback: () => {
					console.error('could not get user details of', id);
					handleSub();
				},
			});

			console.log('stream-subscribed remote-uid: ', id);
		};
		const streamRemovedEvt = (evt) => {
			var remoteStream = evt.stream;
			var id = remoteStream.getId();
			stopRemoteStream(id);
			const isScreenStream = id % screenUidFactor === 0;
			if (isScreenStream) {
				setSharingScreen(false);
			}
			console.log('stream-removed remote-uid: ', id);
		};

		const peerOnlineEvt = (evt) => updateARemoteStream(evt.uid, 'errMsg', '');
		const peerLeaveEvt = (evt) => {
			let errMsg;
			switch (evt.reason) {
				case 'Quit':
					//errMsg = '';
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
			if (typeof errMsg !== 'undefined') updateARemoteStream(evt.uid, 'errMsg', errMsg);
		};

		const clientBannedEvt = (evt) =>
			setLocalStreamObj((x) => ({ ...x, errMsg: `You are banned ${evt.attr}` }));
		const volumeIndicatorEvt = (evt) => {
			evt.attr.forEach((vol) => {
				const id = vol.uid;
				const remoteSpeaking = vol.level > 5;
				if (id === localStreamObj.streamId) {
					if (localStreamObj.remoteSpeaking !== remoteSpeaking)
						setLocalStreamObj((x) => ({ ...x, remoteSpeaking }));
				} else if (id === hostTeacherID) {
					if (hostStreamObj.remoteSpeaking !== remoteSpeaking)
						setHostStreamObj((x) => ({ ...x, remoteSpeaking }));
				} else if (guestTeacherIDs.includes(id)) {
					if (guestStreamObj.remoteSpeaking !== remoteSpeaking)
						setGuestStreamObj((x) => ({ ...x, remoteSpeaking }));
				} else {
					setRemoteStreamsObj((x) => {
						const newRemotes = [...x];
						const index = newRemotes.findIndex((x) => x.streamId === id);
						if (index > -1) {
							newRemotes[index].remoteSpeaking = remoteSpeaking;
						}
						return newRemotes;
					});
				}
				// updateARemoteStream(vol.uid, 'remoteSpeaking', vol.level > 5);
			});
		};

		const msgClient = AgoraRTM.createInstance(appID);
		msgClient.on('ConnectionStateChange', (newState, reason) => {
			console.log('on connection state changed to ' + newState + ' reason: ' + reason);
		});
		msgClient.on('MessageFromPeer', ({ text }, peerId) => {
			console.log(`message ${text} received from`, peerId);
			switch (text) {
				case '___toggle-mic___':
					toggleMic();
					break;
				case '___toggle-cam___':
					toggleCam();
					break;
				case '___raise-hand___':
					if (isTeacher) {
						updateARemoteStream(peerId, 'isRaisingHand', true);
					}
					break;
				default:
					break;
			}
		});

		msgClient
			.login({ token: rtmToken, uid: uid + '' })
			.then(() => {
				// console.error('AgoraRTM client login success');
				messageClient.current = msgClient;

				const msgChannel = msgClient.createChannel(channel);
				msgChannel.on('ChannelMessage', ({ text }, senderId) => {
					console.log(`channel message ${text} received from`, senderId);

					const parseMsg = () => {
						try {
							const parse = JSON.parse(text);
							const msg = parse.msg || '';
							const to = parse.to || '';
							console.log('to', to);
							console.log('msg', msg);

							if (msg === '___project___') {
								setProjectingId(to);
							}
						} catch (e) {
							console.error('could not parse channel text', text);
						}
					};

					switch (text) {
						case '___toggle-mic___':
							toggleMic();
							break;
						case '___toggle-cam___':
							toggleCam();
							break;
						case '___end-class___':
							clearStream();
							break;
						default:
							parseMsg();
							break;
					}
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
		hostStreamObj.remoteSpeaking,
		guestTeacherIDs,
		guestStreamObj.remoteSpeaking,
		localStreamObj.streamId,
		localStreamObj.remoteSpeaking,
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
		cameraNums,
		isTeacher,
		rtcToken,
		rtmToken,
	]);

	useEffect(() => {
		if (!hostTeacherStream.current) {
			return;
		}
		hostTeacherStream.current.play(hostStreamObj.id, (err) => {
			console.log('streaming Host Teacher remote', err);
		});
		hostTeacherStream.current.on('player-status-change', (e) =>
			playStatChangeEvt(e, hostTeacherStream.current, setHostStreamObj)
		);
	}, [hostStreamObj.id, playStatChangeEvt]);

	useEffect(() => {
		if (!guestTeacherStream.current) {
			return;
		}
		guestTeacherStream.current.play(guestStreamObj.id, (err) => {
			console.log('streaming Guest Teacher remote', err);
		});
		guestTeacherStream.current.on('player-status-change', (e) =>
			playStatChangeEvt(e, guestTeacherStream.current, setGuestStreamObj)
		);
	}, [guestStreamObj.id, playStatChangeEvt]);

	useEffect(() => {
		for (const ind in remoteStreamsObj) {
			const { id, streamId, playedOnce, evtSet, showingCamera } = remoteStreamsObj[ind];
			const stream = remoteStreams.current[ind];
			if (!stream) {
				continue;
			}

			if (!stream.isPlaying()) {
				if (!playedOnce) {
					stream.play(id, (err) => {
						console.log('streaming remote', err);
					});
				} else {
					stream.resume();
				}
			}
			if (!showingCamera) {
				stream.muteVideo();
				updateARemoteStream(streamId, 'isUsingCam', false);
			}
			if (evtSet) {
				continue;
			}
			stream.on('player-status-change', (e) => {
				const ret = playStatChangeEvt(e, stream);
				for (const key in ret) {
					updateARemoteStream(streamId, key, ret[key]);
				}
				updateARemoteStream(streamId, 'evtSet', true);
			});
		}
	}, [remoteStreamsObj, playStatChangeEvt, updateARemoteStream]);

	const { isLoading } = localStreamObj;
	const remoteStreamCommons = {
		msgClient: messageClient.current,
		msgChannel: messageChannel.current,
		joined,
		setProjectingId,
		isTeacher,
	};

	let actionBtnName = '';
	if (joined && !isLoading) {
		actionBtnName = 'Leave Class';
		if (isHostTeacher) {
			actionBtnName = 'End Class';
		}
	} else {
		actionBtnName = 'Join Class';
		if (isHostTeacher) {
			actionBtnName = 'Start Class';
		}
	}
	const pageTitle = 'LetterChefs | Livestream Book Reading';

	if (isLoadingClass || loadingClassErr) {
		return (
			<Page className={classes.root} title={pageTitle}>
				<Grid container className={classes.wrapper}>
					<Container>
						<Box mb={3}>{isLoadingClass && <CircularProgress />}</Box>

						{loadingClassErr && (
							<React.Fragment>
								<Alert severity='error'>{loadingClassErr}</Alert>
								<Box mt={3} mb={3}>
									<LinkButton
										href='/app/reading-sessions'
										color='secondary'
										variant='contained'
										aria-label='Go back to reading sessions'
									>
										Back to Reading Sessions
									</LinkButton>
									<LinkButton
										href='/class'
										color='primary'
										variant='contained'
										aria-label='Go back to classes'
									>
										Back to Classes
									</LinkButton>
								</Box>
							</React.Fragment>
						)}
					</Container>
				</Grid>
			</Page>
		);
	}

	const numHandRaisers = remoteStreamsObj.filter((x) => x.isRaisingHand).length;
	const handRaisers = remoteStreamsObj
		.filter((x) => x.isRaisingHand)
		.map(({ id, streamId, userDetails }, ind) => {
			let name = '';
			if (!userDetails) {
				name = streamId;
			} else {
				name = `${userDetails.family_name} ${userDetails.family_name}`.trim();
			}

			return (
				<div key={ind}>
					<WavingHandIcon />
					<Link href={`#${id}`}>
						{name.length > 0 && name}
						{!name || (name.length === 0 && 'Student')}
					</Link>
				</div>
			);
		});

	const countingTime = (millis) => {
		let day;
		let hr;
		let min;
		let sec;

		let dayOffset = 1000 * 60 * 60 * 24;
		let hrOffset = 1000 * 60 * 60;
		let minOffset = 1000 * 60;
		let secOffset = 1000;

		let hrRemains;
		let minRemains;
		let secRemains;

		switch (true) {
			case millis > dayOffset:
				day = Math.floor(millis / dayOffset);
				hrRemains = millis - dayOffset;
				if (hrRemains > hrOffset) {
					hr = Math.floor(hrRemains / hrOffset);
					minRemains = hrRemains - hrOffset;
					if (minRemains > minOffset) {
						min = Math.floor(minRemains / minOffset);
						secRemains = minRemains - minOffset;
						if (secRemains > secOffset) {
							sec = Math.floor(secRemains / secOffset);
						}
					}
				}
				break;
			case millis > hrOffset:
				hr = Math.floor(millis / hrOffset);
				minRemains = millis - hrOffset;
				if (minRemains > minOffset) {
					min = Math.floor(minRemains / minOffset);
					secRemains = minRemains - minOffset;
					if (secRemains > secOffset) sec = Math.floor(secRemains / secOffset);
				}
				break;
			case millis > minOffset:
				min = Math.floor(millis / minOffset);
				secRemains = millis - minOffset;
				if (secRemains > secOffset) sec = Math.floor(secRemains / secOffset);
				break;
			case millis > secOffset:
				sec = Math.floor(millis / secOffset);
				break;
			default:
				break;
		}

		return { day, hr, min, sec };
	};

	const { day, hr, min, sec } = countingTime(readingEventStartsBy);

	const readingEventInfo = (
		<React.Fragment>
			{readingEventStartsBy > 0 && (
				<Alert severity='info'>
					Reading event starts in{' '}
					<strong>
						{day} day{day > 1 && 's'}: {hr} hr{hr > 1 && 's'}: {min} min
						{min > 1 && 's'}: {sec} sec
					</strong>
				</Alert>
			)}
			{readingEventError > 0 && <Alert severity='error'>{readingEventError}</Alert>}
		</React.Fragment>
	);

	const viewProps = {
		readingEventStartsBy,
		readingEventInfo,
		joined,
		resumePlaying,
		toggleMic,
		toggleCam,
		localStreamObj,
		remoteStreamCommons,
		isLoading,
		actionBtnName,
		remoteStreams: remoteStreams.current,
		joinUrl,
		toggleSettingsDialogOpen,
		remoteStreamsObj,
		clearStream,
		startStream,
	};

	const teacherViewProps = {
		isSharingScreen,
		clearScreenStream,
		startScreenStream,
		clearRaisingHand,
		copied,
		setCopied,
		handRaisers,
		numHandRaisers,
	};

	let view;
	if (isHostTeacher) {
		view = (
			<HostTeacherView
				{...viewProps}
				{...teacherViewProps}
				guestStreamObj={guestStreamObj}
				guestTeacherStream={guestTeacherStream.current}
			/>
		);
	} else if (isGuestTeacher) {
		view = (
			<GuestTeacherView
				{...viewProps}
				{...teacherViewProps}
				hostTeacherID={hostTeacherID}
				hostStreamObj={hostStreamObj}
				hostTeacherStream={hostTeacherStream.current}
			/>
		);
	} else if (isStudent) {
		view = (
			<StudentClassView
				{...viewProps}
				hostTeacherID={hostTeacherID}
				hostStreamObj={hostStreamObj}
				hostTeacherStream={hostTeacherStream.current}
				guestStreamObj={guestStreamObj}
				guestTeacherStream={guestTeacherStream.current}
			/>
		);
	}
	return (
		<Page className={classes.root} title={pageTitle}>
			{/* Settings Dialog Box */}
			<Settings
				open={settingsDialogOpen}
				toggleOpen={toggleSettingsDialogOpen}
				audioDeviceId={audioDeviceId}
				videoDeviceId={videoDeviceId}
				setAudioDeviceId={updateAudioDeviceId}
				setVideoDeviceId={updateVideoDeviceId}
			/>
			{view}
		</Page>
	);
};

export default ClassView;
