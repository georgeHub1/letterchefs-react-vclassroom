import { useState, useEffect, useCallback } from 'react';

import { saveToLocalStore /* , getLocalStore */ } from '../../helpers';
import { appPrefix } from '../../config';

const mediaDevicesStore = appPrefix + 'med_devices';

let audDevId, vidDevId;
// try {
// 	const devices = JSON.parse(getLocalStore(mediaDevicesStore) || '{}');
// 	vidDevId = devices.audioDeviceId;
// 	audDevId = devices.videoDeviceId;
// } catch (e) {}

const useDevicesId = () => {
	const [audioDeviceId, setAudioDeviceId] = useState(() => audDevId || '');
	const updateAudioDeviceId = useCallback((src) => setAudioDeviceId(src), []);
	const [videoDeviceId, setVideoDeviceId] = useState(() => vidDevId || '');
	const updateVideoDeviceId = useCallback((src) => setVideoDeviceId(src), []);

	useEffect(() => {
		if (!audioDeviceId && !videoDeviceId) return;
		saveToLocalStore(mediaDevicesStore, JSON.stringify({ audioDeviceId, videoDeviceId }));
	}, [audioDeviceId, videoDeviceId]);

	return { mic: [audioDeviceId, updateAudioDeviceId], cam: [videoDeviceId, updateVideoDeviceId] };
};

export default useDevicesId;
