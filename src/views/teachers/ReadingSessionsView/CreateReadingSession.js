import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	Container,
	Grid,
	makeStyles,
	// Paper,
	Step,
	StepLabel,
	Stepper,
	Typography,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	// DialogContentText,
	DialogActions,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import * as moment from 'moment-timezone';
import { common, green, red } from '@material-ui/core/colors';
import Page from '../../../components/Page';

import Color from '../../../mixins/palette';

// Steps
// import AddClass from './AddClass';
import AddReadingSchedule from './AddReadingSchedule';
import InviteTeacher from './InviteTeacher';
import TicketingDetails from './TicketingDetails';
import EditProfile from '../../account/AccountView/ProfileDetails';

import useAddClass from './useAddClass';
import useAddReadingSchedule from './useAddReadingSchedules';
import useTicketingDetails from './useTicketDetails';
import useStripeSetupButton from '../../account/AccountView/useStripeSetupButton';
import useDialog from '../../../hooks/useDialog';

import { readingEventStoreName, hasLocalStorage } from '../../../config';
import { Http, tryAgainMsg, userDetails } from '../../../helpers';

const {
	title,
	given_name,
	family_name,
	email,
	stripe_customer_id,
	stripe_account_id,
} = userDetails;

const mustSetupStripe = !stripe_customer_id || !stripe_account_id;

const useStylesStepper = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	navButton: {
		marginRight: theme.spacing(1),
		alignItems: 'flex-end',
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	stepButton: {
		justifyContent: 'flex-end',
		display: 'flex',
		flexDirection: 'row',
		marginBottom: theme.spacing(2),
	},
}));

const useStyles = makeStyles((/* theme */) => ({
	root: {
		background: Color.ombre.fog,
		minHeight: '100vh',
		margin: 0,
		width: '100%',
	},
	container: {
		background: common.white,
	},
	err: { color: red[500] },
	success: { color: green[500] },
}));

// function getStepContent(stepIndex) {
// 	switch (stepIndex) {
// 		case 0:
// 			return {
// 				mission: 'Create Class Schedule',
// 				reason: 'Select a class this event is for',
// 			};
// 		case 1:
// 			return {
// 				mission: 'Invite Guest Teacher',
// 				reason: 'You and your students will get email reminders of class.',
// 			};
// 		case 2:
// 			return {
// 				mission: 'Payout Details',
// 				reason: 'Invite another teacher to participate in this class.',
// 			};
// 		default:
// 			return 'Unknown step. Try refreshing the page to clear error.';
// 	}
// }

const steps = ['Create Class Schedule', 'Invite Guest Teacher', 'Payout Details'];

const Classes = () => {
	const cssClasses = useStyles();
	const classes = useStylesStepper();
	const navigate = useNavigate();

	const {
		error: stripeError,
		connectError: stripeConnectError,
		success: stripeSuccess,
		button: stripeBtn,
	} = useStripeSetupButton();

	const [mustEditProfile, setMustEditProfile] = useState(false);

	const [isEditProfileModalOpened, openEditProfileModal, closeEditProfileModal] = useDialog();
	const handleCloseEditProfileModal = useCallback(() => {
		closeEditProfileModal();
		if (!title || !given_name || !family_name || !email) setMustEditProfile(true);
	}, [closeEditProfileModal]);

	useEffect(() => {
		if (!title || !given_name || !family_name || !email) openEditProfileModal();
	}, [openEditProfileModal]);

	const [classID, setClassID] = useState('');
	const [evtID, setEvtID] = useState('');

	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrorMessage] = useState('');
	const [errMsg2, setErrorMessage2] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	// const [fieldErrors, setFieldErrors] = useState('');
	const fieldErrors = '';

	const [invitedTeacher, setInvitedTeacher] = useState('');
	const updateInvitedTeacher = (e) => setInvitedTeacher(e.target.value);

	const [previousValues, setPreviousValues] = useState({});

	// states of Step 0 (Create Your Class room)
	const addClassProps = useAddClass({ grade_level: previousValues.grade_level });
	const { gradeLevel, updateGradeLevel } = addClassProps;

	const ticketingDetailsProps = useTicketingDetails();
	const { price, currency } = ticketingDetailsProps;

	const [isLoadingExistingClasses, setIsLoadingExistingClasses] = useState(false);
	const [existingClassesError, setExistingClassesError] = useState('');

	const [existingClasses, setExistingClasses] = useState([]);

	useEffect(() => {
		setIsLoadingExistingClasses(true);
		const rq = Http().secureRequest({
			url: '/classes',
			successCallback: ({ status, data, error }) => {
				if (!status) {
					setExistingClassesError(error || 'Could not set existing classes');
					return;
				}

				if (data.length > 0) {
					setExistingClasses(data);
				}
			},
			errorCallback: () => {
				//setExistingClassesError('Unable to get existing classes. ' + tryAgainMsg()),
				setIsLoadingExistingClasses(false);
				return;
			},
		});
		rq.finally(() => setIsLoadingExistingClasses(false));

		if (hasLocalStorage) {
			const prevs = JSON.parse(window.localStorage.getItem(readingEventStoreName) || '{}');
			if (prevs.title || prevs.description || prevs.grade_level || prevs.day_recurrence) {
				setPreviousValues({ ...prevs, start_date: prevs._startDate });
			}
		}
	}, []);

	useEffect(() => {
		const classID = (existingClasses.find((x) => x.grade_level === gradeLevel) || {}).class_id;
		if (classID) setClassID(classID);
	}, [gradeLevel, existingClasses]);

	const readingSchedulesProps = useAddReadingSchedule(previousValues);
	const {
		// arrayofStorytimes,
		generateArrayOfStorytimes,
		readingScheduleTitle,
		description,
		// isDate,
		day,
		setDay,
		startTime,
		endTime,
		duration,
		timezoneOffset,
		timezoneFancy,
		repeat,
		languages,
		frequencyTime,
		frequencyType,
		repeatCount,
		dayRecurrence,
		isPublic,
		_startDate,
		arrayOfStorytimes
	} = readingSchedulesProps;

	const sessionDate = [];
	arrayOfStorytimes.forEach(el => {
		const date = moment(el.start).tz(moment.tz.guess()).format('ddd, MMM Do YYYY, h:mm') + ' - ' + moment(el.end).tz(moment.tz.guess()).format('h:mma (z)')
		sessionDate.push(date)
	});

	const [activeStep, setActiveStep] = useState(0);
	const handleNext = (e) => {
		e.preventDefault();

		setErrorMessage('');
		setErrorMessage2('');

		if (activeStep === 0) {
			// Add reading schedule

			if (!readingScheduleTitle) {
				return setErrorMessage('Title was left empty!');
			}
			if (readingScheduleTitle.length > 32) {
				return setErrorMessage('Title should not be more than 32 characters long!');
			}
			if (!_startDate) {
				return setErrorMessage('Start date was left empty!');
			}
			if (!startTime) {
				return setErrorMessage('Start time was left empty!');
			}
			if (!endTime) {
				return setErrorMessage('End time was left empty!');
			}
			if (!timezoneOffset) {
				return setErrorMessage('Timezone was left empty! ' + timezoneOffset);
			}

			if (!languages.length) {
				return setErrorMessage('No language was selected');
			}
			if (languages.length > 2) {
				return setErrorMessage('Max 2 languages.');
			}
			if (duration < 10 * 60 * 1000) {
				return setErrorMessage('End time must be greater than start time by at least 10 min!');
			}
			if (duration > 3 * 60 * 60 * 1000) {
				return setErrorMessage('End time must not be 3 hours greater than start time!');
			}
			if (parseInt(repeatCount) !== repeatCount * 1) {
				return setErrorMessage('Repeat count must be a whole number');
			}

			// const durationHrs = ((endTime * 1 - startTime * 1) / (60 * 60 * 1000)).toFixed(2);
			// if (durationHrs > 3) {
			// 	return setErrorMessage('Duration must not be more than 3 hours');
			// }

			setIsLoading(true);
			const errorCallbackMessage = `Unable to reach the server. ${tryAgainMsg()}`;
			const readingScheduleCreate = Http().secureRequest({
				url: '/reading-schedules',
				method: 'PUT',
				body: {
					title: readingScheduleTitle,
					description,
					start_date: _startDate,
					start_time: startTime,
					end_time: endTime,
					timezone: timezoneOffset,
					repeat,
					languages: languages.join(','),
					frequency_time: frequencyTime,
					frequency_type: frequencyType,
					repeat_count: repeatCount,
					day_recurrence: dayRecurrence.join(','),
					sessions_date: sessionDate,
					is_public: isPublic * 1,
					...(classID ? { class_id: classID } : { class_grade_level: gradeLevel }),
				},
				successCallback: ({ status, data, error }) => {
					if (!status) {
						return setErrorMessage(error || 'Error while creating reading schedule');
					}

					setClassID(data.class_id);
					setEvtID(data.id);
					setActiveStep(1);

					setSuccessMessage('Reading schedule created Successfully');
					const timer = setTimeout(() => {
						setSuccessMessage('');
						clearTimeout(timer);
					}, 2000);
					if (hasLocalStorage) {
						window.localStorage.removeItem(readingEventStoreName);
					}
				},
				errorCallback: () => {
					return setErrorMessage(errorCallbackMessage);
				},
			});

			readingScheduleCreate.finally(() => setIsLoading(false));
		}

		if (activeStep === 1) {
			if (!invitedTeacher) return setActiveStep(2);
			setIsLoading(true);
			const teacherInvite = Http().secureRequest({
				url: `/classes/invite/${classID}`,
				method: 'PATCH',
				body: { teachers: invitedTeacher },
				successCallback: ({ status, /* data, */ error }) => {
					if (!status) {
						setErrorMessage(error || 'Error while inviting teacher to class');
						return;
					}
					setActiveStep(2);
				},
				errorCallback: () => setErrorMessage('Unable to invite teacher. ' + tryAgainMsg()),
			});
			teacherInvite.finally(() => setIsLoading(false));
		}

		if (activeStep === 2) {
			setIsLoading(true);
			const createTicket = Http().secureRequest({
				url: `/reading-schedules/publish/${evtID}`,
				method: 'PATCH',
				body: { currency, price },
				successCallback: ({ status, /* data, */ error }) => {
					if (!status) {
						setErrorMessage('Error while publishing reading event. ' + error);
						return;
					}
					const timer = setTimeout(() => {
						navigate('/app/reading-sessions');
						clearTimeout(timer);
					}, 1200);
				},
				errorCallback: () => setErrorMessage('Unable to publish reading event. ' + tryAgainMsg()),
			});
			createTicket.finally(() => setIsLoading(false));
		}
	};
	const handleBack = useCallback(() => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	}, []);
	const handleReset = useCallback(() => {
		setActiveStep(0);
	}, []);

	// const { mission, reason } = getStepContent(activeStep);
	const HorizontalLabelPositionBelowStepper = () => {
		const { root: rootClass, instructions, stepButton, navButton } = classes;
		const isFinalStep = activeStep === steps.length - 1;

		return (
			<div className={rootClass}>
				<Dialog
					open={isEditProfileModalOpened}
					onClose={handleCloseEditProfileModal}
					aria-labelledby='profile-edit-dialog'
				>
					<DialogTitle id='profile-edit-dialog'>
						<Typography variant='h4'>Edit your profile</Typography>
					</DialogTitle>
					<DialogContent>
						<EditProfile />
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseEditProfileModal} color='primary' variant='outlined'>
							Cancel
						</Button>
					</DialogActions>
				</Dialog>

				<Container>
					<Stepper activeStep={activeStep} alternativeLabel>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					<div className={classes.root}>
						{activeStep === steps.length ? (
							<Box>
								<Typography className={instructions}>All steps completed</Typography>
								<Button type='reset' onClick={handleReset} disabled={isLoading}>
									Reset
								</Button>
							</Box>
						) : (
								<div>
									{fieldErrors && <Alert severity='error'>{fieldErrors}</Alert>}
									<div className={stepButton}>
										<Button
											className={navButton}
											color='primary'
											disabled={activeStep === 0 || isLoading}
											size='large'
											onClick={handleBack}
										>
											Back
									</Button>
										<Button
											type='submit'
											className={navButton}
											variant='contained'
											color='primary'
											size='large'
											onClick={handleNext}
											disabled={isLoading}
										>
											{isFinalStep ? 'Publish' : 'Next'}
										</Button>
									</div>
								</div>
							)}
					</div>
				</Container>
			</div>
		);
	};

	useEffect(() => {
		if (hasLocalStorage) {
			if (readingScheduleTitle || description || gradeLevel || dayRecurrence.length > 0) {
				localStorage.setItem(
					readingEventStoreName,
					JSON.stringify({
						title: readingScheduleTitle,
						description,
						start_date: _startDate,
						start_time: startTime,
						end_time: endTime,
						timezoneOffset,
						timezoneFancy,
						repeat,
						languages,
						frequency_time: frequencyTime,
						frequency_type: frequencyType,
						is_public: isPublic,
						repeat_count: repeatCount,
						day_recurrence: dayRecurrence,
						grade_level: gradeLevel,
					})
				);
			}
		}
	}, [
		readingScheduleTitle,
		description,
		day,
		setDay,
		startTime,
		endTime,
		timezoneOffset,
		timezoneFancy,
		repeat,
		languages,
		frequencyTime,
		frequencyType,
		isPublic,
		repeatCount,
		dayRecurrence,
		gradeLevel,
		_startDate,
	]);

	return (
		<Page title='Create Reading Schedule | Live Reading Classes | LetterChefs'>
			<div className={cssClasses.root} id='here'>
				{/* isLoading && (
					<Box align='center' p={2}>
						<CircularProgress />
					</Box>
				) */}
				{
					/*!isLoading && (*/
					<Grid container spacing={5} display='flex' justify='center'>
						<Grid item xs={12} md={10} lg={8}>
							<Box p={4} className={cssClasses.container}>
								{mustEditProfile && (
									<Alert severity='info'>
										To create a reading session, you need to{' '}
										<Button
											onClick={() => {
												setMustEditProfile(false);
												openEditProfileModal();
											}}
										>
											Edit profile
										</Button>
									</Alert>
								)}
								{mustSetupStripe && (
									<Box p={2}>
										<Typography variant='h3' className={classes.margin}>
											Payouts
										</Typography>
										{stripeError && <Alert severity='error'>{stripeError}</Alert>}
										{stripeConnectError && <Alert severity='error'>{stripeConnectError}</Alert>}
										{stripeSuccess && <Alert severity='error'>{stripeSuccess}</Alert>}
										{!stripeError && !stripeConnectError && !stripeSuccess && (
											<Fragment>
												<Alert severity='info'>
													To create a reading session, you need to setup payouts so we can pay you.
												</Alert>
												<Typography variant='body1' className={classes.margin}>
													Our partner, Stripe Payments, handles payments to our storytellers. We
													will now lead you through setting up an account with Stripe.
												</Typography>
											</Fragment>
										)}
										<Button align='right'>{stripeBtn}</Button>
									</Box>
								)}
								{!mustEditProfile && !mustSetupStripe && (
									<div>
										<HorizontalLabelPositionBelowStepper
											{...{ activeStep, handleNext, handleBack, handleReset }}
										/>
										<Container>
											<Box mb={3}>
												{typeof errMsg === 'string' && errMsg && (
													<Alert severity='error'>{errMsg}</Alert>
												)}
												{errMsg2 && <Alert severity='error'>{errMsg2}</Alert>}
												{existingClassesError && (
													<Alert severity='error'>{existingClassesError}</Alert>
												)}
												{isLoadingExistingClasses && <CircularProgress />}
											</Box>
										</Container>
										{successMessage && <Alert severity='success'>{successMessage}</Alert>}

										{activeStep === 0 && (
											<AddReadingSchedule
												{...{
													...readingSchedulesProps,
													gradeLevel,
													updateGradeLevel,
													generateArrayOfStorytimes,
												}}
											/>
										)}
										{activeStep === 1 && (
											<InviteTeacher value={invitedTeacher} updateValue={updateInvitedTeacher} />
										)}
										{activeStep === 2 && <TicketingDetails {...ticketingDetailsProps} />}
									</div>
								)}
							</Box>
						</Grid>
					</Grid>
				}
			</div>
		</Page>
	);
};

export default Classes;
