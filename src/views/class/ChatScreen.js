import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
	Box,
	Typography,
	Grid,
	List,
	ListSubheader,
	ListItem,
	ListItemIcon,
	ListItemText,
	Button,
	IconButton,
	makeStyles,
} from '@material-ui/core';
import { ChevronLeft, Minimize, Chat } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	root: {},
	maximized: { width: '260px', height: '400px' },
	minimized: { width: '50px', height: '50px' },
}));

const emojis = ['Hey!', 'Excellent!', 'Perfect!'];

const ChatScreen = ({ users, msgClient }) => {
	const classes = useStyles();

	const [showingScreen, setShowingScreen] = useState(false);
	const toggleShowingScreen = useCallback(() => setShowingScreen((x) => !x), []);

	const [activeUser, setActiveUser] = useState(null);
	const updateActiveUser = useCallback((e) => {
		setActiveUser({
			name: e.currentTarget.getAttribute('data-user-name'),
			id: e.currentTarget.getAttribute('data-user-id'),
			isTeacher: !!e.currentTarget.getAttribute('data-is-teacher'),
		});
	}, []);
	const resetActiveUser = useCallback(() => setActiveUser(null), []);

	return (
		<Box
			bgcolor='background.paper'
			color='text.primary'
			position='fixed'
			bottom={10}
			right={10}
			zIndex='modal'
			className={`${classes.root} ${classes[showingScreen ? 'maximized' : 'minimized']}`}
		>
			<Grid container>
				<Grid item xs>
					{activeUser && (
						<Button
							variant='contained'
							color='primary'
							onClick={resetActiveUser}
							startIcon={<ChevronLeft />}
						>
							Back
						</Button>
					)}
				</Grid>
				<Grid item xs>
					<Typography align='right'>
						<IconButton color='primary' onClick={toggleShowingScreen}>
							{showingScreen ? <Minimize /> : <Chat />}
						</IconButton>
					</Typography>
				</Grid>
			</Grid>
			{showingScreen && !activeUser && (
				<List
					component='nav'
					aria-labelledby='student-list'
					subheader={<ListSubheader id='student-list'>Students</ListSubheader>}
				>
					{users.map((user, ind) => (
						<MemStudent key={ind} {...user} update={updateActiveUser} />
					))}
				</List>
			)}
			{showingScreen && activeUser && (
				<Typography>
					<Typography component='span' align='center' gutterBottom>
						You are chatting with {activeUser.name}
					</Typography>
					{!activeUser.isTeacher &&
						emojis.map((emo, ind) => (
							<Button
								key={ind}
								data-value={emo}
								onClick={() => {
									if (!msgClient || typeof msgClient.sendMessageToPeer !== 'function') return;
									msgClient.sendMessageToPeer({ text: emo }, activeUser.id).then((sendResult) => {
										if (sendResult.hasPeerReceived) {
											console.log('sent');
										} else {
											console.log('not sent');
										}
									});
								}}
							>
								{emo}
							</Button>
						))}
				</Typography>
			)}
		</Box>
	);
};

var Student = ({ name, id, points = 0, isTeacher, update }) => {
	if (!name) return '';
	return (
		<ListItem
			data-user-name={name}
			data-user-id={id}
			{...(isTeacher ? { 'data-is-teacher': true } : {})}
			button
			onClick={update}
		>
			<ListItemIcon>
				<Chat />
			</ListItemIcon>
			<ListItemText primary={name} secondary={points + ' pts'} />
		</ListItem>
	);
};

var MemStudent = React.memo(
	Student,
	(prevProps, nextProps) =>
		prevProps.name === nextProps.name && prevProps.points === nextProps.points
);

ChatScreen.defaultProps = {
	users: [
		{ name: 'student1', points: 5 },
		{ name: 'student2', points: 10 },
		{ name: 'student3', points: 15 },
	],
};

ChatScreen.propTypes = { users: PropTypes.array };

export default ChatScreen;
