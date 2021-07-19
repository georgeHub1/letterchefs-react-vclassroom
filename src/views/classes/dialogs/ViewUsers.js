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
import { Alert } from '@material-ui/lab';
import { Person as PersonIcon } from '@material-ui/icons';

import { Http, tryAgainMsg } from '../../../helpers';

const ViewUsers = ({ title, noneMsg, isOpened, handleClose, userIDs }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrMsg] = useState('');

	const [students, setStudents] = useState([]);

	useEffect(() => {
		if (!userIDs) {
			return setStudents([]);
		}

		setIsLoading(true);
		const rq = Http().secureRequest({
			url: `/users?ids=${userIDs}`,
			successCallback: ({ status, data, error }) => {
				if (!status) {
					return setErrMsg(error || 'Error loading the info of students');
				}
				setStudents(data);
			},
			errorCallback: () => setErrMsg('Unable to load the info of students. ' + tryAgainMsg()),
		});

		rq.finally(() => setIsLoading(false));
	}, [userIDs]);

	return (
		<Dialog open={isOpened} onClose={handleClose} aria-labelledby='edit-event-dialog'>
			<DialogTitle id='edit-event-dialog'>
				<Typography variant='h4'>{title}</Typography>
			</DialogTitle>
			<DialogContent>
				{errMsg && (
					<DialogContentText>
						<Alert severity='error'>{errMsg}</Alert>
					</DialogContentText>
				)}
				{isLoading && (
					<DialogContentText>
						<CircularProgress />
					</DialogContentText>
				)}
				{students.length === 0 && <DialogContentText>{noneMsg}</DialogContentText>}
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

ViewUsers.propTypes = {
	title: PropTypes.string,
	none: PropTypes.string,
	isOpened: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	userIDs: PropTypes.array,
};

export default ViewUsers;
