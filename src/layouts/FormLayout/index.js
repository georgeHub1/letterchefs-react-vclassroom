import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Grid, Link, makeStyles, Paper } from '@material-ui/core';
import { common } from '@material-ui/core/colors';
import Page from '../../components/Page';
import Color from '../../mixins/palette';

const useStyles = makeStyles((theme) => ({
	root: {
		background: Color.ombre.sunset,
		minHeight: '100vh',
	},

	container: {
		padding: theme.spacing(5),
	},
	logoContainer: {
		display: 'flex',
		flexFlow: 'row wrap',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: theme.spacing(5),
	},
	logo: {
		alignSelf: 'center',
		width: 50,
	},
	logoText: {
		color: common.grey,
		paddingLeft: theme.spacing(1),
		fontWeight: 500,
		fontSize: 36,
		'&:hover': {
			textDecoration: 'none',
		},
	},
	outlet: {
		paddingTop: theme.spacing(5),
		margin: 0,
	},
}));

const FormLayout = (props) => {
	const classes = useStyles();
	const { pageTitle } = props;

	return (
		<Page title={`${pageTitle} | Bilingual Live Reading Classes | LetterChefs`}>
			<Grid container className={classes.root} justify='center' spacing={3}>
				<Grid item className={classes.container} xs={12} lg={8}>
					<Paper variant='outlined'>
						<Box pl={5} pr={5} pb={5}>
							<div className={classes.logoContainer}>
								<Link href='/'>
									<img
										src='/static/images/logo/letterchefs-50x75.png'
										className={classes.logo}
										alt='letterchefs logo'
									/>
								</Link>
								<Link href='/' className={classes.logoText}>
									LetterChefs
								</Link>
							</div>

							<Outlet className={classes.outlet} />
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Page>
	);
};

export default FormLayout;
