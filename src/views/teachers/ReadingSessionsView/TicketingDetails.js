import React, { Fragment, useState, useCallback } from 'react';
import {
	Button,
	Container,
	Grid,
	Icon,
	Input,
	InputAdornment,
	makeStyles,
	TextField,
} from '@material-ui/core';
import { red, green } from '@material-ui/core/colors';
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { AccessTime } from '@material-ui/icons';
import * as moment from 'moment-timezone';
import Color from '../../../mixins/palette';

const useStyles = makeStyles((theme) => ({
	freeSelected: {
		color: Color.hex.berry,
		marginRight: theme.spacing(2),
	},
	free: {
		color: red[200],
		marginRight: theme.spacing(2),
	},
	paid: {
		color: green[200],
		marginRight: theme.spacing(2),
	},
	paidSelected: {
		color: Color.hex.grape,
		marginRight: theme.spacing(2),
	},
}));

const TicketingDetails = ({ currency, priceType, setPriceType, price, handleChangePrice }) => {
	const classes = useStyles();
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

	const handleChange = (e, newPriceType) => {
		e.preventDefault();

		setPriceType(newPriceType);
		console.log(e.target);
		console.log(newPriceType, price);
	};

	return (
		<Fragment>
			<Container>
				<Grid container>
					<Grid item xs={12} md={3}>
						<ToggleButtonGroup size='large' value={priceType} exclusive onChange={handleChange}>
							<ToggleButton value='free'>
								<Icon className={classes.free}>favorite</Icon>
								Free
							</ToggleButton>
							<ToggleButton value='paid'>
								<Icon className={classes.paid}>payment</Icon>Paid
							</ToggleButton>
						</ToggleButtonGroup>
					</Grid>
					<Grid item xs={12} md={2}>
						{priceType === 'paid' && (
							<div className={classes.price}>
								<TextField
									fullWidth
									name='ticket-price'
									variant='outlined'
									startAdornment={<Icon>payment</Icon>}
									type='number'
									value={price}
									onChange={handleChangePrice}
									required={price === 'paid'}
								/>
							</div>
						)}
					</Grid>
					<Grid item xs={12} md={1}>
						{priceType === 'paid' && (
							<div className={classes.price}>
								<TextField
									fullWidth
									name='ticket-currency'
									variant='outlined'
									startAdornment={<Icon>payment</Icon>}
									type='text'
									value={currency}
									required={price === 'paid'}
								/>
							</div>
						)}
					</Grid>
				</Grid>
			</Container>
		</Fragment>
	);
};

export default TicketingDetails;
