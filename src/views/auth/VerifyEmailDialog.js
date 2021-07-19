import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import useVerifyEmailBtn from './useVerifyEmailBtn';

const VerifyEmail = () => {
	const [isOpened, setIsOpened] = useState(true);
	const handleClose = useCallback(() => setIsOpened(false), []);

	const {
		button: verifyEmailBtn,
		verificationStarted,
		alreadyVerified,
		error,
	} = useVerifyEmailBtn();

	return (
		<Dialog open={isOpened} onClose={handleClose} aria-labelledby='verify-email-dialog'>
			<DialogTitle id='verify-email-dialog'>
				<Typography variant='h4'>Email Verification Pending</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<Typography variant='body1' gutterBottom>
						{error && <Alert severity='error'>{error}</Alert>}
					</Typography>
					<Typography variant='body1' gutterBottom>
						A verification email has been sent to your registered email address.
					</Typography>
					<Typography variant='body2' gutterBottom>
						To start using your LetterChefs account, please complete the verification by following
						the instructions given in the email.
					</Typography>
					<Typography variant='body2' gutterBottom>
						Check your spam folder to make sure it didn&rsquo;t end up there. If you do not receive
						the verification email within 2 minutes of completing the registration, you can resend
						the verification email by <NavLink to='/app/verify-email'>clicking here</NavLink>.
					</Typography>
					<Typography>{verificationStarted}</Typography>
					<Typography>{alreadyVerified}</Typography>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Box m={3}>{verifyEmailBtn}</Box>
			</DialogActions>
		</Dialog>
	);
};

export default VerifyEmail;
