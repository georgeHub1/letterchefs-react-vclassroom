import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button, ListItem, makeStyles } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
	item: {
		display: 'flex',
		paddingTop: 0,
		paddingBottom: 0,
	},
	button: {
		color: blueGrey[50],
		fontSize: '1.1rem',
		fontWeight: theme.typography.fontWeightLarge,
		justifyContent: 'flex-start',
		letterSpacing: 0,
		textTransform: 'none',
		width: '100%',
	},
	icon: {
		marginRight: theme.spacing(1),
	},
	title: {
		marginRight: 'auto',
	},
	active: {
		color: blueGrey[50],
		'& $title': {
			fontWeight: theme.typography.fontWeightMedium,
		},
		'& $icon': {
			color: blueGrey[50],
		},
	},
}));

const NavItem = ({ className, href, icon: Icon, title, onClick, ...rest }) => {
	const classes = useStyles();

	return (
		<ListItem className={clsx(classes.item, className)} disableGutters {...rest}>
			<Button
				activeclassname={classes.active}
				className={classes.button}
				{...(onClick ? {} : { component: RouterLink })}
				to={href}
				size='large'
				onClick={onClick}
			>
				{Icon && <Icon className={classes.icon} size='20' />}
				<span className={classes.title}>{title}</span>
			</Button>
		</ListItem>
	);
};

NavItem.propTypes = {
	className: PropTypes.string,
	href: PropTypes.string,
	icon: PropTypes.elementType,
	title: PropTypes.string,
};

export default NavItem;
