import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import {
	Container,
	Grid,
	Paper,
	Typography,
	CircularProgress,
	Button,
	Icon,
	IconButton,
	makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { red /* , grey, pink, blue */ } from '@material-ui/core/colors';
import Color from '../../../mixins/palette';
import * as moment from 'moment-timezone';

import Page from '../../../components/Page';
import LinkButton from '../../../components/LinkButton';

import useDialog from '../../../hooks/useDialog';

import CheckoutFormDialog from './dialogs/CheckoutForm';

import languageNames from '../../../localstore/languages.json';
import { Http, tryAgainMsg, userDetails } from '../../../helpers';

const mustSetupStripe = !userDetails.stripe_customer_id || !userDetails.stripe_account_id;

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		width: '100%',
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
	sessionsContainer: {
		display: 'flex',
		width: '100%',
	},
	bigHeight: {
		height: 2000,
	},
	cancelEvent: {
		color: red[500],
	},
	day: {
		marginTop: theme.spacing(1),
		color: Color.hex.liberty,
		fontWeight: theme.typography.fontWeightBold,
	},
	dayOfWeek: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	dateContainer: {
		width: 100,
		justifyContent: 'center',
		textAlign: 'center',
		marginRight: theme.spacing(2),
	},
	detailsContainer: {
		position: 'relative',
		flexGrow: 1,
	},
	month: {
		textTransform: 'uppercase',
	},
	paper: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
	},
	gradeLevel: {
		display: 'flex',
		paddingTop: theme.spacing(3),
	},
	immediateActionContainer: {
		display: 'flex',
		alignItems: 'center',
	},
	link: {
		fontWeight: theme.typography.fontWeightRegular,
	},
	linkContainer: {
		color: Color.hex.blue,
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'none',
		},
	},
	textarea: {
		width: '100%',
		padding: theme.spacing(1),
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
	},
}));

const canUseNativeShare = window && 'share' in window.navigator;

const TicketPage = ({ mustPay }) => {
	const classes = useStyles();
	const { ticket_id } = useParams();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [buyError, setBuyError] = useState('');
	const [bought, setBought] = useState(false);

	const [readingTicket, setReadingTicket] = useState({ created_by: {} });
	const [clientSecret, setClientSecret] = useState('');

	const [showingCheckoutDialog, openCheckoutDialog, closeCheckoutDialog] = useDialog();

	useEffect(() => {
		setIsLoading(true);

		const req = Http().secureRequest({
			url: `/reading-schedules/tickets/${ticket_id}`,
			successCallback: ({ status, data, error }) => {
				if (!status) {
					setError(error || 'Error getting reading tickets');
					return;
				}

				setReadingTicket(data);
				if (data.pay_status === 'succeeded') setBought(true);
			},
			errorCallback: () => setError('Unable to get reading tickets. ' + tryAgainMsg()),
		});

		req.finally(() => setIsLoading(false));
	}, [ticket_id]);

	const startDate = (readingTicket.start_date || '').split('T')[0];
	const startDateTime = startDate + 'T' + readingTicket.start_time;
	const endDateTime = startDate + 'T' + readingTicket.end_time;
	const duration = new Date(endDateTime) * 1 - new Date(startDateTime) * 1;
	const durationText = duration / (60 * 1000) + 'min';

	const host = `${readingTicket.created_by.title} ${readingTicket.created_by.given_name} ${readingTicket.created_by.family_name}`;

	const languages = (
		languageNames.find((x) => (readingTicket.languages || '').includes(x.value)) || {}
	).title;

	// const isSeries = !!readingTicket.repeat

	const handleShare = () => {
		if (!canUseNativeShare) return;
		window.navigator.share({
			title: readingTicket.title,
			url: window.location.origin + window.location.pathname + '/' + readingTicket.id,
			text:
				readingTicket.description ||
				`Participate in a reading event (${readingTicket.title}) for ${readingTicket.grade_level} by ${host}`,
		});
	};

	const handleBuy = () => {
		setIsLoading(true);
		setError('');
		setBuyError('');

		const rq = Http().secureRequest({
			url: `/reading-schedules/buy/${ticket_id}`,
			method: 'POST',
			successCallback: ({ status, data, error }) => {
				if (!status) {
					return setBuyError(error || 'Could not buy ticket');
				}

				if (data.status && data.status === 'succeeded') {
					return setBuyError('Ticket already bought');
				}

				if (data.client_secret) {
					openCheckoutDialog();
					setClientSecret(data.client_secret);
				}
			},
			errorCallback: () => setBuyError('Unable to buy ticket. ' + tryAgainMsg()),
		});

		rq.finally(() => setIsLoading(false));
	};

	const handlePaid = useCallback(() => {
		setBought(true);
		closeCheckoutDialog();
	}, [closeCheckoutDialog]);

	return (
		<Page
			className={classes.root}
			title={readingTicket.title + ' | Reading Events Tickets | LetterChefs'}
		>
			<CheckoutFormDialog
				isOpened={showingCheckoutDialog}
				handleClose={closeCheckoutDialog}
				clientSecret={clientSecret}
				readingEventProps={readingTicket}
				onPay={handlePaid}
			/>

			<Container maxWidth={false}>
				<Grid container>
					<Grid item xs={12}>
						{!bought && mustPay && (
							<Alert severity='info'>You need to pay for this ticket to continue</Alert>
						)}
						{error && <Alert severity='error'>{error}</Alert>}
						{bought && (
							<Alert severity='success'>
								Ticket bought{' '}
								{mustPay && (
									<LinkButton
										href={`/class/${readingTicket.class_id}/event/${readingTicket.id}/in`}
										size='small'
									>
										Goto Class
									</LinkButton>
								)}
							</Alert>
						)}
						{isLoading && (
							<Typography align='center'>
								<CircularProgress />
							</Typography>
						)}

						<div className={classes.sessionsContainer}>
							<Paper className={classes.paper}>
								<div className={classes.dateContainer}>
									<Typography variant='h4' className={classes.month}>
										{moment(startDateTime).format('MMM')}
									</Typography>

									<Typography variant='h4' className={classes.day}>
										{parseInt(moment(startDateTime).format('D'))}
									</Typography>

									<div className={classes.dayOfWeek}>
										<Typography variant='body1'>{moment(startDateTime).format('dddd')}</Typography>
									</div>
								</div>
								<div className={classes.detailsContainer}>
									<Typography variant='h5' className={classes.link}>
										<LinkButton
											variant='text'
											href={`/app/reading-tickets/${readingTicket.id}`}
											className={classes.linkContainer}
										>
											{readingTicket.title}
										</LinkButton>
									</Typography>
									{!readingTicket.is_public && <Typography align='right'>Private Event</Typography>}
									{readingTicket.description && (
										<Typography className={classes.link}>{readingTicket.description}</Typography>
									)}
									<Typography variant='h6' className={classes.link}>
										{moment
											.tz(startDateTime, readingTicket.timezone || 'America/Los_Angeles')
											.format('ha')}{' '}
										{` (`}
										{moment
											.tz(startDateTime, readingTicket.timezone || 'America/Los_Angeles')
											.zoneAbbr()}
										)
									</Typography>
									<Typography variant='body2' className={classes.gradeLevel}>
										Grade Level: {readingTicket.grade_level}
									</Typography>
									<Typography variant='body2'>Hosted By: {host}</Typography>
									<Typography variant='body2'>Duration: {durationText}</Typography>
									<Typography variant='body2'>Languages: {languages}</Typography>
									{canUseNativeShare && (
										<IconButton
											variant='contained'
											onClick={handleShare}
											className={classes.actionButtons}
										>
											<Icon>share</Icon>
										</IconButton>
									)}
								</div>
								<div className={classes.immediateActionContainer}>
									{buyError && <Alert severity='error'>{buyError}</Alert>}
									{!bought && (
										<Button
											variant='contained'
											color='primary'
											size='small'
											disabled={mustSetupStripe || isLoading}
											onClick={handleBuy}
										>
											BUY ({readingTicket.currency} {readingTicket.price})
										</Button>
									)}
								</div>
							</Paper>
						</div>
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default TicketPage;
