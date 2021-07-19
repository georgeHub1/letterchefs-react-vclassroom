import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Button,
	CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

import { userDetails, Http, tryAgainMsg } from '../../../../helpers';

const CARD_ELEMENT_OPTIONS = {
	style: {
		base: {
			color: '#32325d',
			fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
			fontSmoothing: 'antialiased',
			fontSize: '16px',
			'::placeholder': {
				color: '#aab7c4',
			},
		},
		invalid: {
			color: '#fa755a',
			iconColor: '#fa755a',
		},
	},
};

const CheckoutForm = ({ isOpened, handleClose, clientSecret, readingEventProps, onPay }) => {
	const stripe = useStripe();
	const elements = useElements();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [paid, setPaid] = useState(false);

	const [action, setAction] = useState('Pay');

	const verifyPayment = () => {
		setIsLoading(true);
		const req = Http().secureRequest({
			url: `/reading-schedules/verify-payment/${readingEventProps.id}/${clientSecret}`,
			successCallback: ({ status, /* data, */ error }) => {
				if (!status) {
					return setError(error || 'Error verifying payment');
				}

				setPaid(true);
				if (typeof onPay === 'function') onPay();
			},
			errorCallback: () =>
				setError(
					'Could not reach the server while trying to verify your payment. ' + tryAgainMsg()
				),
		});
		req.finally(() => setIsLoading(false));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (action === 'Confirm') return verifyPayment();

		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		setIsLoading(true);

		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: {
					name: `${userDetails.given_name} ${userDetails.family_name}`,
				},
			},
		});

		if (result.error) {
			setIsLoading(false);
			if (result.error.payment_intent && result.error.payment_intent.status === 'succeeded')
				setError('You have already bought this ticket');
			else setError(result.error.message);
		} else {
			// The payment has been processed!
			if (result.paymentIntent.status === 'succeeded') {
				setAction('Confirm');
				verifyPayment();
			}
		}
	};

	const { title, family_name } = readingEventProps.created_by || {};

	return (
		<Dialog open={isOpened} onClose={handleClose} aria-labelledby='edit-event-dialog'>
			<DialogTitle id='edit-event-dialog'>
				<Typography variant='h4'>
					Purchase Ticket for {readingEventProps.title} (by {title} {family_name})
				</Typography>
			</DialogTitle>
			<DialogContent>
				{error && <Alert severity='error'>{error}</Alert>}
				{paid && <Alert severity='success'>You have successfully bought the ticket</Alert>}
				{!paid && <CardElement options={CARD_ELEMENT_OPTIONS} />}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='primary' variant='outlined'>
					Cancel
				</Button>
				<Button
					disabled={isLoading || !stripe}
					onClick={handleSubmit}
					color='primary'
					variant='contained'
				>
					{isLoading ? (
						<CircularProgress />
					) : (
						`${action} (${readingEventProps.currency} ${readingEventProps.price})`
					)}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

CheckoutForm.defaultProps = { clientSecret: '', onPay: () => {} };

CheckoutForm.propTypes = {
	isOpened: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	clientSecret: PropTypes.string.isRequired,
	readingEventProps: PropTypes.object.isRequired,
	onPay: PropTypes.func,
};

export default CheckoutForm;
