import React, { useState, useCallback } from 'react';
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
	// CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { common, green, red } from '@material-ui/core/colors';
import Page from '../../../components/Page';

// Steps
import AddClass from './AddClass';
import useAddClass from './useAddClass';
import InviteTeachers from './InviteTeachers';
import AddReadingSchedule from './AddReadingSchedule';
import useAddReadingSchedule from './useAddReadingSchedules';

import { Http, tryAgainMsg, getUserDetails, saveUserDetails, userID } from '../../../helpers';
import Color from '../../../mixins/palette';

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

function getStepContent(stepIndex) {
	switch (stepIndex) {
		case 0:
			return {
				mission: 'Info about your class',
				reason: 'Tell us about you so that we can create your event.',
			};
		case 1:
			return {
				mission: 'Invite A Guest Teacher',
				reason: 'Invited Guest Teacher will be able to access your class and students info.',
			};
		case 2:
			return {
				mission: 'Create Reading Schedule',
				reason: 'You and your students will get email reminders of class.',
			};
		default:
			return 'Unknown step. Try refreshing the page to clear error.';
	}
}

const steps = ['About Your Event', 'Invite A Guest Teacher', 'Create Reading Schedule'];

const Classes = () => {
	const cssClasses = useStyles();
	const classes = useStylesStepper();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrorMessage] = useState('');
	const [errMsg2, setErrorMessage2] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	// const [fieldErrors, setFieldErrors] = useState('');
	const fieldErrors = '';

	const [isSuggestingClassIDs, setIsSuggestingClassIDs] = useState(false);
	const [suggestedClassIDs, setSuggestedClassIDs] = useState([]);

	const [invitedTeachers, setInvitedTeachers] = useState('');
	const updateInvitedTeachers = (e) => setInvitedTeachers(e.target.value);

	const [classCreated, setClassCreated] = useState({});
	// states of Step 0 (Create Your Class room)
	const addClassProps = useAddClass();
	const {
		classroomLongName,
		classroomDescription,
		classroomUrl,
		gradeLevel,
		fullName,
		org,
		title,
		hasClassUrlErr,
		setHasOrgErr,
		setHasFullNameErr,
		setHasClassUrlErr,
	} = addClassProps;

	const readingSchedulesProps = useAddReadingSchedule();
	const {
		readingScheduleTitle,
		// day,
		startTime,
		endTime,
		timezone,
		repeat,
		frequencyTime,
		frequencyType,
		dayRecurrence,
		_startDate,
		_startTime,
		_endTime,
	} = readingSchedulesProps;

	const [activeStep, setActiveStep] = React.useState(0);
	const handleNext = (e) => {
		e.preventDefault();

		setErrorMessage('');
		setErrorMessage2('');

		if (activeStep === 0) {
			if (
				!/^[a-zA-Z][a-zA-Z0-9-']+\s+[a-zA-Z][a-zA-Z0-9-']+(\s+[a-zA-Z][a-zA-Z0-9-']+)?$/.test(
					fullName
				)
			) {
				return setHasFullNameErr(true);
			}
			if (!/^[a-zA-Z][\w-'\s]+$/i.test(org)) {
				return setHasOrgErr(true);
			}
			if (!/^[a-zA-Z][\w-]+$/i.test(hasClassUrlErr)) {
				return setHasClassUrlErr(true);
			}

			if (!classroomUrl) {
				return setErrorMessage('Classroom URL was empty');
			}
			if (!classroomLongName) {
				return setErrorMessage('Classroom Name was empty');
			}
			if (!gradeLevel) {
				return setErrorMessage('Grade level was empty');
			}
			if (!classroomDescription) {
				return setErrorMessage('Classroom Description was empty');
			}

			const classBody = {
				class_id: classroomUrl,
				name: classroomLongName,
				grade_level: gradeLevel,
				description: classroomDescription,
			};

			const alreadyCreated = JSON.stringify(classBody) === JSON.stringify(classCreated);

			setIsLoading(true);

			const errorCallbackMessage = `Unable to reach the server. ${tryAgainMsg()}`;

			let classCreate;
			if (alreadyCreated) classCreate = Promise.resolve({ status: true });
			else
				classCreate = Http().secureRequest({
					url: '/classes',
					method: 'POST',
					body: classBody,
					successCallback: ({ status, /* data, */ error, suggestions }) => {
						if (!status) {
							setErrorMessage(error || 'Error while creating class');
							if (suggestions && suggestions.length > 0) {
								setIsSuggestingClassIDs(true);
								setSuggestedClassIDs(suggestions);
							}
							return;
						}

						setClassCreated(classBody);
					},
					errorCallback: () => setErrorMessage(errorCallbackMessage),
				});

			const body = { organization_name: org, title, name: fullName };
			const userUpdate = Http().secureRequest({
				url: '/users/' + userID,
				method: 'PATCH',
				body,
				successCallback: ({ status, /* data, */ error }) => {
					if (status !== true) {
						setErrorMessage2(error || 'Error while updating your account');
						return;
					}
					const userDet = getUserDetails();
					saveUserDetails({ ...userDet, ...body });
				},
				errorCallback: () => setErrorMessage2(errorCallbackMessage),
			});

			Promise.all([classCreate, userUpdate])
				.then((responses) => {
					if (!responses.map((r) => r.status).includes(false)) {
						setActiveStep(1);
						return;
					}
				})
				.finally(() => setIsLoading(false));
		}

		if (activeStep === 1) {
			if (!invitedTeachers) return setActiveStep(2);

			setIsLoading(true);
			const teacherInvite = Http().secureRequest({
				url: `/classes/invite/${classroomUrl}`,
				method: 'PATCH',
				body: { teachers: invitedTeachers },
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
			// Add reading schedule

			const durationHrs = ((endTime * 1 - startTime * 1) / (60 * 60 * 1000)).toFixed(2);
			if (durationHrs > 3) return setErrorMessage('Duration must not be more than 3 hours');

			setIsLoading(true);
			const errorCallbackMessage = `Unable to reach the server. ${tryAgainMsg()}`;
			const readingScheduleCreate = Http().secureRequest({
				url: '/reading-schedules',
				method: 'POST',
				body: {
					class_id: classroomUrl,
					title: readingScheduleTitle,
					start_date: _startDate,
					start_time: _startTime,
					end_time: _endTime,
					timezone,
					repeat,
					frequency_time: frequencyTime,
					frequency_type: frequencyType,
					day_recurrence: dayRecurrence,
				},
				successCallback: ({ status, /* data, */ error }) => {
					if (!status) {
						return setErrorMessage(error || 'Error while creating reading schedule');
					}

					setSuccessMessage('Reading schedule created Successfully');
					const timer = setTimeout(() => {
						navigate('/app/reading-sessions');
						clearTimeout(timer);
					}, 1200);
				},
				errorCallback: () => {
					return setErrorMessage(errorCallbackMessage);
				},
			});

			readingScheduleCreate.finally(() => setIsLoading(false));
		}
	};
	const handleBack = useCallback(() => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	}, []);
	const handleReset = useCallback(() => {
		setActiveStep(0);
	}, []);

	const { mission, reason } = getStepContent(activeStep);
	const HorizontalLabelPositionBelowStepper = () => {
		const { root: rootClass, instructions, stepButton, navButton } = classes;
		const isFinalStep = activeStep === steps.length - 1;

		return (
			<div className={rootClass}>
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
								<Typography variant='h3' className={instructions}>
									{mission}
								</Typography>
								<Typography variant='body1' className={instructions}>
									{reason}
								</Typography>
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
										{isFinalStep ? 'Finish' : 'Next'}
									</Button>
								</div>
							</div>
						)}
					</div>
				</Container>
			</div>
		);
	};

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
						<Grid item xs={8}>
							<Box p={4} className={cssClasses.container}>
								<form>
									<HorizontalLabelPositionBelowStepper
										{...{ activeStep, handleNext, handleBack, handleReset }}
									/>
									<Container>
										<Box mb={3}>
											{errMsg && <Typography className={cssClasses.err}>{errMsg}</Typography>}
											{errMsg2 && <Typography className={cssClasses.err}>{errMsg2}</Typography>}
										</Box>
									</Container>
									{successMessage && (
										<Typography className={cssClasses.success}>{successMessage}</Typography>
									)}

									{activeStep === 0 && (
										<AddClass
											isOnboarding
											{...{ ...addClassProps, isSuggestingClassIDs, suggestedClassIDs }}
										/>
									)}
									{activeStep === 1 && (
										<InviteTeachers value={invitedTeachers} updateValue={updateInvitedTeachers} />
									)}
									{activeStep === 2 && <AddReadingSchedule {...readingSchedulesProps} />}
								</form>
							</Box>
						</Grid>
					</Grid>
				}
			</div>
		</Page>
	);
};

export default Classes;
