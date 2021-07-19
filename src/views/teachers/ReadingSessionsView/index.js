import React, { useState, useEffect, useCallback } from 'react';
import {
	Box,
	Container,
	Grid,
	// Link,
	makeStyles,
	// Modal,
	Typography,
	// FormControl,
	CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Page from '../../../components/Page';

import LinkButton from '../../../components/LinkButton';
import ReadingSessionCard from './ReadingSessionCard';

import PublishEventDialog from './dialogs/PublishEvent';
import ReadingEventDialog from '../../classes/dialogs/ReadingEvent';
import InviteGuestTeacherDialog from './dialogs/InviteGuestTeacher';
import ViewUsersDialog from '../../classes/dialogs/ViewUsers';
import CancelEventDialog from './dialogs/CancelEvent';

import useDialog from '../../../hooks/useDialog';

import { Http, tryAgainMsg, userDetails } from '../../../helpers';
import { hasLocalStorage, readingEventStoreName } from '../../../config';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		width: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
	sessionsWrapper: {
		maxWidth: 1200,
		width: '100%',
		display: 'flex',
		flexWrap: 'wrap',
		marginTop: theme.spacing(5),
	},
	link: {
		fontWeight: theme.typography.fontWeightRegular,
	},
	paper: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
		position: 'relative',
	},
}));

const ReadingSessionsView = () => {
	const classes = useStyles();
	const { user_type } = userDetails;

	// const [customers] = useState(data);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	useEffect(() => {
		if (!success) return;

		const timer = setTimeout(() => setSuccess(''), 3000);

		// clean up
		return () => {
			clearTimeout(timer);
		};
	}, [success]);

	const [readingSessions, setReadingSessions] = useState([]);
	const [readingSessionDraft, setReadingSessionDraft] = useState(null);
	useEffect(() => console.log('readingSessionDraft', readingSessionDraft), [readingSessionDraft]);
	const [_classes, setClasses] = useState([]);
	const [classIds, setClassIds] = useState([]);

	const [activeReadingEventProps, setActiveReadingEventProps] = useState({});

	// create a reading session
	// const [classId, setClassId] = useState('');
	// const [gradeLevel, setGradeLevel] = useState('');

	// const {
	// 	readingScheduleTitle,
	// 	setReadingScheduleTitle,
	// 	day,
	// 	setDay,
	// 	startTime,
	// 	setStartTime,
	// 	endTime,
	// 	setEndTime,
	// 	timezone,
	// 	setTimeZone,
	// 	repeat,
	// 	setRepeat,
	// 	frequencyTime,
	// 	setFrequencyTime,
	// 	frequencyType,
	// 	setFrequencyType,
	// 	dayRecurrence,
	// 	setDayRecurrence,
	// 	_startDate,
	// 	_startTime,
	// 	_endTime,
	// } = useAddReadingSchedule();

	useEffect(() => {
		setIsLoading(true);
		const { secureRequest, abort } = Http();
		const rSched = secureRequest({
			url: '/reading-schedules',
			successCallback: ({ status, data, error }) => {
				if (!status) {
					return setError(error || 'Error while looking up reading sessions');
				}
				// const now = new Date().valueOf();
				// console.log(data);

				// data = data
				// 	.sort(
				// 		(a, b) =>
				// 			new Date(a.combined_start_date).valueOf() - new Date(b.combined_start_date).valueOf()
				// 	)
				// 	.filter((val) => new Date(val.combined_start_date).valueOf() > now);

				setReadingSessions(data);
			},
			noContent: () => {},
			errorCallback: () => setError('Could not connect to the server. ' + tryAgainMsg()),
		});

		const classes = secureRequest({
			url: '/classes',
			successCallback: ({ status, data, error }) => {
				console.log('classes', data);
				if (!status) {
					return setError(error || 'Error while looking up classes');
				}

				setClasses(data);
				setClassIds(data.map((x) => x.class_id));
			},
			noContent: () => {},
			errorCallback: () => setError('Could not connect to the server. ' + tryAgainMsg()),
		});

		Promise.all([rSched, classes]).finally(() => setIsLoading(false));

		if (hasLocalStorage) {
			const prevs = JSON.parse(window.localStorage.getItem(readingEventStoreName) || '{}');
			if (prevs.title || prevs.description || prevs.grade_level || prevs.day_recurrence) {
				setReadingSessionDraft({ isDraft: true, ...prevs });
			}
		}

		// clean up
		return () => {
			abort();
		};
	}, []);

	// const handleCreateReadingSession = () => {
	// 	console.log('handleCreateReadingSession');

	// 	if (readingScheduleTitle) {
	// 		return console.error('Reading schedule title must be specified');
	// 	}
	// 	if (!classId && !gradeLevel) {
	// 		return setError('Only one of class id or grade level must be provided');
	// 	}

	// 	const { secureRequest } = Http();

	// 	const createReadingSession = (class_id) => {
	// 		setIsLoading(true);
	// 		const rq = secureRequest({
	// 			url: '/reading-schedules',
	// 			method: 'POST',
	// 			body: {
	// 				class_id,
	// 				title: readingScheduleTitle,
	// 				start_date: _startDate,
	// 				start_time: _startTime,
	// 				end_time: _endTime,
	// 				timezone,
	// 				repeat,
	// 				frequency_time: frequencyTime,
	// 				frequency_type: frequencyType,
	// 				day_recurrence: dayRecurrence,
	// 			},
	// 			successCallback: ({ status, /*data,*/ error }) => {
	// 				if (!status) {
	// 					return setError(error || 'Error while creating reading schedule');
	// 				}

	// 				// console.log('Reading schedule created Successfully');
	// 			},
	// 			errorCallback: () => setError('Could not connect to the server. ' + tryAgainMsg()),
	// 		});
	// 		rq.finally(() => setIsLoading(false));
	// 	};

	// 	if (gradeLevel && !classId) {
	// 		setIsLoading(true);
	// 		const class_id = window.btoa(new Date() * 1).replace(/\W+/g, '');
	// 		secureRequest({
	// 			url: '/classes',
	// 			method: 'POST',
	// 			body: {
	// 				class_id,
	// 				name: class_id,
	// 				grade_level: gradeLevel,
	// 			},
	// 			successCallback: ({ status, /*data,*/ error }) => {
	// 				if (!status) {
	// 					setIsLoading(false);
	// 					return setError(error || 'Error while creating class');
	// 				}

	// 				// console.log('Class created Successfully');
	// 				createReadingSession(class_id);
	// 			},
	// 			errorCallback: () => {
	// 				setError('Could not connect to the server. ' + tryAgainMsg());
	// 				setIsLoading(false);
	// 			},
	// 		});
	// 	} else if (classId && !gradeLevel) {
	// 		createReadingSession(classId);
	// 	} else {
	// 		setError('Only one of class id or grade level must be provided');
	// 	}
	// };

	const [showingPublishEventDialog, openPublishEventDialog, closePublishEventDialog] = useDialog();
	const [showingEditEventDialog, openEditEventDialog, closeEditEventDialog] = useDialog();
	const [
		showingInviteGuestTeacherDialog,
		openInviteGuestTeacherDialog,
		closeInviteGuestTeacherDialog,
	] = useDialog();
	const [showingViewStudentsDialog, openViewStudentsDialog, closeViewStudentsDialog] = useDialog();
	const [showingCancelEventDialog, openCancelEventDialog, closeCancelEventDialog] = useDialog();

	useEffect(() => {
		const action = activeReadingEventProps.__action;
		if (action === 'publish') {
			openPublishEventDialog();
		}
		if (action === 'edit') {
			openEditEventDialog();
		}
		if (action === 'invite-guest-teacher') {
			openInviteGuestTeacherDialog();
		}
		if (action === 'cancel') {
			openCancelEventDialog();
		}
		if (action === 'view-students') {
			openViewStudentsDialog();
		}
	}, [
		activeReadingEventProps.__action,
		openPublishEventDialog,
		openEditEventDialog,
		openInviteGuestTeacherDialog,
		openCancelEventDialog,
		openViewStudentsDialog,
	]);

	const handleEditEventCallback = useCallback((newSession) => {
		setReadingSessions((x) => {
			const sessions = [...x];
			const currentSessionIndex = sessions.findIndex((x) => x.id === newSession.id);
			if (currentSessionIndex < 0) {
				return sessions;
			}
			for (const ind in newSession) sessions[currentSessionIndex][ind] = newSession[ind];
			return sessions;
		});
	}, []);

	const cardMapper = (session, index) => (
		<ReadingSessionCard
			key={index}
			{...{
				setIsLoading,
				setError,
				setSuccess,
				setReadingSessions,
				setReadingSessionDraft,
				setActiveReadingEventProps,
				handleEditEventCallback,
				openViewStudentsDialog,
				openEditEventDialog,
				openInviteGuestTeacherDialog,
				openCancelEventDialog,
				showingViewStudentsDialog,
				showingEditEventDialog,
				showingInviteGuestTeacherDialog,
				showingCancelEventDialog,
				...session,
			}}
		/>
	);

	return (
		<Page
			className={classes.root}
			title='Upcoming Reading Sessions | LetterChefs | Live Reading Classes'
		>
			<PublishEventDialog
				isOpened={showingPublishEventDialog}
				handleClose={closePublishEventDialog}
				readingEventProps={activeReadingEventProps}
			/>
			<ReadingEventDialog
				isEdit
				isOpened={showingEditEventDialog}
				handleClose={closeEditEventDialog}
				readingEventProps={activeReadingEventProps}
				onDone={handleEditEventCallback}
			/>
			<InviteGuestTeacherDialog
				classId={activeReadingEventProps.class_id}
				isOpened={showingInviteGuestTeacherDialog}
				handleClose={closeInviteGuestTeacherDialog}
				readingEventProps={activeReadingEventProps}
			/>
			<ViewUsersDialog
				classId={activeReadingEventProps.class_id}
				isOpened={showingViewStudentsDialog}
				handleClose={closeViewStudentsDialog}
				userIDs={
					(_classes.find((x) => (x.class_id = activeReadingEventProps.class_id)) || {}).students
				}
				title={`Students in ${activeReadingEventProps.class_id}`}
				noneMsg='There are currently no students in this class'
			/>
			<CancelEventDialog
				isOpened={showingCancelEventDialog}
				handleClose={closeCancelEventDialog}
				readingEventProps={activeReadingEventProps}
			/>

			<Container maxWidth={false}>
				<Grid container>
					<Grid item xs={9} align='start'>
						<Box mt={3} mb={2}>
							<Typography variant='h3'>Reading Sessions</Typography>
						</Box>
					</Grid>
					{user_type === 'teacher' && (
						<Grid item xs={3} align='end'>
							<Box mt={2}>
								<LinkButton
									color='primary'
									variant='contained'
									size='large'
									component='button'
									href='/create-reading-session'
								>
									Create New Session
								</LinkButton>
							</Box>
						</Grid>
					)}
					<Grid item xs={12}>
						{readingSessions.length === 0 && (
							<Typography variant='body1'>You have no upcoming reading sessions.</Typography>
						)}
						{readingSessions.length > 0 && (
							<Typography variant='body1'>
								Your upcoming reading sessions. Please go through the Class Checklist before the
								event.
							</Typography>
						)}
						{error && <Alert severity='error'>{error}</Alert>}
						{success && <Alert severity='success'>{success}</Alert>}
						{isLoading && (
							<Typography align='center' component='div'>
								<CircularProgress />
							</Typography>
						)}
						<div className={classes.sessionsWrapper}>
							{readingSessionDraft && [readingSessionDraft].map(cardMapper)}
							{readingSessions.map(cardMapper)}
						</div>
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default ReadingSessionsView;
