import React, { useState, useCallback } from 'react';
import {
	Button,
	Container,
	Grid,
	makeStyles,
	Step,
	StepLabel,
	Stepper,
	Typography,
	CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { common } from '@material-ui/core/colors';

import Page from '../../../components/Page';

// Steps
import AddClass from './JoinClass';
import useAddClass from './useJoinClass';
import InviteTeachers from './InviteParents';
import AddReadingSchedule from './JoinReadingSchedule';

import { Http, tryAgainMsg, userID } from '../../../helpers';
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
		height: '100vh',
		width: '100%',
		backgroundColor: Color.hex.grape,
	},
	container: {
		height: '100%',
		backgroundColor: common.white,
	},
}));

function getStepContent(stepIndex) {
	switch (stepIndex) {
		case 0:
			return {
				mission: 'Create your classroom',
				reason: 'Create a classroom to manage your students and their progress.',
			};
		case 1:
			return {
				mission: 'Invite Teachers',
				reason:
					"Teachers invited here will be granted access to your class materials and manage your students' progress.",
			};
		case 2:
			return {
				mission: 'Create Reading Schedule',
				reason: 'Create a reading schedule. Your students will get automatic reminders of class.',
			};
		default:
			return 'Unknown step. Try refreshing the page to clear error.';
	}
}

const steps = ['Create Your Classroom', 'Invite Teachers', 'Create Reading Schedule'];

const OnboardParents = () => {
	const cssClasses = useStyles();
	const classes = useStylesStepper();

	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrorMessage] = useState('');
	const [errMsg2, setErrorMessage2] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [successMessage2, setSuccessMessage2] = useState('');
	const [fieldErrors, setFieldErrors] = useState('');

	const [invitedTeachers, setInvitedTeachers] = useState('');
	const updateInvitedTeachers = (e) => setInvitedTeachers(e.target.value);

	const [activeStep, setActiveStep] = React.useState(0);
	const handleNext = () => {
		if (activeStep === 0) {
			if (!fullName.length || fullName.split(' ').length < 2) {
				return setFieldErrors(
					'Full Name is a required field, and needs both first name and last name'
				);
			}
			if (!gradeLevel.length) {
				return setFieldErrors('Select Grade Level');
			}
			if (!classroomLongName.length) {
				return setFieldErrors('Classroom name cannot be blank.');
			}

			if (!classroomUrl.length) {
				return setFieldErrors('Classroom Url cannot be blank.');
			}
			if (!title.length) {
				return setFieldErrors('Select Title.');
			}
		}
		return; //temporary so we don't go to next step.
		// setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = useCallback(() => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	}, []);
	const handleReset = useCallback(() => {
		setActiveStep(0);
	}, []);

	// states of Step 0 (Create Your Class room)
	const addClassProps = useAddClass();
	const { classroomLongName, classroomUrl, gradeLevel, fullName, org, title } = addClassProps;

	const handleAddClassData = () => {};

	// states of Step 1 (Inviting teachers)
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!classroomLongName) {
			return;
		}

		setIsLoading(true);

		const errorCallbackMessage = `Unable to reach the server. ${tryAgainMsg()}`;

		const classCreate = Http().secureRequest({
			url: '/classes',
			method: 'POST',
			body: {
				class_id: classroomUrl,
				name: classroomLongName,
				grade_level: gradeLevel,
				invite_teachers: invitedTeachers,
			},
			successCallback: ({ status, /* data, */ error }) => {
				if (!status) {
					return setErrorMessage(error || 'Error while creating class');
				}
				return setSuccessMessage('Class Created Successfully');
			},
			errorCallback: () => {
				return setErrorMessage(errorCallbackMessage);
			},
		});

		const userUpdate = Http().secureRequest({
			url: '/users/' + userID,
			method: 'PATCH',
			body: {
				organization_name: org,
				title,
				name: fullName,
			},
			successCallback: ({ status, /* data, */ error }) => {
				if (status !== true) {
					return setErrorMessage2(error || 'Error while updating your account');
				}
				return setSuccessMessage2('Your account info has been updated');
			},
			errorCallback: () => setErrorMessage2(errorCallbackMessage),
		});

		Promise.all([classCreate, userUpdate]).finally(() => setIsLoading(false));
	};

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
					<div>
						{activeStep === steps.length ? (
							<div>
								<Typography className={instructions}>All steps completed</Typography>
								<Button type='reset' onClick={handleReset} disabled={isLoading}>
									Reset
								</Button>
							</div>
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
										color='primary'
										disabled={activeStep === 0 || isLoading}
										onClick={handleBack}
										className={navButton}
										size='large'
									>
										Back
									</Button>
									<Button
										className={classes.navButton}
										variant='contained'
										color='primary'
										size='large'
										onClick={isFinalStep ? handleSubmit : handleNext}
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
		<Page title='LetterChefs | Live Reading Classes'>
			<div className={cssClasses.root}>
				<Container className={cssClasses.container}>
					<Typography align='center' gutterBottom>
						{errMsg && <Typography color='red'>{errMsg}</Typography>}
						{errMsg2 && <Typography color='red'>{errMsg2}</Typography>}
						{successMessage && <Typography style={{ color: 'green' }}>{successMessage}</Typography>}
						{successMessage2 && (
							<Typography style={{ color: 'green' }}>{successMessage2}</Typography>
						)}
						{isLoading && <CircularProgress />}
					</Typography>
					<HorizontalLabelPositionBelowStepper
						{...{ activeStep, handleNext, handleBack, handleReset }}
					/>
					<Grid container spacing={5} direction='column'>
						<Grid item>
							{activeStep === 0 && (
								<AddClass
									isOnboarding
									{...addClassProps}
									handleAddClassData={(e) => handleAddClassData(e)}
								/>
							)}
							{activeStep === 1 && (
								<InviteTeachers value={invitedTeachers} updateValue={updateInvitedTeachers} />
							)}
							{activeStep === 2 && <AddReadingSchedule />}
						</Grid>
					</Grid>
				</Container>
			</div>
		</Page>
	);
};

export default OnboardParents;
