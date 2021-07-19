import React from 'react';
import { Outlet } from 'react-router-dom';
import { /* Paper, Box, */ Grid, makeStyles } from '@material-ui/core';
import Page from '../../components/Page';
import Color from '../../mixins/palette';

const useStyles = makeStyles((theme) => ({
	root: {
		background: Color.ombre.fog,
		minHeight: '100%',
		overflowY: 'scroll',
	},
	container: {
		padding: theme.spacing(5),
	},
	outlet: {
		margin: 0,
	},
}));

const BookLayout = (props) => {
	const classes = useStyles();
	const { pageTitle } = props;

	return (
		<Page title={`${pageTitle || 'Book'} | Bilingual Live Reading Classes | LetterChefs`}>
			<Grid container className={classes.root} justify='center'>
				<Grid item className={classes.container} xs={12}>
					<Outlet />
				</Grid>
			</Grid>
		</Page>
	);
};

export default BookLayout;
