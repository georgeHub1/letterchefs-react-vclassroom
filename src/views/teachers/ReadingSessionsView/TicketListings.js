import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Grid, Typography, CircularProgress, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import Page from '../../../components/Page';
import LinkButton from '../../../components/LinkButton';
import ReadingTicketCard from './ReadingTicketCard';

import useStripeSetupButton from '../../account/AccountView/useStripeSetupButton';
import useDialog from '../../../hooks/useDialog';

import CheckoutFormDialog from './dialogs/CheckoutForm';

import { Http, tryAgainMsg, userDetails } from '../../../helpers';

const mustSetupStripe = !userDetails.stripe_customer_id || !userDetails.stripe_account_id;

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		width: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const TicketListings = () => {
	const classes = useStyles();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [readingTickets, setReadingTickets] = useState([]);

	const {
		error: stripeError,
		connectError: stripeConnectError,
		success: stripeSuccess,
		button: stripeBtn,
	} = useStripeSetupButton();

	const [showingCheckoutDialog, openCheckoutDialog, closeCheckoutDialog] = useDialog();

	const [activeReadingEventProps, setActiveReadingEventProps] = useState({});
	useEffect(() => {
		const action = activeReadingEventProps.__action;
		if (action === 'checkout') openCheckoutDialog();
	}, [activeReadingEventProps.__action, openCheckoutDialog]);

	useEffect(() => {
		setIsLoading(true);

		const req = Http().secureRequest({
			url: '/reading-schedules/tickets',
			successCallback: ({ status, data, error }) => {
				if (!status) {
					setError(error || 'Error getting reading tickets');
					return;
				}

				setReadingTickets(data);
			},
			errorCallback: () => setError('Unable to get reading tickets. ' + tryAgainMsg()),
		});

		req.finally(() => setIsLoading(false));
	}, []);

	const handleRemoveActiveEvent = useCallback(
		() =>
			setReadingTickets((x) => {
				const tickets = [...x];
				const tInd = tickets.findIndex((t) => (t.id = activeReadingEventProps.id));
				if (tInd > -1) tickets.splice(tInd, 1);
				return tickets;
			}),
		[activeReadingEventProps.id]
	);

	return (
		<Page className={classes.root} title='Reading Events Tickets | LetterChefs'>
			<CheckoutFormDialog
				isOpened={showingCheckoutDialog}
				handleClose={closeCheckoutDialog}
				clientSecret={activeReadingEventProps.__clientSecret}
				readingEventProps={activeReadingEventProps}
				onPay={handleRemoveActiveEvent}
			/>

			<Container maxWidth={false}>
				<Grid container>
					<Grid item xs={9} align='start'>
						<Box mt={3} mb={2}>
							<Typography variant='h3'>Reading Tickets</Typography>
						</Box>
					</Grid>
					<Grid item xs={3} align='end'>
						<Box mt={2}>
							<LinkButton
								color='primary'
								variant='contained'
								size='large'
								component='button'
								href='/create-reading-session'
							>
								Create New Session
							</LinkButton>
						</Box>
					</Grid>
					<Grid item xs={12}>
						{error && <Alert severity='error'>{error}</Alert>}
						{isLoading && (
							<Typography align='center' component='div'>
								<CircularProgress />
							</Typography>
						)}

						{readingTickets.length === 0 && (
							<Typography variant='body1'>
								There are currently no reading tickets available for purchase.
							</Typography>
						)}
						{readingTickets.length > 0 && (
							<Typography variant='body1'>List of available reading tickets.</Typography>
						)}

						{mustSetupStripe && (
							<Box p={2}>
								{stripeError && <Alert severity='error'>{stripeError}</Alert>}
								{stripeConnectError && <Alert severity='error'>{stripeConnectError}</Alert>}
								{stripeSuccess && <Alert severity='error'>{stripeSuccess}</Alert>}
								{!stripeError && !stripeConnectError && !stripeSuccess && (
									<Alert severity='info'>
										You need to setup payment (with Stripe) to be able to buy ticket
									</Alert>
								)}
								<Typography align='right'>{stripeBtn}</Typography>
							</Box>
						)}

						{readingTickets.map((ticket, index) => {
							const updateTicket = (data) =>
								setReadingTickets((x) => {
									const tickets = [...x];
									tickets[index] = { ...tickets[index], ...data };
									return tickets;
								});

							return (
								<ReadingTicketCard
									key={index}
									{...{ updateTicket, setActiveReadingEventProps, ...ticket }}
								/>
							);
						})}
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default TicketListings;
