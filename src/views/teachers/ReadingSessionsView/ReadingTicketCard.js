import React from 'react';
import { Paper, Typography, Button, Icon, IconButton, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import * as moment from 'moment-timezone';
import Color from '../../../mixins/palette';

import LinkButton from '../../../components/LinkButton';

import languageNames from '../../../localstore/languages.json';
import { Http, tryAgainMsg, userDetails } from '../../../helpers';

const { stripe_customer_id, stripe_account_id } = userDetails;
const mustSetupStripe = !stripe_customer_id || !stripe_account_id;

const canUseNativeShare = window && 'share' in window.navigator;

const useStyles = makeStyles((theme) => ({
	sessionsContainer: {
		display: 'flex',
		width: '100%',
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
}));

const ReadingTicketCard = ({ isBuying, updateTicket, setActiveReadingEventProps, ...props }) => {
	const classes = useStyles();

	const {
		created_by,
		description,
		end_time,
		error,
		grade_level,
		id,
		languages,
		start_date,
		start_time,
	} = props;

	const startDate = start_date.split('T')[0];
	const startDateTime = startDate + 'T' + start_time;
	const endDateTime = startDate + 'T' + end_time;
	const duration = new Date(endDateTime) * 1 - new Date(startDateTime) * 1;
	const durationText = duration / (60 * 1000) + 'min';

	const { title, family_name, given_name } = created_by;
	const host = `${title} ${given_name} ${family_name}`;

	const languageList = (languageNames.find((x) => (languages || '').includes(x.value)) || {}).title;

	const handleShare = () => {
		if (!canUseNativeShare) {
			return;
		}
		window.navigator.share({
			title: title,
			url: window.location.origin + window.location.pathname + '/' + id,
			text:
				description || `Participate in a reading event (${title}) for ${grade_level} by ${host}`,
		});
	};

	const handleBuy = () => {
		updateTicket({ isBuying: true, error: '' });

		Http().secureRequest({
			url: `/reading-schedules/buy/${id}`,
			method: 'POST',
			successCallback: ({ status, data, error }) => {
				if (!status) {
					return updateTicket({ isBuying: false, error: error || 'Could not buy ticket' });
				}

				if (data?.status && data?.status === 'succeeded') {
					return updateTicket({ isBuying: false, error: 'Ticket already bought' });
				}

				updateTicket({ isBuying: false });
				if (data && data.client_secret)
					setActiveReadingEventProps((x) => ({
						...x,
						...props,
						__action: 'checkout',
						__clientSecret: data.client_secret,
					}));
			},
			errorCallback: () =>
				updateTicket({
					isBuying: false,
					error: 'Unable to buy ticket. ' + tryAgainMsg(),
				}),
		});
	};

	const startDateM = moment(startDateTime);
	const startDateMTZ = moment.tz(startDateTime, props.timezone + '' || 'America/Los_Angeles');

	return (
		<div className={classes.sessionsContainer}>
			<Paper className={classes.paper}>
				<div className={classes.dateContainer}>
					<Typography variant='h4' className={classes.month}>
						{startDateM.format('MMM')}
					</Typography>

					<Typography variant='h4' className={classes.day}>
						{parseInt(startDateM.format('D'))}
					</Typography>

					<div className={classes.dayOfWeek}>
						<Typography variant='body1'>{startDateM.format('dddd')}</Typography>
					</div>
				</div>
				<div className={classes.detailsContainer}>
					<Typography variant='h5' className={classes.link}>
						<LinkButton variant='text' href={`/tickets/${id}`} className={classes.linkContainer}>
							{props.title}
						</LinkButton>
					</Typography>
					{!props.is_public && <Typography align='right'>Private Event</Typography>}
					{props.description && <Typography className={classes.link}>{description}</Typography>}
					<Typography variant='h6' className={classes.link}>
						{startDateMTZ.format('ha')} {` (`}
						{startDateMTZ.zoneAbbr()})
					</Typography>
					<Typography variant='body2' className={classes.gradeLevel}>
						Grade Level: {grade_level}
					</Typography>
					<Typography variant='body2'>Hosted By: {host}</Typography>
					<Typography variant='body2'>Duration: {durationText}</Typography>
					<Typography variant='body2'>Languages: {languageList}</Typography>
					{canUseNativeShare && (
						<IconButton variant='contained' onClick={handleShare} className={classes.actionButtons}>
							<Icon>share</Icon>
						</IconButton>
					)}
				</div>
				<div className={classes.immediateActionContainer}>
					{error && <Alert severity='error'>{error}</Alert>}
					<Button
						disabled={mustSetupStripe || isBuying}
						onClick={handleBuy}
						variant='contained'
						color='primary'
						size='small'
					>
						Purchase Ticket ({props.currency} {props.price})
					</Button>
				</div>
			</Paper>
		</div>
	);
};

export default ReadingTicketCard;
