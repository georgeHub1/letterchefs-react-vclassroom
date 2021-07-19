import React, { useState } from 'react';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import Page from '../../../components/Page';
import data from './data';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100vh',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const StorytimeView = () => {
	const classes = useStyles();

	return (
		<Page className={classes.root} title='Explore Stories | LetterChefs'>
			<Container maxWidth={false}>
				<Box mt={3} mb={3}>
					<Typography variant='h3'>Your Storytimes</Typography>
					<Typography variant='body1'>You have no events.</Typography>
				</Box>
			</Container>
		</Page>
	);
};

export default StorytimeView;
