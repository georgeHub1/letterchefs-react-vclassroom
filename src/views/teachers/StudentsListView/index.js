import React, { useState } from 'react';
// import PerfectScrollbar from 'react-perfect-scrollbar';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from '../../../components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import data from './data';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const StudentsListView = () => {
	const classes = useStyles();
	const [students] = useState(data);

	return (
		<Page className={classes.root} title='LetterChefs | Live Book Reading'>
			<Container maxWidth={false}>
				<Toolbar />
				<Box mt={3}>
					<Results students={students} />
				</Box>
			</Container>
		</Page>
	);
};

export default StudentsListView;
