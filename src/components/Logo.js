import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { common } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		display: 'flex',
	},
	logoContainer: {
		display: 'flex',
	},
	logoText: {
		alignSelf: 'center',
		color: common.grey,
		fontSize: '1.7rem',
		paddingLeft: theme.spacing(1),
		'&:hover': {
			textDecoration: 'none',
		},
	},
}));

const Logo = (props) => {
	const classes = useStyles();

	return (
		<div className={classes.logoContainer}>
			<RouterLink to='/'>
				<img
					src='/static/images/logo/letterchefs-50x75.png'
					className={classes.logo}
					{...props}
					alt='letterchefs logo'
				/>
			</RouterLink>
			<RouterLink to='/' className={classes.logoText}>
				<span>LetterChefs</span>
			</RouterLink>
		</div>
	);
};

export default Logo;
