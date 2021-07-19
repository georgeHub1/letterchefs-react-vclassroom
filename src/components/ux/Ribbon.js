import React from 'react';
import PropTypes from 'prop-types';
import { common } from '@material-ui/core/colors';
import Color from '../../mixins/palette';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

function Ribbon({ position, color, ribbonText, ...rest }) {
	const ribbonBeforeAfter = {
		position: 'absolute',
		zIndex: -1,
		content: '""',
		display: 'block',
	};

	const useStyles = makeStyles((theme) => ({
		ribbon: {
			width: 150,
			height: 150,
			overflow: 'hidden',
			position: 'absolute',

			'&::before': ribbonBeforeAfter,
			'&::after': ribbonBeforeAfter,
			'& span': {
				position: 'absolute',
				display: 'block',
				width: 225,
				padding: `10px 0`,
				backgroundColor: Color.hex.liberty,
				// boxShadow: '0 5px 10px rgba(0,0,0,.1)',
				color: common.white,
				fontWeight: '700 18px/1',
				textShadow: '0 1px 1px rgba(0,0,0,.2)',
				textTransform: 'uppercase',
				textAlign: 'center',
			},
		},

		ribbonTopLeft: {
			top: -2,
			left: -2,

			'&::before': {
				borderTopColor: 'transparent',
				borderLeftColor: 'transparent',
				top: 0,
				right: 0,
			},

			'&::afer': {
				borderTopColor: 'transparent',
				borderLeftColor: 'transparent',
				bottom: 0,
				left: 0,
			},

			'& span': {
				right: -15,
				top: 30,
				transform: 'rotate(-45deg)',
			},
		},

		ribbonTopRight: {
			top: -2,
			right: -2,

			'&::before': {
				borderTopColor: 'transparent',
				borderLeftColor: 'transparent',
				top: 0,
				left: 0,
			},

			'&::afer': {
				borderTopColor: 'transparent',
				borderLeftColor: 'transparent',
				bottom: 0,
				right: 0,
			},

			'& span': {
				left: -25,
				top: 30,
				transform: 'rotate(45deg)',
			},
		},
	}));
	const classes = useStyles();

	return (
		<div className={clsx({ [classes.ribbon]: true, [classes.ribbonTopLeft]: position === 'left' })}>
			<span>{ribbonText}</span>
		</div>
	);
}

Ribbon.propTypes = {
	color: PropTypes.string,
};

export default Ribbon;
