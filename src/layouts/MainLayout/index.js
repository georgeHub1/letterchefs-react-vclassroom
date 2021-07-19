import React from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((/* theme */) => ({
	root: {
		display: 'flex',
		width: '100%',
	},
	container: {
		width: '100%',
		minHeight: '100%',
	},
	outlet: {
		margin: 0,
	},
}));

const MainLayout = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<Outlet className={classes.outlet} />
			</div>
		</div>
	);
};

export default MainLayout;
