import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import NavBar from './NavBar';
import Color from '../../mixins/palette';
// import TopBar from './TopBar';

const useStyles = makeStyles((theme) => ({
	root2: {
		display: 'flex',
		minHeight: '100vh',
		overflow: 'hidden',
	},
	wrapper: {
		background: Color.ombre.sunset,
		display: 'flex',
		flex: '1 1 auto',
		overflow: 'hidden',
		[theme.breakpoints.up('lg')]: {
			paddingLeft: 256,
		},
	},
}));

const DashboardLayout = () => {
	const classes = useStyles();
	const [isMobileNavOpen, setMobileNavOpen] = useState(false);

	return (
		<div className={classes.root2}>
			{/* <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} /> */}
			<NavBar onMobileClose={() => setMobileNavOpen(false)} openMobile={isMobileNavOpen} />
			<div className={classes.wrapper}>
				<Outlet />
			</div>
		</div>
	);
};

export default DashboardLayout;
