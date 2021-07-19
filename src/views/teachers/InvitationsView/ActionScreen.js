import React, { useState /*, useEffect */ } from 'react';
import { Navigate } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	CircularProgress,
	// colors,
	// Container,
	Grid,
	Icon,
	// IconButton,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core';

import Page from '../../../components/Page';
import Color from '../../../mixins/palette';
import useGetClassDetails from '../../class/ClassView/useGetClassDetails';
import { useGetRequest } from '../../../hooks/request';

import { Http, tryAgainMsg, userDetails } from '../../../helpers';

const useStyles = makeStyles((theme) => ({
	root: {
		// backgroundColor: theme.palette.background.dark,
		minHeight: '100vh',
		margin: 'auto',
		display: 'flex',
		background: Color.hex.grape,
	},
	actionsWrapper: {
		paddingTop: theme.spacing(3),
		display: 'flex',
		justifyContent: 'flex-end',
	},
	button: {
		margin: theme.spacing(1),
	},
	error: { color: 'red' },
}));

const GuestTeacherAccept = () => {
	const classes = useStyles();
	const { class_id } = useParams();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [status, setStatus] = useState('loading');

	const {
		isLoading: classInfoloading,
		error: classInfoLoadingError,
		classInfo,
	} = useGetClassDetails(class_id);

	const {
		isLoading: hostTeacherInfoLoading,
		error: hostTeacherInfoLoadingError,
		data: hostTeacherInfo,
	} = useGetRequest({
		url: classInfo.created_by ? `/users/${classInfo.created_by}` : '',
		falseStatusError: 'Could not get host teacher info',
		dataEmptyError: 'Host teacher does not exist',
		fetchError: 'Unable to read host teacher info',
		onComplete: () => setStatus(''),
	});

	const handleResponse = (type) => {
		if (!['accept', 'reject'].includes(type))
			return console.error('Type must be one of accept or reject');

		setIsLoading(true);
		setStatus(type === 'accept' ? 'Accepting' : 'Rejecting');
		const rq = Http().secureRequest({
			url: `/classes/invitations/${class_id}/${type}`,
			method: 'PATCH',
			successCallback: ({ status, error }) => {
				if (status) {
					return setStatus(`${type}ed`);
				}
				setError(error || `Could not ${type} invitation`);
				setStatus('errored');
			},
			errorCallback: () => setError(`Unable to ${type} invitation. ` + tryAgainMsg()),
		});
		rq.finally(() => setIsLoading(false));
	};

	const navigate = useNavigate();

	const handleNavigateDashboard = () => {
		console.log('go to dashboard');
		navigate('/app');
	};

	const handleNavigateMain = () => {
		navigate('/class');
	};

	const hasTeachers = (index) => {
		if (!classInfo || !classInfo[index]) return false;
		const teachersArray = classInfo[index].split(/\s*,+\s*/);
		return teachersArray.includes(userDetails.id + '');
	};

	const invited = hasTeachers('invited_teachers');
	// const notInvited = !invited;
	const alreadyAccepted = hasTeachers('teachers');
	const alreadyRejected = hasTeachers('rejected_teachers');

	const accepted = status === 'accepted';
	const rejected = status === 'rejected';
	// const errorOccured = status === 'errored';

	let message;

	const host_teacher_name = (
		(hostTeacherInfo.title || '') +
		' ' +
		(hostTeacherInfo.family_name || '')
	).trim();
	const guest_teacher_name = (
		(userDetails.title || '') +
		' ' +
		(userDetails.family_name || '')
	).trim();

	if (invited) {
		//not spcified
		message = `Hey ${guest_teacher_name}, ${host_teacher_name} invited you to co-host a live reading
		class for kids at ${classInfo.grade_level}, all happening on date, timezone. Please accept the
		invite and say you'll be there!`;
	}

	const busy = classInfoloading || hostTeacherInfoLoading || isLoading;
	if (busy) {
		message = (
			<Typography>
				<CircularProgress />
				{status}
			</Typography>
		);
	} else {
		if (rejected) {
			//rejected
			message = `You just rejected the invite. Someone is sad and crying a river right now.`;
		} else if (accepted) {
			//accepted = true
			message = `Thanks for accepting the invite from ${host_teacher_name}. You're on your way to join the next live reading session.`;
		}
	}

	const errorMessage = !busy && (classInfoLoadingError || hostTeacherInfoLoadingError || error);

	if (userDetails.user_type !== 'teacher') return <Navigate to='/404' />;

	const isInvited = !alreadyAccepted && !alreadyRejected && invited;

	return (
		<Page className={classes.root} title='Accept Invite As Guest Teacher'>
			<Grid
				container
				className={classes.root}
				justify='center'
				direction='column'
				alignItems='center'
			>
				<Grid item xs={6}>
					<Paper elevation={0} variant='outlined'>
						<Box pt={5} pr={5} pl={5}>
							<Typography variant='h6'>{message}</Typography>
						</Box>
						{errorMessage && (
							<Box pt={5} pr={5} pl={5}>
								<Typography variant='subtitle1' className={classes.error}>
									{errorMessage}
								</Typography>
							</Box>
						)}
						<Box pb={5} pr={5} pt={0}>
							{isInvited && !accepted && !rejected && (
								<section className={classes.actionsWrapper}>
									<Button
										className={classes.button}
										size='large'
										variant='outlined'
										onClick={() => handleResponse('reject')}
									>
										<Icon>close</Icon>
										No Thanks
									</Button>
									<Button
										className={classes.button}
										color='primary'
										size='large'
										variant='contained'
										onClick={() => handleResponse('accept')}
									>
										<Icon>done</Icon>
										Accept
									</Button>
								</section>
							)}

							<section className={classes.actionsWrapper}>
								{!isInvited && (
									<Button
										className={classes.button}
										size='large'
										variant='outlined'
										onClick={handleNavigateMain}
									>
										<Icon>close</Icon>
										AWW
									</Button>
								)}
								{(accepted || rejected) && (
									<Button
										className={classes.button}
										color='primary'
										size='large'
										variant='contained'
										onClick={handleNavigateDashboard}
									>
										<Icon>home</Icon>
										Go Home
									</Button>
								)}
							</section>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Page>
	);
};

export default GuestTeacherAccept;
