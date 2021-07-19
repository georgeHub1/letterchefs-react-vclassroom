import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import {
	Box,
	Button,
	Container,
	// Divider,
	FormControl,
	Grid,
	InputLabel,
	Link,
	makeStyles,
	MenuItem,
	Select,
	Typography,
	TextField,
} from '@material-ui/core';
import GoogleIcon from '../../icons/Google';
import Color from '../../mixins/palette';
import { common, grey } from '@material-ui/core/colors';
import LinkButton from '../../components/LinkButton';
import { apiOrigin, devHostName } from '../../config';
import { downloadUserDetails, Http, tryAgainMsg } from '../../helpers';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: Color.hex.grape,
	},
	box: {
		color: common.grey,
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
		position: 'relative',
	},
	formControl: {
		margin: theme.spacing(1),
	},
	header: {
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(10),
	},
	or: {
		color: grey[500],
		overflow: 'hidden',
		textAlign: 'center',
		margin: '0 auto',
		fontFamily: 'Hanoi Schoolgirl, Arial, Helvetica, serif;',
		fontSize: '3em',
		'&:before': {
			backgroundColor: grey[500],
			content: `""`,
			display: 'inline-block',
			height: 1,
			position: 'relative',
			verticalAlign: 'middle',
			width: '50%',
			right: '0.5em',
			marginLeft: '-50%',
		},
		'&:after': {
			backgroundColor: grey[500],
			content: `""`,
			display: 'inline-block',
			height: 1,
			position: 'relative',
			verticalAlign: 'middle',
			width: '50%',
			left: '0.5em',
			marginRight: '-50%',
			clear: 'both',
		},
	},
	paper: {
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),
		paddingBottom: theme.spacing(3),
	},
	sideImage: {
		width: '100%',
	},
	subtitle: {
		paddingBottom: theme.spacing(3),
	},
	error: { color: 'red' },
}));

const LoginView = ({ subtitle, isSignUp }) => {
	const isDev = window && window.location.hostname === devHostName;

	const classes = useStyles();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const updateEmail = useCallback((e) => setEmail(e.target.value), []);
	const [pass, setPass] = useState('');
	const updatePass = useCallback((e) => setPass(e.target.value), []);
	const [userType, setUserType] = useState('');
	const updateUserType = useCallback((e) => setUserType(e.target.value), []);

	const [loginErr, setLoginError] = useState('');

	useEffect(() => {
		if (window && window.location.search.includes('user_id'))
			downloadUserDetails({
				errMsg: 'Error getting user details',
				notFoundMsg: 'User not found or invalid key',
				notSentMsg: 'Unable to connect. ' + tryAgainMsg(),
			})
				.then((resp) => {
					if (resp && window) window.location.href = '/';
				})
				.catch((e) => console.error(e));
	}, []);

	const subtitleMessage = subtitle || 'Welcome';
	const loginText = isSignUp ? 'Sign Up' : 'Sign In';
	const alternateLoginText = isSignUp ? 'Sign In' : 'Sign Up';
	const hasAccountText = isSignUp ? 'Already have an account?' : "Don't have an account?";

	let loginAgents = [
		{
			role: 'parent',
			forwardUrl: '/app/account',
			buttonColor: 'primary',
			buttonVariant: 'contained',
		},
		{
			role: 'teacher',
			forwardUrl: '/app/account',
			buttonColor: 'secondary',
			buttonVariant: 'contained',
		},
		{
			role: 'author',
			forwardUrl: '/app/account',
			buttonColor: 'primary',
			buttonVariant: 'outlined',
		},
		// {
		// 	role: 'admin',
		// 	userType: 'administrator',
		// 	forwardUrl: '/app/account',
		// 	buttonColor: 'secondary',
		// 	buttonVariant: 'contained',
		// },
	];

	const alternateUrl = isSignUp ? '/login/' : '/register/';
	let agent;
	const authUrl = window.location.pathname;
	if (authUrl.indexOf('teacher') >= 0) {
		agent = loginAgents[1];
	} else if (authUrl.indexOf('author') >= 0) {
		agent = loginAgents[2];
	} else {
		agent = loginAgents[0];
	}

	const { role, forwardUrl, buttonVariant, buttonColor } = agent;

	console.log('loginAgents', agent);
	const handleEmailLogin = (e) => {
		e.preventDefault();
		setLoginError('');

		Http().secureRequest({
			url: '/users/login',
			method: 'POST',
			body: { email, pass, user_type: userType },
			successCallback: ({ status, data, error }) => {
				if (!status) {
					return setLoginError(error || 'Unable to log you in!');
				}
				if (!window) {
					return;
				}
				window.location.href = window.location.pathname + '?user_id=' + data.id;
			},
			errorCallback: () => setLoginError('Unable to reach the server. ' + tryAgainMsg()),
		});
	};

	const persons = ['author', 'admin', 'teacher', 'student', 'parent', 'guest'];

	return (
		<Fragment>
			<Typography variant='h3' className={classes.subtitle}>
				{`${subtitleMessage} ${role.charAt(0).toUpperCase()}${role
					.substr(1)
					.toLowerCase()}s, ${loginText}`}
			</Typography>
			<Grid container>
				<Grid item xs={6}>
					<Container>
						<img
							src='/static/images/scenes/family.png'
							alt='parents and child'
							className={classes.sideImage}
						/>
					</Container>
				</Grid>

				<Grid item xs={6}>
					<Formik
						onSubmit={() => {
							navigate(forwardUrl, { replace: true });
						}}
					>
						{({
							// errors,
							// handleBlur,
							// handleChange,
							handleSubmit,
							// isSubmitting,
							// touched,
							// values,
						}) => (
							<form onSubmit={handleSubmit}>
								<Box mt={2} mb={2}>
									<LinkButton
										external
										href={`${apiOrigin}/users/login/google-auth?user_type=${role}&authenticate=true`}
										startIcon={<GoogleIcon />}
										size='large'
										variant={buttonVariant}
										color={buttonColor}
									>
										{loginText} with Google
									</LinkButton>
									<Typography paragraph gutterBottom color='textSecondary' variant='body1'>
										{`${hasAccountText} `}
										<Link component={RouterLink} to={`${alternateUrl}/${role}/`} variant='h6'>
											{alternateLoginText}
										</Link>
									</Typography>
								</Box>
							</form>
						)}
					</Formik>
					<div className={classes.or}>or</div>
					<form noValidate autoComplete='on' onSubmit={handleEmailLogin}>
						<Box mb={2}>
							<TextField
								fullWidth
								variant='outlined'
								type='email'
								label='Email'
								value={email}
								onChange={updateEmail}
								required
							/>
						</Box>
						<Box mb={2}>
							<TextField
								fullWidth
								variant='outlined'
								type='password'
								label='Password'
								value={pass}
								onChange={updatePass}
								required
							/>
						</Box>
						{loginErr && <Typography className={classes.error}>{loginErr}</Typography>}
						<Button color='primary' variant='contained' size='large' type='submit'>
							{loginText}
						</Button>
					</form>

					{isDev && (
						<form noValidate autoComplete='on' onSubmit={handleEmailLogin}>
							<div>
								<TextField
									type='email'
									label='Email'
									value={email}
									onChange={updateEmail}
									required
								/>
							</div>
							<div>
								<TextField
									type='password'
									label='Password'
									value={pass}
									onChange={updatePass}
									required
								/>
							</div>
							<div>
								<FormControl className={classes.formControl} fullWidth>
									<InputLabel htmlFor='select-user-type'>User type</InputLabel>
									<Select
										labelId='select-user-type'
										helperText='Select a user type'
										defaultValue={persons[0]}
										value={userType}
										onChange={updateUserType}
										select
										required
									>
										{persons.map((person, ind) => (
											<MenuItem key={ind} value={person}>
												{person}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>
							{loginErr && <Typography className={classes.error}>{loginErr}</Typography>}
							<Button variant='contained' type='submit' color='secondary'>
								Log In
							</Button>
						</form>
					)}
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default LoginView;
