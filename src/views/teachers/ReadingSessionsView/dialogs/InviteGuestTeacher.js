import React, { useState, useCallback } from 'react';
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
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import InviteTeachers from '../../OnboardingView/InviteTeachers';

import { Http, tryAgainMsg } from '../../../../helpers';

const InviteGuestTeacher = ({ isOpened, handleClose, readingEventProps, onInvited }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrMsg] = useState('');

	const [invitedTeachers, setInvitedTeachers] = useState('');
	const updateInvitedTeachers = useCallback((e) => setInvitedTeachers(e.target.value), []);

	const handleSubmit = () => {
		const { class_id } = readingEventProps;
		if (!class_id)
			return setErrMsg('class_id must be sent in reading event props to invite a guest teacher');

		if (!invitedTeachers) return setErrMsg('Invited teachers was empty');

		setErrMsg('');
		setIsLoading(true);
		const readingScheduleCreate = Http().secureRequest({
			url: `/classes/invite/${class_id}`,
			method: 'PATCH',
			body: { teachers: invitedTeachers },
			successCallback: ({ status, /* data, */ error }) => {
				if (!status) {
					return setErrMsg(error || 'Error while inviting teachers to class');
				}
				onInvited();
				handleClose();
			},
			errorCallback: () => {
				return setErrMsg('Unable to invite teacher. ' + tryAgainMsg());
			},
		});

		readingScheduleCreate.finally(() => setIsLoading(false));
	};

	const classID = readingEventProps.class_id;

	return (
		<Dialog open={isOpened} onClose={handleClose} aria-labelledby='edit-event-dialog'>
			<DialogTitle id='invite-guest-teacher-dialog'>
				Invite A Guest Teacher{classID ? ` to ${classID}` : ''}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{errMsg && (
						<Alert component='body1' severity='error'>
							{errMsg}
						</Alert>
					)}
					{isLoading && <CircularProgress />}
				</DialogContentText>
				<InviteTeachers value={invitedTeachers} updateValue={updateInvitedTeachers} />
			</DialogContent>
			<DialogActions>
				<Box mb={5}>
					<Button onClick={handleClose} color='primary' variant='outlined'>
						Cancel
					</Button>
					<Button onClick={handleSubmit} color='primary' variant='contained'>
						Invite Guest Teacher
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
};

InviteGuestTeacher.defaultProps = { onInvited: () => {} };

InviteGuestTeacher.propTypes = {
	isOpened: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	readingEventProps: PropTypes.object.isRequired,
	onInvited: PropTypes.func,
};

export default InviteGuestTeacher;
