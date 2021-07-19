import React, { Fragment, useState } from 'react';
import { Container, Grid, InputAdornment, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AccessTime } from '@material-ui/icons';
import * as moment from 'moment-timezone';

const PayoutDetails = ({ value, updateValue }) => {
	const Us = ['US'];
	const allCountries = moment.tz.countries();
	allCountries.splice(allCountries.indexOf('US'), 1);
	const countriesNotUs = allCountries;
	const worldCountries = [...Us, ...countriesNotUs];
	const [country, setCountry] = useState('US');

	console.log(worldCountries);
	const countriesProps = {
		options: worldCountries,
		getOptionLabel: (option) => {
			// console.log('option', option);
			return option;
		},
	};

	console.log('country', country, countriesProps);
	//console.log('countriesProps', countriesProps);
	const handleUpdateCountry = (e) => {
		setCountry(e.target.value);
	};

	return (
		<Fragment>
			<Container>
				<Grid container>
					<Grid item xs={12} md={6}>
						<Autocomplete
							{...countriesProps}
							id='payout-country'
							renderInput={(params) => {
								console.log(params);
								return (
									<TextField
										{...params}
										label='Country'
										variant='outlined'
										value={country}
										onChange={handleUpdateCountry}
										InputProps={{
											endAdornment: (
												<InputAdornment position='end'>
													<AccessTime />
												</InputAdornment>
											),
										}}
									/>
								);
							}}
						/>
					</Grid>
				</Grid>
			</Container>
		</Fragment>
	);
};

export default PayoutDetails;
