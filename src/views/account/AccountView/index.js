import React from 'react';
import { Box, Container, Grid, makeStyles } from '@material-ui/core';
// import Notifications from './Notifications';
import Page from '../../../components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import Notifications from './Notifications';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const Account = () => {
	const classes = useStyles();

	return (
		<Page className={classes.root} title='Profile | Letterchefs'>
			<Container maxWidth='lg'>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6} lg={4}>
						<Profile />
					</Grid>
					<Grid item xs={12} md={6} lg={8}>
						<ProfileDetails />
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default Account;
