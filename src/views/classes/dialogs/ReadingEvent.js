import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	// Typography,
	CircularProgress,
	Button,
	Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import AddReadingSchedule from '../../teachers/ReadingSessionsView/AddReadingSchedule';
import useAddReadingSchedule from '../../teachers/ReadingSessionsView/useAddReadingSchedules';
import useAddClass from '../../teachers/ReadingSessionsView/useAddClass';

import { Http, tryAgainMsg } from '../../../helpers';

const ReadingEvent = ({ isOpened, isEdit, handleClose, readingEventProps, onDone }) => {
	const addReadingScheduleProps = useAddReadingSchedule(readingEventProps);
	const { gradeLevel, updateGradeLevel } = useAddClass({
		grade_level: readingEventProps.grade_level,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrMsg] = useState('');

	const handleSubmit = () => {
		const { id, class_id } = readingEventProps;
		if ((!id && isEdit) || !class_id)
			return setErrMsg('id and class_id must be sent in reading event props to add/edit an event');

		const {
			readingScheduleTitle,
			description,
			day,
			startTime,
			endTime,
			timezoneOffset,
			repeat,
			frequencyTime,
			frequencyType,
			dayRecurrence,
			repeatCount,
			isPublic,
			languages,
			_startDate,
		} = addReadingScheduleProps;

		setErrMsg('');

		if (!readingScheduleTitle) return setErrMsg('Title was empty');

		const durationHrs = ((endTime * 1 - startTime * 1) / (60 * 60 * 1000)).toFixed(2);
		if (durationHrs > 3) return setErrMsg('Duration must not be more than 3 hours');

		setIsLoading(true);
		const readingScheduleCreate = Http().secureRequest({
			url: `/reading-schedules${isEdit ? '/' + id : ''}`,
			method: 'PUT',
			body: {
				class_id,
				title: readingScheduleTitle,
				description,
				start_date: _startDate,
				start_time: startTime,
				end_time: endTime,
				timezone: timezoneOffset,
				repeat,
				frequency_time: frequencyTime,
				frequency_type: frequencyType,
				day_recurrence: dayRecurrence.join(','),
				languages: languages.join(','),
				repeat_count: repeatCount,
				is_public: isPublic * 1,
			},
			successCallback: ({ status, /* data, */ error }) => {
				if (!status) {
					return setErrMsg(
						error || `Error while ${isEdit ? 'updating' : 'adding'} reading schedule`
					);
				}

				onDone({
					id,
					class_id,
					title: readingScheduleTitle,
					day,
					startTime,
					endTime,
					timezone: timezoneOffset,
					repeat,
					frequencyTime,
					frequencyType,
					dayRecurrence,
					startDate: _startDate,
					isPublic,
					repeatCount,
					languages,
				});
				handleClose();
			},
			errorCallback: () => {
				return setErrMsg(`Unable to reach the server. ${tryAgainMsg()}`);
			},
		});

		readingScheduleCreate.finally(() => setIsLoading(false));
	};

	return (
		<Dialog open={isOpened} onClose={handleClose} aria-labelledby='edit-event-dialog'>
			<DialogTitle id='edit-event-dialog'>
				<Typography variant='h4'>Update Reading Session</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>{errMsg && <Alert severity='error'>{errMsg}</Alert>}</DialogContentText>
				{isLoading && (
					<DialogContentText>
						<CircularProgress />
					</DialogContentText>
				)}
				<AddReadingSchedule
					{...{ ...addReadingScheduleProps, gradeLevel, updateGradeLevel }}
					isDialog={true}
				/>
			</DialogContent>
			<DialogActions>
				<Box mb={2} mt={2} mr={2}>
					<Button onClick={handleClose} color='primary' variant='outlined'>
						Cancel
					</Button>
				</Box>
				<Box mb={2} mt={2}>
					<Button onClick={handleSubmit} color='primary' variant='contained'>
						{isEdit ? 'Edit' : 'Add'} Event
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
};

ReadingEvent.defaultProps = { onDone: () => {} };

ReadingEvent.propTypes = {
	isOpened: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	readingEventProps: PropTypes.object.isRequired,
	onDone: PropTypes.func,
};

export default ReadingEvent;
