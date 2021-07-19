import React, { Fragment, useState, useCallback, useEffect } from 'react';
import {
	Box,
	// Button,
	colors,
	Container,
	// Dialog,
	// DialogActions,
	// DialogContent,
	// DialogContentText,
	// DialogTitle,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Grid,
	// IconButton,
	// InputAdornment,
	Icon,
	IconButton,
	InputLabel,
	Switch,
	makeStyles,
	withStyles,
	MenuItem,
	// Radio,
	// RadioGroup,
	Select,
	TextField,
	Tooltip,
	Typography,
} from '@material-ui/core/';
import { Alert, Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab/';
import * as moment from 'moment-timezone';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Color from '../../../mixins/palette';
import languageNames from '../../../localstore/languages.json';

const useStyles = makeStyles((theme) => ({
	dayRecurrenceButton: {
		'&.Mui-selected': {
			backgroundColor: Color.hex.grape,
			color: colors.common.white,
		},
	},
	timezone: {
		marginTop: theme.spacing(2),
	},
	custom: {
		paddingTop: theme.spacing(2),
	},
	lineItem: {
		paddingTop: theme.spacing(1),
	},
	scheduleItemTooltip: {
		'&:hover': {
			backgroundColor: Color.hex.lightSalmon,
		},
	},
}));

const IOSSwitch = withStyles((theme) => ({
	root: {
		width: 42,
		height: 26,
		padding: 0,
		margin: theme.spacing(1),
	},
	switchBase: {
		padding: 1,
		'&$checked': {
			transform: 'translateX(16px)',
			color: theme.palette.common.white,
			'& + $track': {
				backgroundColor: '#52d869',
				opacity: 1,
				border: 'none',
			},
		},
		'&$focusVisible $thumb': {
			color: '#52d869',
			border: '6px solid #fff',
		},
	},
	thumb: {
		width: 24,
		height: 24,
	},
	track: {
		borderRadius: 26 / 2,
		border: `1px solid ${theme.palette.grey[400]}`,
		backgroundColor: theme.palette.grey[50],
		opacity: 1,
		transition: theme.transitions.create(['background-color', 'border']),
	},
	checked: {},
	focusVisible: {},
}))(({ classes, ...props }) => {
	return (
		<Switch
			focusVisibleClassName={classes.focusVisible}
			disableRipple
			classes={{
				root: classes.root,
				switchBase: classes.switchBase,
				thumb: classes.thumb,
				track: classes.track,
				checked: classes.checked,
			}}
			{...props}
		/>
	);
});

//put US at the top of list of countries
const Us = ['US'];
const allCountries = moment.tz.countries();
allCountries.splice(allCountries.indexOf('US'), 1);
const countriesNotUs = allCountries;
const worldCountries = [...Us, ...countriesNotUs];

let allTimezones = [];
worldCountries.map((zone) => {
	allTimezones = [...allTimezones, ...moment.tz.zonesForCountry(zone, true)];
});

const timeZones = {};
const timeZonesWithNames = {};
const filteredTimezones = [];

allTimezones.forEach((zone) => {
	// code commented out used to retrieve offsets between countries and timezones.
	// if (timeZonesWithNames[zone.offset] === undefined) {
	// 	timeZonesWithNames[zone.offset] = { abbreviation: moment.tz(zone.name).format('z'), ...zone };
	// } else {
	// 	timeZonesWithNames[zone.offset].push({
	// 		abbreviation: moment.tz(zone.name).format('z'),
	// 		...zone,
	// 	});
	// }

	if (!timeZones[moment.tz(zone.name).format('z')]) {
		filteredTimezones.push(zone);
		timeZones[moment.tz(zone.name).format('z')] = zone;
	}
});

// console.log('timezones', JSON.stringify(timeZonesWithNames));
// console.log('all', JSON.stringify(allTimezones));
// console.log('filtered', JSON.stringify(filteredTimezones));
// console.log(filteredTimezones);

const timeMenus = [];
for (let i = 0; i < 24; i++) {
	let timeString = i;
	let ampm = 'am';
	if (timeString === 0) {
		timeString = 12;
	}
	if (timeString > 12) {
		timeString = timeString % 12;
		ampm = 'pm';
	}
	const hr24 = i > 9 ? i : '0' + i;
	timeMenus.push({ title: `${timeString}:00 ${ampm}`, value: `${hr24}:00:00` });
	timeMenus.push({ title: `${timeString}:30 ${ampm}`, value: `${hr24}:30:00` });
}

const timezoneProps = {
	options: filteredTimezones,
	getOptionLabel: (opt) => `(${moment.tz(opt.name).format('z')}) ${opt.name}`,
	// (z) => `${moment.tz(z.name).format('z')} | ${z.name}`,
};
const startTimeProps = {
	options: timeMenus,
	getOptionLabel: (opt) => opt.title,
};

const AddReadingSchedule = (props) => {
	const classes = useStyles();

	const {
		arrayOfStorytimes,
		setArrayOfStorytimes,
		readingScheduleTitle,
		setReadingScheduleTitle,
		description,
		error,
		setDescription,
		day,
		setDay,
		formatTime, //formatTime(new Date(2020, 11, 29, 15, 30, 0, 0), moment.tz.guess()));
		startTime,
		handleUpdateStartTime,
		endTime,
		handleUpdateEndTime,
		isDialog, //full page or dialog
		timezoneOffset,
		timezoneFancy, // America/Los Angeles
		handleUpdateTimeZone,
		repeatCount,
		handleRepeatCount,
		languages,
		handleLanguageChange,
		dayRecurrence,
		handleUpdateDayRecurrence,
		isPublic,
		toggleIsPublic,
		gradeLevel,
		updateGradeLevel,
	} = props;

	const leftScreenSize = isDialog ? 12 : 7;
	const rightScreenSize = isDialog ? 12 : 5;
	const middleScreenSizeSm = isDialog ? 12 : 10;
	const middleScreenSizeMd = isDialog ? 12 : 9;
	const middleScreenSizeLg = isDialog ? 12 : 6;
	const middleScreenSizeXl = isDialog ? 12 : 4;

	const handleRemoveDay = (index) => {
		setArrayOfStorytimes((array) => {
			const arrayOfStoryTimes = [...array];
			arrayOfStoryTimes.splice(index, 1);
			return arrayOfStoryTimes;
		});
	};

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Container>
				{error && <Alert severity='error'>{error}</Alert>}
				<Grid container spacing={2} justify='center'>
					<Grid item xs={12} md={leftScreenSize}>
						<Box pt={2}>
							<FormControl fullWidth>
								<TextField
									variant='outlined'
									fullWidth
									label='Title'
									value={readingScheduleTitle}
									onChange={setReadingScheduleTitle}
									inputProps={{ maxLength: '32' }}
									required
								/>
								<FormHelperText>This event is no fun if it has no name</FormHelperText>
							</FormControl>
						</Box>
						<Box pt={2}>
							<FormControl fullWidth>
								<TextField
									variant='outlined'
									fullWidth
									multiline
									rows={5}
									rowsMax={10}
									label={`Describe the event.`}
									placeholder={`There are only a few times in life when you can authentically spark a child's light. So go ahead, light that fire for that one kid! He or she needs a bit of a posh learning experience. That's why you are here and that's what you were born to do!`}
									value={description}
									onChange={setDescription}
									required
								/>
								<FormHelperText>Bring it on!</FormHelperText>
							</FormControl>
						</Box>
						<Box mt={2}>
							<FormControl fullWidth variant='outlined'>
								<InputLabel required htmlFor='select-class-grade-level' id='class-grade-level'>
									Grade Level
								</InputLabel>
								<Select
									defaultValue=''
									labelId='class-grade-level'
									id='select-class-grade-level'
									value={gradeLevel}
									onChange={updateGradeLevel}
									required
								>
									<MenuItem value=''>
										<em>None</em>
									</MenuItem>
									<MenuItem value='pre-school'>Pre-School (4+)</MenuItem>
									<MenuItem value='pre-kindergarten'>Pre-Kindergarten (5+)</MenuItem>
									<MenuItem value='kindergarten'>Kindergarten (6+)</MenuItem>
									<MenuItem value='grade1'>Grade 1 (7+)</MenuItem>
									<MenuItem value='grade2'>Grade 2 (8+)</MenuItem>
									<MenuItem value='grade3'>Grade 3 (9+)</MenuItem>
								</Select>
							</FormControl>
						</Box>
						<Box pt={2}>
							<FormControl fullWidth>
								<Autocomplete
									multiple
									id='mutiple-language'
									options={languageNames}
									getOptionLabel={(opt) => opt.title}
									renderInput={(params) => (
										<TextField
											{...params}
											variant='outlined'
											label='Select the languages you will use in class'
											placeholder='Max 2 languages'
											inputProps={{
												...params.inputProps,
												autoComplete: 'new-password',
											}}
										/>
									)}
									value={languages
										.filter((l) => !!l)
										.map((l) => languageNames.find((lN) => lN.value === l))}
									onChange={handleLanguageChange}
								/>
								<FormHelperText>
									Language variety is the spice of life - our source of joy, history, art and
									culture.
								</FormHelperText>
							</FormControl>
						</Box>
					</Grid>
					<Grid item xs={12} md={rightScreenSize}>
						<FormControlLabel
							control={<IOSSwitch checked={isPublic} onChange={toggleIsPublic} name='checkedB' />}
							label='Public Event'
						/>
						<KeyboardDatePicker
							fullWidth
							required
							inputVariant='outlined'
							disableToolbar
							variant='inline'
							format='MM/dd/yyyy'
							margin='normal'
							id='start-date'
							label='Start Date'
							minDate={new Date()}
							value={day}
							onChange={setDay}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>

						<Autocomplete
							{...startTimeProps}
							id='session-start-time'
							renderInput={(params) => (
								<TextField {...params} label='Start Time' variant='outlined' required />
							)}
							value={timeMenus.find((x) => x.value === startTime)}
							onChange={handleUpdateStartTime}
						/>
						<Box mt={1}>
							<Autocomplete
								{...startTimeProps}
								id='session-end-time'
								renderInput={(params) => (
									<TextField {...params} label='End Time' variant='outlined' required />
								)}
								value={timeMenus.find((x) => x.value === endTime)}
								onChange={handleUpdateEndTime}
							/>
						</Box>
						<Autocomplete
							{...timezoneProps}
							required
							renderInput={(params) => (
								<TextField
									{...params}
									variant='outlined'
									// offset={moment.tz(params.name).format('Z').split(':')[0]}
									// value={timezone ? timezone : moment.tz(params.name).format('Z').split(':')[0]}
									label='Time Zone'
									margin='normal'
									required
								/>
							)}
							renderOption={(opt) => (
								<Fragment>
									<small>
										{moment.tz(opt.name).format('z')} {opt.name} ({opt.offset / 60})
									</small>
								</Fragment>
							)}
							value={filteredTimezones.find(
								(x) =>
									x.offset === timezoneOffset * 60 &&
									(timezoneFancy ? x.name === timezoneFancy : true)
							)}
							onChange={handleUpdateTimeZone}
						/>
						<Box pt={1}>
							<FormControl fullWidth>
								<Grid container justify='center'>
									<Grid item xs={9} align='left'>
										<Box pr={1} pt={2}>
											<FormLabel component='legend'>
												How many weeks should the event repeat?
											</FormLabel>
										</Box>
									</Grid>
									<Grid item xs={3} align='right'>
										<TextField
											fullWidth
											required
											variant='outlined'
											type='number'
											value={repeatCount * 1}
											onChange={handleRepeatCount}
											min={0}
											max={10}
											inputProps={{ min: 0, max: 10, step: 1 }}
										></TextField>
										<FormHelperText>Max: 10</FormHelperText>
									</Grid>
								</Grid>
							</FormControl>
							{repeatCount > 0 && (
								<FormControl fullWidth component='fieldset'>
									<Box mt={2}>
										<FormLabel component='legend'>
											Specify the days to repeat the following week(s).
										</FormLabel>
									</Box>
									<ToggleButtonGroup
										className={classes.custom}
										orientation='horizontal'
										aria-label='Day Recurrence'
										value={dayRecurrence}
										onChange={handleUpdateDayRecurrence}
									>
										<ToggleButton
											value={0}
											aria-label='sunday'
											className={classes.dayRecurrenceButton}
										>
											<small>Su</small>
										</ToggleButton>
										<ToggleButton
											value={1}
											aria-label='monday'
											className={classes.dayRecurrenceButton}
										>
											<small>Mo</small>
										</ToggleButton>
										<ToggleButton
											value={2}
											aria-label='tuesday'
											className={classes.dayRecurrenceButton}
										>
											<small>Tu</small>
										</ToggleButton>
										<ToggleButton
											value={3}
											aria-label='wednesday'
											className={classes.dayRecurrenceButton}
										>
											<small>We</small>
										</ToggleButton>
										<ToggleButton
											value={4}
											aria-label='thursday'
											className={classes.dayRecurrenceButton}
										>
											<small>Th</small>
										</ToggleButton>
										<ToggleButton
											value={5}
											aria-label='friday'
											className={classes.dayRecurrenceButton}
										>
											<small>Fr</small>
										</ToggleButton>
										<ToggleButton
											value={6}
											aria-label='saturday'
											className={classes.dayRecurrenceButton}
										>
											<small>Sa</small>
										</ToggleButton>
									</ToggleButtonGroup>
									<FormHelperText>
										{repeatCount > 0 &&
											`This series automatically ends after ${repeatCount} weeks.`}
									</FormHelperText>
								</FormControl>
							)}
						</Box>
					</Grid>
					<Grid
						item
						xs={12}
						sm={middleScreenSizeSm}
						md={middleScreenSizeMd}
						lg={middleScreenSizeLg}
						xl={middleScreenSizeXl}
						align='left'
					>
						<Box pt={5} pb={3} alignItems='center'>
							<Typography variant='h4'>
								Verify Class Schedule ({arrayOfStorytimes.length} sessions)
							</Typography>
						</Box>
						<Grid container>
							{arrayOfStorytimes.map((time, index) => {
								const hasDifferentAmPm =
									moment(time.start).tz(moment.tz.guess()).format('a') !==
									moment(time.end).tz(moment.tz.guess()).format('a');

								return (
									<Fragment key={index}>
										<Grid item xs={10}>
											<Typography variant='body1' className={classes.lineItem}>
												{moment(time.start).tz(moment.tz.guess()).format('ddd, MMM Do YYYY, h:mm')}
												{hasDifferentAmPm && moment(time.start).tz(moment.tz.guess()).format('a')}
												{' - '}
												{moment(time.end).tz(moment.tz.guess()).format('h:mma (z)')}
											</Typography>
										</Grid>
										<Grid item xs={2}>
											<Tooltip title='Remove Class Time'>
												<IconButton
													onClick={() => handleRemoveDay(index)}
													className={classes.scheduleItemTooltip}
													data-index={index}
												>
													<Icon>clear</Icon>
												</IconButton>
											</Tooltip>
										</Grid>
									</Fragment>
								);
							})}
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</MuiPickersUtilsProvider>
	);
};

export default AddReadingSchedule;
