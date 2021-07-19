import React, { useState, useCallback } from 'react';
import {
	Box,
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
import Join from './Join';
import useJoin from './useJoin';
import InviteStaff from './InviteStaff';
import JoinSchedule from './JoinSchedule';

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
	stepButton: {
		justifyContent: 'flex-end',
		display: 'flex',
		flexDirection: 'row',
		marginBottom: theme.spacing(2),
	},
}));

const useStyles = makeStyles((/* theme */) => ({
	root: {
		width: '100%',
		backgroundColor: Color.hex.grape,
	},
	container: {
		minHeight: '100%',
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

const OnboardAdmins = () => {
	const cssClasses = useStyles();
	const classes = useStylesStepper();

	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrorMessage] = useState(null);
	const [errMsg2, setErrorMessage2] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [successMessage2, setSuccessMessage2] = useState(null);
	const [fieldErrors, setFieldErrors] = useState(null);

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

	const clearErrors = () => {
		//Clear success and error messages
		setErrorMessage(null);
		setErrorMessage2(null);
		setSuccessMessage(null);
		setSuccessMessage2(null);
	};

	const handleBack = useCallback(() => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
		clearErrors();
	}, []);

	const handleReset = useCallback(() => {
		setActiveStep(0);
	}, []);

	// states of Step 0 (Create Your Class room)
	const joinProps = useJoin();
	const { classroomLongName, classroomUrl, gradeLevel, fullName, org, title } = joinProps;

	const handleJoinData = () => {};

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
		const { root: rootClass, stepButton, navButton } = classes;
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
							<Box mt={1} mb={1}>
								<Typography>All steps completed</Typography>
								<Button type='reset' onClick={handleReset} disabled={isLoading}>
									Reset
								</Button>
							</Box>
						) : (
							<Box mt={1}>
								<Typography variant='h3'>{mission}</Typography>
								<Typography variant='body1'>{reason}</Typography>
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
							</Box>
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
					<HorizontalLabelPositionBelowStepper
						{...{ activeStep, handleNext, handleBack, handleReset }}
					/>
					<Grid container spacing={5}>
						<Grid item xs={12}>
							<Container>
								<Typography align='center' gutterBottom>
									{errMsg && <Alert severity='error'>{errMsg}</Alert>}
									{errMsg2 && <Alert severity='error'>{errMsg}</Alert>}
									{!errMsg && successMessage && <Alert severity='success'>{successMessage}</Alert>}
									{!errMsg2 && successMessage2 && (
										<Alert severity='success'>{successMessage2}</Alert>
									)}
									{isLoading && <CircularProgress color='secondary' />}
								</Typography>
							</Container>
						</Grid>
						<Grid item xs={12}>
							{activeStep === 0 && (
								<Join isOnboarding {...joinProps} handleJoinData={(e) => handleJoinData(e)} />
							)}
							{activeStep === 1 && (
								<InviteStaff value={invitedTeachers} updateValue={updateInvitedTeachers} />
							)}
							{activeStep === 2 && <JoinSchedule />}
						</Grid>
					</Grid>
				</Container>
			</div>
		</Page>
	);
};

export default OnboardAdmins;
