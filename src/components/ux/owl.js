import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { common, blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => {
	// const { indigo } = colors;

	return {
		owl: {
			position: 'relative',
			margin: '40px auto 0',
			width: 200,

			'&:hover': {
				wing: {
					'-webkit-transform': 'rotate(90deg)',
					'&:nth-child(2)': {
						'-webkit-transform': 'rotate(-90deg)',
					},
				},

				'.head': {
					top: 5,
				},
			},
		},

		pupil: {
			position: 'absolute',
			top: 20,
			left: 20,
			width: 50,
			height: 50,
			borderRadius: 25,
			background: common.black,

			'&::after': {
				position: 'absolute',
				top: 0,
				right: 0,
				display: 'block',
				width: 24,
				height: 24,
				borderRadius: 12,
				background: common.white,
				content: '',
			},
		},

		eye: {
			position: 'absolute',
			top: 10,
			left: 10,
			width: 90,
			height: 90,
			borderRadius: 45,
			background: common.white,

			'&:nth-child(2)': {
				left: 98,
			},
		},
		eyes: {
			position: 'absolute',
			top: 10,
			left: -20,
			width: 110,
			height: 110,
			borderRadius: 55,
			background: blue[200],

			'&::before': {
				position: 'absolute',
				left: 88,
				display: 'block',
				width: 110,
				height: 110,
				borderRadius: 55,
				background: blue[200],
				content: '',
			},
		},

		beak: {
			position: 'absolute',
			top: 60,
			left: 49,
			display: 'block',
			width: 0,
			height: 0,
			borderTop: '60px solid #ef8e1b',
			borderRight: '50px solid transparent',
			borderLeft: '50px solid transparent',
			content: '',
		},

		head: {
			position: 'absolute',
			width: 160,
			height: 80,
			borderRadius: 2,
			background: '#64c2de',

			'&::before': {
				position: 'absolute',
				top: 0,
				left: 15,
				display: 'block',
				width: 0,
				height: 0,
				borderRight: '15px solid transparent',
				borderBottom: '15px solid #64c2de',
				borderLeft: '15px solid transparent',
				content: '',
				'-webkit-transform': 'rotate(-15deg)',
			},

			'&::after': {
				position: 'absolute',
				top: 0,
				right: 18,
				zIndex: -1,
				display: 'block',
				width: 0,
				height: 0,
				borderRight: '15px solid transparent',
				borderBottom: '15px solid #64c2de',
				borderLeft: '15px solid transparent',
				content: '',
				'-webkit-transform': 'rotate(15deg)',
			},
		},

		body: {
			position: 'absolute',
			top: 100,
			width: 160,
			height: 100,
			borderRadius: 2,
			background: '#98e0f8',
		},

		wing: {
			position: 'absolute',
			top: 0,
			left: -20,
			width: 50,
			height: 100,
			borderRadius: '50px 0',
			background: '#64c2de',
			'-webkit-transform-origin': '30px 10px',
			'-webkit-transform': 'rotate(-20deg)',

			'&:nth-child(2)': {
				left: 130,
				borderRadius: '0 50px',
				'-webkit-transform-origin': '20px 10px',
				'-webkit-transform': 'rotate(20deg)',
			},
		},

		feet: {
			position: 'absolute',
			bottom: -5,
			left: 50,
			width: 6,
			height: 18,
			borderRadius: 1 / 3,
			background: '#ef8e1b',
			'-webkit-transform': 'rotate(10deg)',

			'&::before': {
				position: 'absolute',
				bottom: 0,
				left: -6,
				display: 'block',
				width: 6,
				height: 18,
				borderRadius: 1 / 3,
				background: '#ef8e1b',
				content: '',
			},

			'&::after': {
				position: 'absolute',
				bottom: 0,
				left: 6,
				display: 'block',
				width: 6,
				height: 18,
				borderRadius: 1 / 3,
				background: '#ef8e1b',
				content: '',
			},
		},

		right: {
			left: 104,
			'-webkit-transform': 'rotate(-10deg)',
		},

		feather: {
			position: 'absolute',
			top: 65,
			left: 72,
			width: 0,
			height: 0,
			borderTop: '10px solid #64c2de',
			borderRight: '7px solid transparent',
			borderLeft: '7px solid transparent',

			'&::before': {
				position: 'absolute',
				top: -30,
				left: -20,
				display: 'block',
				width: 0,
				height: 0,
				borderTop: '10px solid #64c2de',
				borderRight: '7px solid transparent',
				borderLeft: '7px solid transparent',
				content: '',
				' -webkit-transform': 'rotate(5deg)',
			},

			'&::after': {
				position: 'absolute',
				top: -30,
				left: 7,
				display: 'block',
				width: 0,
				height: 0,
				borderTop: '10px solid #64c2de',
				borderRight: '7px solid transparent',
				borderLeft: '7px solid transparent',
				content: '',
				' -webkit-transform': 'rotate(-5deg)',
			},
		},
	};
});

const Owl = () => {
	const classes = useStyles();

	return (
		<div className={classes.owl}>
			<div className={classes.body}>
				<div className={classes.wing}></div>
				<div className={classes.wing}></div>
				<div className={classes.feet}></div>
				<div className={`${classes.feet} ${classes.right}`}></div>
				<div className={classes.feather}></div>
			</div>
			<div className={classes.head}>
				<div className={classes.eyes}>
					<div className={classes.beak}></div>
					<div className={classes.eye}>
						<div className={classes.pupil}></div>
					</div>
					<div className={classes.eye}>
						<div className={classes.pupil}></div>
					</div>
				</div>
			</div>
		</div>
	);
};

Owl.propTypes = {};

export default Owl;
