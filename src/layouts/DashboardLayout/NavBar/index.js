import React, { Fragment, useEffect } from 'react';
import { useLocation /*useNavigate*/ } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Drawer, Grid, Hidden, Link, List, Typography, makeStyles } from '@material-ui/core';
import { blueGrey /*, grey */ } from '@material-ui/core/colors';
import Color from '../../../mixins/palette';
import {
	Activity as ActivityIcon,
	AlertCircle as AlertCircleIcon,
	// BarChart as BarChartIcon,
	//Bell as BellIcon,
	BookOpen as BookOpenIcon,
	// Briefcase as BriefcaseIcon,
	// Calendar as CalendarIcon,
	Check as CheckIcon,
	// Lock as LockIcon,
	Settings as SettingsIcon,
	// ShoppingBag as ShoppingBagIcon,
	// Star as StarIcon,
	// User as UserIcon,
	// UserPlus as UserPlusIcon,
	// Users as UsersIcon,
	// LogOut as LogOutIcon,
} from 'react-feather';

import NavItem from './NavItem';
import LinkButton from '../../../components/LinkButton';
import { userDetails, Http, signOut } from '../../../helpers';

const menuTeachers = [
	{
		href: '/app/ideas',
		icon: CheckIcon,
		title: 'Ideas for Class',
	},
	{
		href: '/app/reading-sessions',
		icon: BookOpenIcon,
		title: 'Reading Sessions',
	},
	// {
	// 	href: '/classes',
	// 	icon: BriefcaseIcon,
	// 	title: 'Classes',
	// },
	// {
	// 	href: '/app/parents',
	// 	icon: UsersIcon,
	// 	title: 'Parents Center',
	// },
	// {
	// 	href: '/app/students',
	// 	icon: StarIcon,
	// 	title: 'Students',
	// },
];

const menuParents = [
	{
		href: '/app/storytime',
		icon: BookOpenIcon,
		title: 'Your Storytimes',
	},
];

const commonMenu = [
	// {
	// 	href: '/app/updates',
	// 	icon: ActivityIcon,
	// 	title: 'Updates',
	// },
	// {
	// 	href: '/login',
	// 	icon: LockIcon,
	// 	title: 'Login',
	// },
	// {
	// 	href: '/register',
	// 	icon: UserPlusIcon,
	// 	title: 'Register',
	// },
	// {
	// 	href: '/404',
	// 	icon: AlertCircleIcon,
	// 	title: 'Error',
	// },
];

const secondaryItems = [
	{
		href: '/app/profile',
		icon: SettingsIcon,
		title: 'Profile',
	},
];

const useStyles = makeStyles(() => ({
	mobileDrawer: {
		width: 256,
	},
	desktopDrawer: {
		width: 256,
		height: '100vh',
		backgroundColor: Color.hex.blue,
		color: blueGrey[50],
	},
	avatar: {
		cursor: 'pointer',
		width: 64,
		height: 64,
	},
}));

const NavBar = ({ onMobileClose, openMobile }) => {
	const classes = useStyles();
	const location = useLocation();
	const { family_name, given_name, email, user_type } = userDetails;

	let items = [];
	if (user_type === 'teacher') {
		items = [...menuTeachers, ...commonMenu];
	} else if (user_type === 'parent' || user_type === 'student') {
		items = [...menuParents, ...commonMenu];
	}
	console.log(items);

	useEffect(() => {
		if (openMobile && onMobileClose) {
			onMobileClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	// const navigate = useNavigate();
	const handleLogOut = () => {
		const logOut = () => {
			signOut(false);
			const timer = setTimeout(() => {
				window.location.href = '/';
				clearTimeout(timer);
			}, 500);
		};
		Http().secureRequest({
			url: `/users/logout`,
			method: 'DELETE',
			successCallback: logOut,
			errorCallback: logOut,
		});
	};

	const content = (
		<Box height='100%' display='flex' flexDirection='column'>
			<Grid container>
				<Grid item xs={12} sm={3}>
					<Link href='/'>
						<img
							src='/static/images/logo/letterchefs-50x75.png'
							className={classes.logo}
							alt='letterchefs-logo'
						/>
					</Link>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Box alignItems='flex-end' display='flex' flexDirection='column' p={1}>
						<Typography className={classes.name} variant='h5'>
							{given_name} {family_name}
						</Typography>
						<Typography className={classes.name} variant='body2'>
							{email}
						</Typography>
						<Typography className={classes.name} variant='body2'>
							{user_type}
						</Typography>
					</Box>
				</Grid>
			</Grid>

			<Box p={2}>
				<List>
					{items.map((item) => (
						<NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
					))}
				</List>
				{user_type === 'teacher' && (
					<LinkButton
						fullWidth
						variant='contained'
						size='large'
						component='button'
						href='/create-reading-session'
					>
						Create New Class
					</LinkButton>
				)}
				{(user_type === 'parent' || user_type === 'student') && (
					<LinkButton
						fullWidth
						variant='contained'
						size='large'
						component='button'
						href='/create-reading-session'
					>
						Explore Stories
					</LinkButton>
				)}
			</Box>

			<Box flexGrow={1} />
			<Box m={2} className={classes.secondary}>
				<List>
					{secondaryItems.map((item) => (
						<NavItem
							href={item.href}
							icon={item.icon}
							key={item.title}
							title={item.title}
							onClick={item.onClick}
						/>
					))}
					{<NavItem title='Log out' icon={AlertCircleIcon} onClick={handleLogOut} />}
				</List>
			</Box>
		</Box>
	);

	return (
		<Fragment>
			<Hidden lgUp>
				<Drawer
					anchor='left'
					classes={{ paper: classes.mobileDrawer }}
					onClose={onMobileClose}
					open={openMobile}
					variant='temporary'
				>
					{content}
				</Drawer>
			</Hidden>
			<Hidden mdDown>
				<Drawer anchor='left' classes={{ paper: classes.desktopDrawer }} open variant='persistent'>
					{content}
				</Drawer>
			</Hidden>
		</Fragment>
	);
};

NavBar.propTypes = {
	onMobileClose: PropTypes.func,
	openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
	onMobileClose: () => {},
	openMobile: false,
};

export default NavBar;
