import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	makeStyles,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	TextareaAutosize,
	Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	textarea: {
		width: '100%',
		padding: theme.spacing(1),
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
	},
}));

const CancelEvent = ({ isOpened, handleClose, onCancel }) => {
	const classes = useStyles();

	const handleSubmit = () => {
		onCancel();
		handleClose();
	};

	return (
		<Dialog
			open={isOpened}
			onClose={handleClose}
			aria-labelledby='cancel-event-dialog-title'
			aria-describedby='cancel-event-dialog-description'
		>
			<DialogTitle id='cancel-event-dialog-title'>
				<Typography variant='h4'>Are you sure you want to CANCEL?</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id='cancel-event-dialog-description'>
					Cancelling the event will notify all your students and tickets will be refunded.
					<TextareaAutosize
						aria-label='cancel event message to attendees'
						placeholder='Write a message to your attendees, with reason for cancellation.'
						rowsMin={5}
						rowsMax={10}
						className={classes.textarea}
					/>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='primary' variant='contained'>
					No, Don&rsquo;t Cancel
				</Button>
				<Button onClick={handleSubmit} color='primary' variant='outlined'>
					Yes, Cancel Please.
				</Button>
			</DialogActions>
		</Dialog>
	);
};

CancelEvent.defaultProps = { onCancel: () => {} };

CancelEvent.propTypes = {
	isOpened: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	onCancel: PropTypes.func,
};

export default CancelEvent;
