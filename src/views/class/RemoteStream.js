const RemoteStream = ({
	children,
	stream,
	streamId,
	isTeacher,
	msgClient,
	msgChannel,
	// isScreenStream,
	setProjectingId,
	...restProps
}) => {
	const toggleMic = () => {
		if (!isTeacher || !msgClient || typeof msgClient.sendMessageToPeer !== 'function') {
			return;
		}
		msgClient.sendMessageToPeer({ text: '___toggle-mic___' }, streamId + '');
	};
	const toggleCam = () => {
		if (!isTeacher || !msgClient || typeof msgClient.sendMessageToPeer !== 'function') {
			return;
		}
		msgClient.sendMessageToPeer({ text: '___toggle-cam___' }, streamId + '');
	};

	const raiseHand = () => {
		if (isTeacher || !msgClient || typeof msgClient.sendMessageToPeer !== 'function') {
			return;
		}
		msgClient.sendMessageToPeer({ text: '___raise-hand___' }, streamId + '');
	};

	const handleProjectStudent = () => {
		if (!isTeacher || !msgChannel || typeof msgChannel.sendMessage !== 'function') {
			return console.error('Not projecting');
		}

		const msg = '___project___';
		if (msg !== '___project___' && msg !== '___unproject___') {
			console.error('project message invalid');
			return;
		}

		msgChannel
			.sendMessage({ text: JSON.stringify({ to: streamId, msg }) })
			.then(() => {
				console.log(msg, ' channel message sent');
				setProjectingId(streamId);
			})
			.catch((e) => {
				console.error('could not send channel message', msg, e);
			});
	};

	const resumePlaying = () => {
		if (!stream) return console.error('Stream', stream, 'is falsy for ID', streamId);
		stream
			.resume()
			.then(() => {
				console.log(`Stream is resumed successfully`);
			})
			.catch((e) => {
				console.error(`Failed to resume stream. Error ${e.name} Reason ${e.message}`);
			});
	};

	const { isUsingMic, isUsingCam, ...props } = restProps;
	return children({
		resumePlaying,
		toggleMic,
		toggleCam,
		raiseHand,
		handleProjectStudent,
		isUsingMic: !isUsingMic,
		isUsingCam: !isUsingCam,
		msgClient,
		streamId,
		...props,
	});
};

export default RemoteStream;
