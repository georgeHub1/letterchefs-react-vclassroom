import React, { useState, useEffect, useCallback } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	Container,
	Grid,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { red } from '@material-ui/core/colors';
import Page from '../../../components/Page';
import Color from '../../../mixins/palette';

import { Http, tryAgainMsg } from '../../../helpers';
import LinkButton from '../../../components/LinkButton';
import { userDetails } from '../../../helpers/';

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
	sessionsContainer: {
		display: 'flex',
		width: '100%',
	},
	cancelEvent: {
		color: red[500],
	},
	dateContainer: {
		width: 100,
		justifyContent: 'center',
		textAlign: 'center',
		marginRight: theme.spacing(2),
	},
	detailsContainer: {
		position: 'relative',
		flexGrow: 1,
	},
	paper: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
	},
	gradeLevel: {
		display: 'flex',
		paddingTop: theme.spacing(3),
	},
	link: {
		fontWeight: theme.typography.fontWeightRegular,
	},
	linkContainer: {
		color: Color.hex.blue,
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'none',
		},
	},
}));

const ReadingSessionsView = () => {
	const classes = useStyles();
	const { user_type } = userDetails;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [invitations, setInvitations] = useState([]);
	useEffect(() => {
		setIsLoading(true);
		const rq = Http().secureRequest({
			url: '/classes/invitations',
			successCallback: ({ status, data, error }) => {
				if (!status) {
					setError(error || 'Could not read pending invitations');
					return;
				}

				setInvitations(data);
			},
			errorCallback: () => setError('Unable to reach the server. ' + tryAgainMsg()),
		});
		rq.finally(() => setIsLoading(false));
	}, []);

	const handleInviteAction = useCallback((e) => {
		const classID = e.currentTarget.getAttribute('data-class-id');
		const action = e.currentTarget.getAttribute('data-invite-action');

		const setIsLoading = (val) =>
			setInvitations((data) => {
				const invites = [...data];
				const curInviteInd = invites.findIndex((i) => i.class_id === classID);
				if (curInviteInd > -1) {
					invites[curInviteInd][action] = val;
				}
				return invites;
			});

		setIsLoading(true);

		const rq = Http().secureRequest({
			url: `/classes/invitations/${classID}/${action}`,
			method: 'PATCH',
			successCallback: ({ status, error }) => {
				if (!status) {
					setError(error || `Could not ${action} invitation`);
					return;
				}

				setInvitations((data) => {
					const invites = [...data];
					const curInviteInd = invites.findIndex((i) => i.class_id === classID);
					if (curInviteInd > -1) {
						invites.splice(curInviteInd, 1);
					}
					return invites;
				});
			},
			errorCallback: () => setError('Unable to reach the server. ' + tryAgainMsg()),
		});
		rq.finally(() => setIsLoading(false));
	}, []);

	return (
		<Page className={classes.root} title='Pending Invitations | LetterChefs'>
			<Container maxWidth={false}>
				<Grid container>
					<Grid item xs={9} align='start'>
						<Box mt={3} mb={2}>
							<Typography variant='h3'>Invitations</Typography>
						</Box>
					</Grid>
					{user_type === 'teacher' && (
						<Grid item xs={3} align='end'>
							<Box mt={2}>
								{/* <LinkButton
									color='primary'
									variant='contained'
									size='large'
									component='button'
									href='/create-reading-session'
								>
									Create New Session
                </LinkButton> */}
							</Box>
						</Grid>
					)}
					<Grid item xs={12}>
						{invitations.length === 0 && (
							<Typography variant='body1'>You have no invitations.</Typography>
						)}
						{invitations.length > 0 && (
							<Typography variant='body1'>Your pending invitations.</Typography>
						)}
						{isLoading && <CircularProgress />}
						{error && <Alert severity='error'>{error}</Alert>}
						<div className={classes.sessionsWrapper}>
							{invitations.map((invite, index) => {
								return (
									<div className={classes.sessionsContainer} key={index}>
										<Paper className={classes.paper}>
											<div className={classes.dateContainer}></div>
											<div className={classes.detailsContainer}>
												<Typography variant='h5' className={classes.link}>
													<LinkButton
														variant='text'
														href={`/invitations/${invite.class_id}`}
														className={classes.linkContainer}
													>
														{invite.name}
													</LinkButton>
												</Typography>
												{invite.description && (
													<Typography className={classes.link}>{invite.description}</Typography>
												)}
												<Typography variant='body2' className={classes.gradeLevel}>
													Grade Level: {invite.grade_level}
												</Typography>
											</div>

											<Button
												data-class-id={invite.class_id}
												data-invite-action='accept'
												onClick={handleInviteAction}
												disabled={!!invite.accept}
											>
												{invite.accept ? <CircularProgress /> : 'Accept'}
											</Button>
											<Button
												className={classes.cancelEvent}
												data-class-id={invite.class_id}
												data-invite-action='reject'
												onClick={handleInviteAction}
												disabled={!!invite.reject}
											>
												{invite.reject ? <CircularProgress /> : 'Decline'}
											</Button>
										</Paper>
									</div>
								);
							})}
						</div>
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default ReadingSessionsView;
