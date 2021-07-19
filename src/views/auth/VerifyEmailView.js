import React, { Fragment, useEffect, useState } from 'react';
import {
	Box,
	/* Button, */ Container,
	Grid,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
// import { common, grey } from '@material-ui/core/colors';

// import Color from '../../mixins/palette';
import Page from '../../components/Page';

import useVerifyEmailBtn from './useVerifyEmailBtn';

import { tryAgainMsg, userDetails, saveUserDetails, downloadUserDetails } from '../../helpers';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
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
	subtitle: {
		marginBottom: theme.spacing(3),
	},
	paper: {
		padding: theme.spacing(5),
	},
}));

const VerifyEmailView = () => {
	const classes = useStyles();

	const [verificationCompleted, setVerificationCompleted] = useState(false);

	const {
		button: verifyEmailBtn,
		verificationStarted,
		alreadyVerified,
		error,
		setError,
	} = useVerifyEmailBtn();

	useEffect(() => {
		if (!window) return;
		const srch = new URL(window.location.href).searchParams;
		const error = srch.get('error');
		if (error) {
			setError(error);
		}
		const verified = window.location.search.includes('verified');
		if (!verified) {
			return;
		}
		downloadUserDetails({
			errMsg: 'Error getting user details',
			notFoundMsg: 'User not found or invalid key',
			notSentMsg: 'Unable to connect. ' + tryAgainMsg(),
		})
			.then((resp) => {
				if (resp.email_verified) {
					setVerificationCompleted(true);
				}
			})
			.catch(() => setError('Error getting user details'));
	}, [setError]);

	if (userDetails.email_verified) {
		saveUserDetails({ ...userDetails, email_verified: 1 });
		return <Fragment>Email already verified</Fragment>;
	}

	return (
		<Fragment>
			<Page title='Verify Email | Live Storytelling For Kids 2-10+ | LetterChefs'>
				<Container maxWidth={false}>
					<Box mt={3} mb={3}>
						<Typography variant='h3' className={classes.title}>
							Verify Email View
						</Typography>
					</Box>
					<Paper className={classes.paper}>
						<Grid container>
							<Grid item xs={12}>
								<Container>
									{error && <Alert severity='error'>{error}</Alert>}
									{verificationStarted}
									{verificationCompleted && (
										<Alert severity='success'>Your email has been verified</Alert>
									)}
									{alreadyVerified}
									<Typography variant='body1' className={classes.subtitle}>
										You have not confirmed your email. Please click button to resend a confirmation
										link to your email account.
									</Typography>
									{verifyEmailBtn}
								</Container>
							</Grid>
						</Grid>
					</Paper>
				</Container>
			</Page>
		</Fragment>
	);
};

export default VerifyEmailView;
