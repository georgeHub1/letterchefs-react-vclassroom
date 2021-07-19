import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, CircularProgress, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import Page from '../../../components/Page';
// import LinkButton from '../../../components/LinkButton';
import ReadingSessionCard from './ReadingSessionCard';

import { Http, tryAgainMsg } from '../../../helpers';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		width: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const Stories = () => {
	const classes = useStyles();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [stories, setStories] = useState([]);

	useEffect(() => {
		setIsLoading(true);

		const req = Http().secureRequest({
			url: '/reading-schedules/stories',
			successCallback: ({ status, data, error }) => {
				if (!status) {
					setError(error || 'Error getting stories');
					return;
				}

				setStories(data);
			},
			errorCallback: () => setError('Unable to get stories. ' + tryAgainMsg()),
		});

		req.finally(() => setIsLoading(false));
	}, []);

	return (
		<Page className={classes.root} title='Stories | LetterChefs'>
			<Container maxWidth={false}>
				<Grid container>
					<Grid item xs={9} align='start'>
						<Box mt={3} mb={2}>
							<Typography variant='h3'>Stories</Typography>
						</Box>
					</Grid>
					<Grid item xs={3} align='end'></Grid>
					<Grid item xs={12}>
						{error && <Alert severity='error'>{error}</Alert>}
						{isLoading && (
							<Typography align='center' component='div'>
								<CircularProgress />
							</Typography>
						)}

						{stories.length === 0 && (
							<Typography variant='body1'>There are currently no stories.</Typography>
						)}
						{stories.length > 0 && (
							<Typography variant='body1'>List of available stories.</Typography>
						)}

						{stories.map((story, index) => (
							<ReadingSessionCard key={index} isStory {...story} />
						))}
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default Stories;
