import React, { useState, useContext } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { Http, tryAgainMsg } from '../../helpers';

import PageContext from '../../contexts/Page';

const useVerifyEmailBtn = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [verificationStarted, setVerificationStarted] = useState(false);
	const [alreadyVerified, setAlreadyVerified] = useState(false);
	const [error, setError] = useState('');

	const { showEmailVerify, setShowEmailVerify } = useContext(PageContext);

	const handleEmailVerification = (e) => {
		e.preventDefault();

		setIsLoading(true);
		setError('');

		if (showEmailVerify) setShowEmailVerify(false);

		const req = Http().secureRequest({
			url: '/users/verify-email',
			method: 'POST',
			successCallback: ({ status, /* data, */ error }, statusCode) => {
				if (statusCode === 409) {
					return setAlreadyVerified(true);
				}

				if (!status) {
					return setError(error || 'Unable to start verifying your email!');
				}

				setVerificationStarted(true);
			},
			errorCallback: () => setError('Unable to reach the server. ' + tryAgainMsg()),
		});

		req.finally(() => setIsLoading(false));
	};

	const button = (
		<Button
			variant='contained'
			type='submit'
			color='primary'
			size='large'
			onClick={handleEmailVerification}
			disabled={isLoading}
		>
			{isLoading ? <CircularProgress /> : 'Resend Verification Email'}
		</Button>
	);

	return {
		button,
		isLoading,
		setIsLoading,
		verificationStarted: verificationStarted && (
			<Alert severity='success'>
				A verification link has been sent to you email, click on it to continue your verification
			</Alert>
		),
		alreadyVerified: alreadyVerified && (
			<Alert severity='info'>Your email has already been verified</Alert>
		),
		error,
		setError,
	};
};

export default useVerifyEmailBtn;
