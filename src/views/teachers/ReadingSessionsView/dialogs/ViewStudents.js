import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	CircularProgress,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	Button,
	Typography,
} from '@material-ui/core';
import { Person as PersonIcon } from '@material-ui/icons';

import { Http, tryAgainMsg } from '../../../../helpers';

const ViewStudents = ({ classId, isOpened, handleClose, studentIDs }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrMsg] = useState('');

	const [students, setStudents] = useState([]);

	useEffect(() => {
		if (!studentIDs) return;

		setIsLoading(true);
		const rq = Http().secureRequest({
			url: `/users?ids=${studentIDs}`,
			successCallback: ({ status, data, error }) => {
				if (!status) {
					return setErrMsg(error || 'Error loading the info of students');
				}
				setStudents(data);
			},
			errorCallback: () => setErrMsg('Unable to load the info of students. ' + tryAgainMsg()),
		});

		rq.finally(() => setIsLoading(false));
	}, [studentIDs]);

	return (
		<Dialog open={isOpened} onClose={handleClose} aria-labelledby='edit-event-dialog'>
			<DialogTitle id='edit-event-dialog'>
				<Typography variant='h4'>Students{classId ? ` in ${classId}` : ''}</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{errMsg && (
						<span style={{ color: 'red' }} gutterBottom>
							{errMsg}
						</span>
					)}
				</DialogContentText>
				{isLoading && (
					<DialogContentText>
						<CircularProgress />
					</DialogContentText>
				)}
				{students.length === 0 && (
					<DialogContentText>There are no students in this class currently</DialogContentText>
				)}
			</DialogContent>
			{students.length > 0 && (
				<List>
					{students.map((student) => (
						<ListItem key={student.id}>
							<ListItemAvatar>
								<Avatar>
									<PersonIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={((student.given_name || '') + ' ' + (student.family_name || '')).trim()}
								secondary={student.email}
							/>
						</ListItem>
					))}
				</List>
			)}
			<DialogActions>
				<Button onClick={handleClose} color='primary' variant='outlined'>
					Back
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ViewStudents.propTypes = {
	classId: PropTypes.string,
	isOpened: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	studentIDs: PropTypes.array,
};

export default ViewStudents;
