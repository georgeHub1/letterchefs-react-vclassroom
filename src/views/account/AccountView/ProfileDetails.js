import React, { Fragment, useState, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	// Chip,
	CircularProgress,
	Divider,
	FormControl,
	FormHelperText,
	Grid,
	// Input,
	InputLabel,
	Link,
	makeStyles,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import moment from 'moment';

import languageNames from '../../../localstore/languages.json';
import countryNames from '../../../localstore/countries.json';

import { userDetails, Http, tryAgainMsg, saveUserDetails } from '../../../helpers';

import useStripeSetupButton from './useStripeSetupButton';
import LinkButton from '../../../components/LinkButton';

const dialectNames = {
	en: [
		{ title: 'British', value: 'en-gb' },
		{ title: 'American', value: 'en-us' },
		{ title: 'Australian', value: 'en-au' },
	],
	es: [
		{ title: 'Castellano', value: 'es-es' },
		{ title: 'Chileno', value: 'es-cl' },
		{ title: 'Mexican', value: 'es-mx' },
		{ title: 'Rioplatense', value: 'es-rio' },
		{ title: 'Northern Latin (Peru, Ecuador, Bolivia, Colombia)', value: 'es-no' },
		{ title: 'Caribbean', value: 'es-ca' },
		{ title: 'Puerto Rico', value: 'es-pr' },
		{ title: 'Dominican Republic', value: 'es-dr' },
	],
	vn: [
		{ title: 'Northern', value: 'vn-no' },
		{ title: 'Central', value: 'vn-ce' },
		{ title: 'Southern', value: 'vn-so' },
	],
	['cn-cmn']: [
		{ title: 'Beijing', value: 'cn-cmn-be' },
		{ title: 'Central Plains', value: 'cn-cmn-cp' },
		{ title: 'Jilu', value: 'cn-cmn-ji' },
		{ title: 'Jiaoliao', value: 'cn-cmn-jl' },
		{ title: 'Lanyin', value: 'cn-cmn-la' },
		{ title: 'Lower Yangtze', value: 'cn-cmn-lo' },
		{ title: 'Northeastern', value: 'cn-cmn-no' },
		{ title: 'Southwestern', value: 'cn-cmn-so' },
	],
	['cn-yue']: [
		{ title: 'Yuehai', value: 'cn-yue-yu' },
		{ title: 'Siyi', value: 'cn-yue-si' },
		{ title: 'Gaoyang', value: 'cn-yue-ga' },
		{ title: 'Guinan', value: 'cn-yue-gu' },
	],
};

const useStyles = makeStyles(() => ({
	root: {},
	textarea: {
		resize: 'both',
	},
}));

const ProfileDetails = ({ className, ...rest }) => {
	const classes = useStyles();
	const { user_type } = userDetails;

	const [isLoading, setIsLoading] = useState(false);
	// const [stripeIsLoading, setStripeIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [isUpdated, setIsUpdated] = useState(false);
	const countries = moment.tz.countries();
	console.log(countries);
	const countryPrettyNames = countries
		.map((country) => countryNames[country])
		.filter((c) => c !== undefined);
	console.log(countryPrettyNames);
	//countries = `${countries} (${countryNames[countries]})`;

	const [values, setValues] = useState(userDetails || {});
	const handleChange = useCallback((event) => {
		event.persist();
		setValues((x) => ({
			...x,
			[event.target.name]: event.target.value,
		}));
	}, []);

	const countryToFlag = (isoCode) => {
		console.log(isoCode);

		return isoCode
			.toUpperCase()
			.replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
		// return typeof String.fromCodePoint !== 'undefined'
		// 	? isoCode
		// 			.toUpperCase()
		// 			.replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
		// 	: isoCode;
	};

	const [languages, setLanguages] = useState(() => (userDetails.languages || 'en').split(','));
	const [dialectList, setDialectList] = useState(() => languages.map((language) => language.value));
	const handleLanguageChange = useCallback((e, languages) => {
		setLanguages(languages.map((language) => language.value));
		setDialectList(userDetails.languages.map((language) => [...dialectNames[language]]));
		return;
	}, []);

	const [dialects, setDialect] = useState(userDetails.dialects);
	const handleAccentChange = useCallback(
		(e, dialects) => setDialect(dialects.map((d) => d?.value)),
		[]
	);

	const [country, setCountry] = useState(userDetails.country || '');
	const handleCountryChange = useCallback((e, val) => {
		console.log('val', val);
		setCountry(val);
	}, []);

	// const ITEM_HEIGHT = 48;
	// const ITEM_PADDING_TOP = 8;
	// const MenuProps = {
	// 	PaperProps: {
	// 		style: {
	// 			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
	// 			width: 250,
	// 		},
	// 	},
	// };

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		const body = {
			given_name: values.given_name,
			family_name: values.family_name,
			...(userDetails.email_verified && values.email ? { email: values.email } : {}),
			phone: values.phone || '',
			title: values.title,
			organization_name: values.organization_name || '',
			bio: values.bio || '',
			languages: languages.join(','),
			country,
		};
		const rq = Http().secureRequest({
			url: `/users/${userDetails.id}`,
			method: 'PATCH',
			body,
			successCallback: ({ status, error }) => {
				if (!status) {
					setError(error || 'Could not update your profile');
					return;
				}

				saveUserDetails({ ...userDetails, ...body });
				setIsUpdated(true);
				const timer = setTimeout(() => {
					setIsUpdated(false);
					clearTimeout(timer);
				}, 3500);
			},
			errorCallback: () => setError('Unable to reach the server. ' + tryAgainMsg()),
		});
		rq.finally(() => setIsLoading(false));
	};

	const { connectError, error: stripeError, success, button: stripeBtn } = useStripeSetupButton();

	const stripeSetupComplete = !!(userDetails.stripe_customer_id && userDetails.stripe_account_id);

	return (
		<form
			className={clsx({ [classes.root]: true, [className]: true })}
			{...rest}
			onSubmit={handleSubmit}
		>
			<Card>
				<CardHeader subheader='Update Your Public Profile' title='Profile' />
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								helperText='What your friends call you'
								label='First name'
								name='given_name'
								onChange={handleChange}
								required
								value={values.given_name}
								variant='outlined'
								autoComplete='given-name'
								inputProps={{ maxLength: 100 }}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								helperText='What your friends call your entire family...'
								label='Last name'
								name='family_name'
								onChange={handleChange}
								required
								value={values.family_name ? values.family_name : ''}
								variant='outlined'
								autoComplete='family-name'
								inputProps={{ maxLength: 100 }}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								helperText='Where you converse with people, with your voice at volume 0.'
								label='Email Address'
								name='email'
								type='email'
								onChange={handleChange}
								disabled={!!userDetails.email_verified}
								required={!userDetails.email_verified}
								value={values.email ? values.email : ''}
								variant='outlined'
								autoComplete='email'
								inputProps={{ maxLength: 300, readOnly: !!userDetails.email_verified }}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label='Phone Number'
								name='phone'
								type='tel'
								onChange={handleChange}
								value={values.phone ? values.phone : ''}
								variant='outlined'
								helperText='Get reminders on your phone.'
								autoComplete='tel'
								inputProps={{ maxLength: 25 }}
							/>
						</Grid>
						<Divider />
						{user_type === 'teacher' && (
							<Fragment>
								<Grid item sm={6} xs={12}>
									<FormControl variant='outlined' fullWidth>
										<InputLabel id='profile-title' required>
											Title
										</InputLabel>
										<Select
											variant='outlined'
											label='Title'
											labelId='profile-title'
											name='title'
											value={values.title}
											onChange={handleChange}
											required
										>
											<MenuItem value=''>
												<em>None</em>
											</MenuItem>
											<MenuItem value='mr'>Mr.</MenuItem>
											<MenuItem value='mrs'>Mrs.</MenuItem>
											<MenuItem value='ms'>Ms.</MenuItem>
										</Select>
										<FormHelperText>How you would like your students to call you</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										label='Organization Name'
										name='organization_name'
										onChange={handleChange}
										value={values.organization_name}
										variant='outlined'
										helperText='The Name of your organization.'
										autoComplete='organization'
										inputProps={{ maxLength: 300 }}
									/>
								</Grid>
							</Fragment>
						)}
						<Grid item xs={12}>
							<TextField
								fullWidth
								id='about-you'
								label='About You'
								name='bio'
								helperText={`Let's give 'em somethin' to talk about...a little mystery to figure out. Yeah!`}
								placeholder='Write something about you...'
								multiline
								rows={3}
								rowsMax={20}
								variant='outlined'
								value={values.bio}
								onChange={handleChange}
								inputProps={{ className: classes.textarea, maxLength: 65535 }}
							/>
						</Grid>
						<Divider />
						<Grid item xs={12}>
							<FormControl fullWidth className={classes.formControl}>
								<Autocomplete
									multiple
									id='mutiple-language'
									options={languageNames}
									getOptionLabel={(opt) => opt.title}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											label='Select the languages you speak'
											placeholder='Language'
											inputProps={{
												...params.inputProps,
												autoComplete: 'new-password',
											}}
										/>
									)}
									value={languages
										.filter((l) => !!l)
										.map((l) => languageNames.find((language) => language.value === l))}
									onChange={handleLanguageChange}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth className={classes.formControl}>
								<Autocomplete
									id='user-country'
									options={countries}
									getOptionLabel={(option) => {
										return option
											? `${countryToFlag(option)} ${option} (${countryNames[option]})`
											: undefined;
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											label='Country'
											placeholder='Country'
											inputProps={{
												...params.inputProps,
												autoComplete: 'new-password',
											}}
										/>
									)}
									value={country}
									onChange={handleCountryChange}
								/>
							</FormControl>
						</Grid>
					</Grid>
				</CardContent>
				<Divider />

				<Box display='flex' justifyContent='flex-end' p={2}>
					{error && <Alert severity='error'>{error}</Alert>}
					{isUpdated && <Alert severity='success'>Profile successfully updated!</Alert>}
					<Button
						type='submit'
						color='primary'
						variant='contained'
						size='large'
						disabled={isLoading}
					>
						{isLoading ? <CircularProgress /> : 'Save details'}
					</Button>
				</Box>
			</Card>
			<Box p={2}></Box>
			<Card>
				<CardHeader
					subheader='We partner with Stripe to handle payments to our storytellers.'
					title='Setup Payouts'
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{connectError && <Alert severity='error'>{connectError}</Alert>}
							{stripeError && <Alert severity='error'>{stripeError}</Alert>}
							{success && <Alert severity='success'>{success}</Alert>}
							{stripeSetupComplete && (
								<Typography variant='body2'>
									You are set up to receive payouts. We are also only an email away. Feel free to
									email if you have any questions or just want to say hello.
								</Typography>
							)}
							{!stripeSetupComplete && (
								<Typography variant='body2'>
									Let&lsquo;s get you set up to receive payments!
								</Typography>
							)}
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
				<Box display='flex' justifyContent='flex-end' p={2}>
					{error && <Alert severity='error'>{error}</Alert>}
					{isUpdated && <Alert severity='success'>Profile successfully updated!</Alert>}
					{!stripeSetupComplete && (
						<Button align='right' color='primary' variant='contained' disabled={isLoading}>
							{isLoading ? <CircularProgress /> : stripeBtn}
						</Button>
					)}
					{stripeSetupComplete && (
						<LinkButton
							align='right'
							color='primary'
							variant='contained'
							href='mailto:support@letterchefs.com'
						>
							Email Support
						</LinkButton>
					)}
				</Box>
			</Card>
		</form>
	);
};

ProfileDetails.propTypes = {
	className: PropTypes.string,
};

export default ProfileDetails;
