import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Button, CircularProgress } from '@material-ui/core';

import { Http, tryAgainMsg, userDetails, saveUserDetails } from '../../../helpers';
import VerifyEmailDialog from '../../auth/VerifyEmailDialog';

import PageContext from '../../../contexts/Page';

const useStripeSetupButton = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [connectError, setConnectError] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const { showEmailVerify, setShowEmailVerify } = useContext(PageContext);

	const handleSetupStripe = () => {
		setIsLoading(true);
		setConnectError('');
		setError('');
		setSuccess('');

		const stripeConnectAccount = Http().secureRequest({
			url: '/stripe-connect',
			errorCallback: () => setConnectError('Unable to setup stripe connect. ' + tryAgainMsg()),
		});

		const stripeCustomer = Http().secureRequest({
			url: '/stripe/customers',
			method: 'PUT',
			errorCallback: () => setError('Unable to setup stripe. ' + tryAgainMsg()),
		});

		Promise.all([stripeConnectAccount, stripeCustomer])
			.then(([stripeConnect, stripe]) => {
				const {
					status: stripeConnectStatus,
					data: stripeConnectData,
					error: stripeConnectError,
				} = stripeConnect;
				const { status: stripeStatus, data: stripeData, error: stripeError } = stripe;

				if (stripeConnectStatus && stripeStatus) {
					const { stripe_account_id, url } = stripeConnectData;
					const { stripe_customer_id } = stripeData;

					const shouldUpdate =
						userDetails.stripe_account_id !== stripe_account_id ||
						userDetails.stripe_customer_id !== stripe_customer_id;

					if (shouldUpdate) {
						const newDetails = {
							...(stripeConnectStatus ? { stripe_account_id } : {}),
							...(stripeStatus ? { stripe_customer_id } : {}),
						};
						saveUserDetails({ ...userDetails, ...newDetails }, false);
					}

					if (window) {
						if (url) window.location.href = url;
						else if (shouldUpdate) window.location.reload(true);
						else setSuccess('Payment setup complete');
					}
				} else {
					if (!stripeConnectStatus) {
						setConnectError(stripeConnectError || 'Error setting up stripe connect');
					}

					if (!stripeStatus) {
						setError(stripeError || 'Error setting up stripe');
					}
				}
			})
			.finally(() => setIsLoading(false));
	};

	const re = /email\s*not\s*verified/i;
	const shouldVerifyEmailDialog = re.test(connectError) || re.test(error);

	useEffect(() => {
		if (shouldVerifyEmailDialog && !showEmailVerify) setShowEmailVerify(true);
	}, [shouldVerifyEmailDialog, showEmailVerify, setShowEmailVerify]);

	const button = (
		<Fragment>
			<Button
				variant='contained'
				color='primary'
				type='button'
				disabled={isLoading}
				onClick={handleSetupStripe}
			>
				{isLoading ? <CircularProgress /> : 'Setup Payouts'}
			</Button>
			{shouldVerifyEmailDialog && <VerifyEmailDialog />}
		</Fragment>
	);

	return { isLoading, connectError, error, success, button };
};

export default useStripeSetupButton;
