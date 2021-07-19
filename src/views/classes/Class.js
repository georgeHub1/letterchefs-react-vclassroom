import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Container,
	Grid,
	Box,
	CircularProgress,
	Typography,
	ListSubheader,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';

import Page from '../../components/Page';
import LinkButton from '../../components/LinkButton';

import useGetClassDetails from '../class/ClassView/useGetClassDetails';

import { Http, tryAgainMsg } from '../../helpers';

const Class = () => {
	const { class_id } = useParams();
	const navigate = useNavigate();

	const { isLoading: loadingClass, error: loadingClassErr, classInfo } = useGetClassDetails(
		class_id
	);

	const [isLoadingStudents, setIsLoadingStudents] = useState(false);
	const [loadingStudentsErr, setLoadingStudentsErr] = useState('');
	const [students, setStudents] = useState([]);

	useEffect(() => {
		if (!classInfo.students) return setStudents([]);

		setIsLoadingStudents(true);
		const rq = Http().secureRequest({
			url: `/users?ids=${classInfo.students}`,
			successCallback: ({ status, data, error }) => {
				if (!status) {
					return setLoadingStudentsErr(error || 'Error loading the info of students');
				}
				setStudents(data);
			},
			errorCallback: () =>
				setLoadingStudentsErr('Unable to load the info of students. ' + tryAgainMsg()),
		});

		rq.finally(() => setIsLoadingStudents(false));
	}, [classInfo.students]);

	if (!classInfo) {
		return (
			<Page title='Class | Letterchefs'>
				<Grid container>
					<Container>
						<Box mb={3}>{loadingClass && <CircularProgress />}</Box>
						<Typography variant='subtitle1'>{loadingClassErr}</Typography>

						{loadingClassErr && (
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
						)}
					</Container>
				</Grid>
			</Page>
		);
	}

	return (
		<Page title={`${classInfo.name || 'Class'} | LetterChefs`}>
			<Container maxWidth={false}>
				{loadingClass && <CircularProgress />}
				{loadingClassErr && <Typography style={{ color: 'red' }}>{loadingClassErr}</Typography>}
				{classInfo.name && (
					<Grid container>
						<Grid item xs={9}>
							<Typography variant='h4' align='center' gutterBottom>
								Welcome to {classInfo.name}
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<LinkButton
								href='/classes'
								variant='contained'
								color='primary'
								size='large'
								fullWidth
							>
								Back to Classes
							</LinkButton>
						</Grid>

						<Grid item xs={12}>
							<Typography variant='body1' gutterBottom>
								{classInfo.description}
							</Typography>
						</Grid>

						<Grid item xs={6}>
							<List
								aria-labelledby='reading-events-list'
								subheader={
									<ListSubheader component='div' id='reading-events-list'>
										Reading Events
									</ListSubheader>
								}
							>
								{classInfo.reading_events.map((evt) => (
									<ListItem
										key={evt.id}
										button
										onClick={() => {
											navigate(`/classes/${class_id}/event/${evt.id}`);
										}}
									>
										<ListItemIcon>
											<SendIcon />
										</ListItemIcon>
										<ListItemText primary={evt.title} secondary={evt.start_date} />
									</ListItem>
								))}
							</List>
						</Grid>
						<Grid item xs={6}>
							{loadingStudentsErr && (
								<Typography style={{ color: 'red' }}>{loadingStudentsErr}</Typography>
							)}
							{isLoadingStudents && <CircularProgress />}
							{students.length > 0 && (
								<List
									aria-labelledby='students-list'
									subheader={
										<ListSubheader component='div' id='students-list'>
											Students
										</ListSubheader>
									}
								>
									{students.map((student) => (
										<ListItem key={student.id} button>
											<ListItemIcon>
												<SendIcon />
											</ListItemIcon>
											<ListItemText
												primary={(student.given_name || '') + ' ' + (student.family_name || '')}
												secondary={student.email}
											/>
										</ListItem>
									))}
								</List>
							)}
						</Grid>
					</Grid>
				)}
			</Container>
		</Page>
	);
};

export default Class;
