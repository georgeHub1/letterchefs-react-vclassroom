import React, { Fragment, useState, useEffect, useCallback } from 'react';
// import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';

import {
	Box,
	Button,
	ButtonBase,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Container,
	Divider,
	Grid,
	Icon,
	IconButton,
	Link,
	makeStyles,
	// Modal,
	// Paper,
	Popover,
	Typography,
} from '@material-ui/core';
// import { red } from '@material-ui/core/colors';
import Page from '../../components/Page';

import InviteGuestTeacherDialog from '../teachers/ReadingSessionsView/dialogs/InviteGuestTeacher';
import ViewUsersDialog from './dialogs/ViewUsers';
// import ReadingEventDialog from './dialogs/ReadingEvent';

import { Http, tryAgainMsg } from '../../helpers';
import LinkButton from '../../components/LinkButton';
// import { userDetails } from '../../helpers/';
import MountainScene from '../../assets/svg/mountain-scenery-background.svg';
import ThreeTags from '../../assets/svg/three-tags.svg';
import ScenicBackground from '../../assets/svg/scenic-background.svg';

const useStyles = makeStyles((theme) => ({
	classRoot: {
		minHeight: '100%',
		width: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
	actionButtons: {
		display: 'flex',
		justifySelf: 'flex-end',
	},
	actionContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		flexGrow: 1,
	},
	cardContent: {
		minHeight: 160,
		overflowy: 'scroll',
	},
	classIcon: {
		display: 'flex',
		flexWrap: 'nowrap',
		alignItems: 'center',
	},
	paper: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
	},
	scene: {
		width: '100%',
		height: 200,
		overflow: 'hidden',
	},
	sceneImage: {
		width: '100%',
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
	},
	section: {
		display: 'flex',
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
	symbol: {
		width: 60,
		textAlign: 'center',
	},
}));

const useDialog = (opened = false) => {
	const [showingDialog, setShowingDialog] = useState(opened);
	const openDialog = useCallback(() => setShowingDialog(true), []);
	const closeDialog = useCallback(() => setShowingDialog(false), []);

	return [showingDialog, openDialog, closeDialog];
};

const ReadingSessionsView = () => {
	const cssClasses = useStyles();
	// const { user_type } = userDetails;
	const cardHeroArray = [MountainScene, ThreeTags, ScenicBackground];

	// const [customers] = useState(data);

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const [classes, setClasses] = useState([]);

	const [activeClassProps, setActiveClassProps] = useState({});

	console.log('error', error, 'loading', loading);

	useEffect(() => {
		setLoading(true);
		const { secureRequest, abort } = Http();
		const req = secureRequest({
			url: '/classes',
			successCallback: ({ status, data, error }) => {
				if (!status) {
					return setError(error || 'Error while looking up classes');
				}

				setClasses(data);
			},
			noContent: () => {},
			errorCallback: () => setError('Could not connect to the server. ' + tryAgainMsg()),
		});

		req.finally(() => setLoading(false));

		// clean up
		return () => {
			abort();
		};
	}, []);

	const [anchorEl, setAnchorEl] = useState(null);
	const handleClickPopover = (event) => setAnchorEl(event.currentTarget);
	const handleClosePopover = useCallback(() => setAnchorEl(null), []);

	const open = Boolean(anchorEl);
	const id = open ? 'actions-popover' : undefined;

	const [
		showingInviteGuestTeacherDialog,
		openInviteGuestTeacherDialog,
		closeInviteGuestTeacherDialog,
	] = useDialog();
	const [showingViewUsersDialog, openViewUsersDialog, closeViewUsersDialog] = useDialog();
	const [showingAddEventDialog, openAddEventDialog, closeAddEventDialog] = useDialog();

	const br = 0;

	if (br) {
		showingAddEventDialog();
		closeAddEventDialog();
	}

	const [usersDialogProps, setUserDialogProps] = useState({});

	const getCount = (str) => (str || '').split(/\s*,\s*/).filter((x) => x.length > 0).length;

	var ClassInfo = ({ title, content, symbol, classTitle, onClick }) => {
		const classContent = (
			<div className={classes.section}>
				<Typography variant='body2' className={classTitle}>
					{title}: {content}
				</Typography>
			</div>
		);
		return (
			<Fragment>
				{typeof onClick === 'function' ? (
					<div className={cssClasses.classIcon}>
						<Button onClick={onClick}>
							<Icon>{symbol}</Icon>
						</Button>
						{classContent}
					</div>
				) : (
					<div className={cssClasses.classIcon}>
						<Icon className={cssClasses.symbol}>{symbol}</Icon>
						{classContent}
					</div>
				)}
			</Fragment>
		);
	};
	const navigate = useNavigate();
	const navigateToClass = (classUrl) => {
		return () => {
			navigate(classUrl);
		};
	};

	// const handleAddEventCallback = () => {};

	return (
		<Page
			className={cssClasses.classesRoot}
			title='List of Classes | LetterChefs | Live Reading Classes'
		>
			<InviteGuestTeacherDialog
				classId={activeClassProps.class_id}
				isOpened={showingInviteGuestTeacherDialog}
				handleClose={closeInviteGuestTeacherDialog}
				readingEventProps={{ class_id: activeClassProps.class_id }}
			/>
			<ViewUsersDialog
				{...usersDialogProps}
				isOpened={showingViewUsersDialog}
				handleClose={closeViewUsersDialog}
			/>
			<Box mb={5}>
				<Container maxWidth={false}>
					<Grid container>
						<Grid item xs={9} align='start'>
							<Box mt={3} mb={2}>
								<Typography variant='h3'>Classes</Typography>
							</Box>
						</Grid>
						{/*user_type === 'teacher' && (
							<Grid item xs={3} align='end'>
								<Box mt={2}>
									<LinkButton
										variant='contained'
										size='large'
										component='button'
										href='/onboarding/'
									>
										Create New Class
									</LinkButton>
								</Box>
							</Grid>
						)*/}
						<Grid item xs={12}>
							{classes.length === 0 && (
								<Box mb={5}>
									<Typography variant='body1' gutterBottom>
										You have not created any classes yet.
									</Typography>
								</Box>
							)}
							{classes.length > 0 && (
								<Box mb={5}>
									<Typography variant='body1' gutterBottom>
										Each of your classes caters to a specific grade level and age group.
									</Typography>
								</Box>
							)}
							<Grid container spacing={2}>
								{classes.map(({ class_id, ...currentClass }, index) => {
									return (
										<Grid item xs={12} sm={6} lg={3} key={index}>
											<Card>
												<CardActionArea>
													<ButtonBase onClick={navigateToClass(`/classes/${class_id}`)}>
														<CardMedia
															component='img'
															alt='Background Scene'
															height='240'
															image={cardHeroArray[index % cardHeroArray.length]}
															title='Background Scene'
														/>
													</ButtonBase>
													<CardContent className={cssClasses.cardContent}>
														{currentClass.name.length > 0 && (
															<Typography variant='h6' className={cssClasses.link}>
																<Link href={`/classes/${class_id}`}>{currentClass.name} </Link>
															</Typography>
														)}
														<ClassInfo
															symbol='equalizer'
															title='Level'
															content={`${currentClass.grade_level
																.substr(0, 1)
																.toUpperCase()}${currentClass.grade_level.substr(1)}`}
														/>
														{getCount(currentClass.teachers) > 0 && (
															<ClassInfo
																symbol='escalator_warning'
																title='Guest Teacher'
																content={getCount(currentClass.teachers)}
																onClick={() => {
																	setUserDialogProps({
																		title: `Guest teacher in ${class_id}`,
																		noneMsg: 'There is no guest teacher in this class',
																		userIDs: currentClass.teachers,
																	});
																	setActiveClassProps(currentClass);
																	openViewUsersDialog();
																}}
															/>
														)}
														{getCount(currentClass.pending_teachers) > 0 && (
															<ClassInfo
																symbol='person'
																title='Guest Teacher'
																content={getCount(currentClass.pending_teachers)}
															/>
														)}
														<ClassInfo
															symbol='group'
															title='Students'
															content={getCount(currentClass.students)}
															onClick={() => {
																setUserDialogProps({
																	title: `Students in ${class_id}`,
																	noneMsg: 'There are currently no students in this class',
																	userIDs: currentClass.students,
																});
																setActiveClassProps(currentClass);

																openViewUsersDialog();
															}}
														/>
														{getCount(currentClass.pending_students) > 0 && (
															<ClassInfo
																icon='person'
																title='Invited Students'
																content={getCount(currentClass.pending_students)}
																onClick={() => {
																	setUserDialogProps({
																		title: `Invited Students in ${class_id}`,
																		noneMsg: 'No pending students in this class',
																		userIDs: currentClass.pending_students,
																	});
																	setActiveClassProps(currentClass);
																	openViewUsersDialog();
																}}
															/>
														)}

														{currentClass.description.length > 0 && (
															<Typography variant='body2' className={cssClasses.link}>
																{currentClass.class_description}
															</Typography>
														)}
													</CardContent>
													<Divider />
													<CardActions>
														<Button
															size='small'
															color='primary'
															variant='outlined'
															onClick={openInviteGuestTeacherDialog}
														>
															Invite Guest Teacher
														</Button>
														<LinkButton
															size='small'
															color='primary'
															variant='contained'
															href={`/classes/${class_id}`}
														>
															Go To Class
														</LinkButton>
														<div className={cssClasses.actionContainer}>
															<IconButton
																aria-describedby={`${id}`}
																variant='contained'
																onClick={handleClickPopover}
																className={cssClasses.actionButtons}
															>
																<Icon>more_vert</Icon>
															</IconButton>

															<Popover
																id={id}
																open={open}
																anchorEl={anchorEl}
																onClose={handleClosePopover}
																anchorOrigin={{
																	vertical: 'bottom',
																	horizontal: 'center',
																}}
																transformOrigin={{
																	vertical: 'top',
																	horizontal: 'center',
																}}
															>
																<Box m={1}>
																	<Button
																		onClick={() => {
																			setActiveClassProps(currentClass);
																			openAddEventDialog();
																		}}
																	>
																		Add a Reading Event
																	</Button>
																</Box>
																<Divider />

																<Box m={1}>
																	<Button onClick={() => {}} fullWidth>
																		Edit Class
																	</Button>
																</Box>
																<Divider />

																<Box m={1}>
																	<Button
																		fullWidth
																		className={classes.cancelEvent}
																		onClick={() => {}}
																	>
																		Delete Class
																	</Button>
																</Box>
															</Popover>
														</div>
													</CardActions>
												</CardActionArea>
											</Card>
										</Grid>
									);
								})}
							</Grid>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</Page>
	);
};

export default ReadingSessionsView;
