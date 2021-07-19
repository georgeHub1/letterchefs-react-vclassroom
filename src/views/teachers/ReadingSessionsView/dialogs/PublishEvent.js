import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Typography,
	CircularProgress,
	Button,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import TicketingDetails from '../TicketingDetails';
import useTicketingDetails from '../useTicketDetails';

import { Http, tryAgainMsg } from '../../../../helpers';

const PublishEvent = ({ isOpened, handleClose, readingEventProps, onPublished }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrMsg] = useState('');

	const ticketingDetailsProps = useTicketingDetails();
	const { price, currency } = ticketingDetailsProps;

	const handleSubmit = () => {
		const { class_id } = readingEventProps;
		if (!class_id)
			return setErrMsg('class_id must be sent in reading event props to invite a guest teacher');

		setErrMsg('');
		setIsLoading(true);
		const createTicket = Http().secureRequest({
			url: `/reading-schedules/publish/${readingEventProps.id}`,
			method: 'PATCH',
			body: { currency: currency, price: price * 1 },
			successCallback: ({ status, /* data, */ error }) => {
				if (!status) {
					setErrMsg('Error while publishing reading event. ' + error);
					return;
				}
				onPublished();
			},
			errorCallback: () => setErrMsg('Unable to publish reading event. ' + tryAgainMsg()),
		});
		createTicket.finally(() => setIsLoading(false));
	};

	return (
		<Dialog open={isOpened} onClose={handleClose} aria-labelledby='edit-event-dialog'>
			<DialogTitle id='edit-event-dialog'>
				<Typography variant='h4'>Publish Event ({readingEventProps.title})</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{errMsg && (
						<Alert component='body1' severity='error'>
							{errMsg}
						</Alert>
					)}
					{isLoading && <CircularProgress />}
				</DialogContentText>
				<TicketingDetails {...ticketingDetailsProps} />
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='primary' variant='outlined'>
					Cancel
				</Button>
				<Button onClick={handleSubmit} color='primary' variant='contained'>
					Publish Event
				</Button>
			</DialogActions>
		</Dialog>
	);
};

PublishEvent.defaultProps = { onPublished: () => {} };

PublishEvent.propTypes = {
	isOpened: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	readingEventProps: PropTypes.object.isRequired,
	onPublished: PropTypes.func,
};

export default PublishEvent;
