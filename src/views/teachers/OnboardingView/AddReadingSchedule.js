import React, { /* Fragment, */ useState } from 'react';
import {
	colors,
	makeStyles,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	// DialogContentText,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	InputAdornment,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	TextField,
} from '@material-ui/core/';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/';

import * as moment from 'moment-timezone';
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import Color from '../../../mixins/palette';

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
}));

const AddReadingSchedule = (props) => {
	const classes = useStyles();

	const {
		readingScheduleTitle,
		setReadingScheduleTitle,
		day,
		setDay,
		startTime,
		setStartTime,
		endTime,
		setEndTime,
		timezone,
		setTimeZone,
		repeat,
		setRepeat,
		frequencyTime,
		setFrequencyTime,
		frequencyType,
		setFrequencyType,
		dayRecurrence,
		setDayRecurrence,
	} = props;

	const allUsTimezones = moment.tz.zonesForCountry('US', true);
	const [open, setOpen] = useState(false);

	const timeZones = {};
	const filteredTimezone = [];
	allUsTimezones.forEach((zone) => {
		if (!timeZones[moment.tz(zone.name).format('z')]) {
			filteredTimezone.push(zone);
			timeZones[moment.tz(zone.name).format('z')] = true;
		}
	});
	//console.log(filteredTimezone);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleUpdateScheduleTitle = (e) => {
		setReadingScheduleTitle(e.target.value);
	};

	const handleUpdateDay = (date) => {
		setDay(date);
	};

	const handleUpdateStartTime = (date) => {
		setStartTime(date);
	};

	const handleUpdateEndTime = (date) => {
		setEndTime(date);
	};

	const handleUpdateTimeZone = (e) => {
		setTimeZone(e.target.value);
	};

	const handleDayRecurrence = (e, newDayRecurrence) => {
		setDayRecurrence(newDayRecurrence);
	};

	const handleUpdateRepeat = (e) => {
		const recurrence = e.target.value;

		if (recurrence === 'custom') {
			handleClickOpen(e);
		}

		return setRepeat(recurrence);
	};

	const handleUpdateFrequencyTime = (e) => {
		const frequencyTime = e.target.value;

		return setFrequencyTime(frequencyTime);
	};

	const handleUpdateFrequencyType = (e) => {
		const frequencyType = e.target.value;

		return setFrequencyType(frequencyType);
	};

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Container>
				<Grid container>
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							label='Title'
							value={readingScheduleTitle}
							onChange={handleUpdateScheduleTitle}
							required
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<KeyboardDatePicker
							fullWidth
							disableToolbar
							variant='inline'
							format='MM/dd/yyyy'
							margin='normal'
							id='start-date'
							label='Start Date'
							value={day}
							onChange={setDay}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<KeyboardTimePicker
							margin='normal'
							id='start-time'
							label='Start Time'
							value={startTime}
							minutesStep={5}
							onChange={handleUpdateStartTime}
							KeyboardButtonProps={{
								'aria-label': 'start time',
							}}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<KeyboardTimePicker
							margin='normal'
							id='end-time'
							label='End Time'
							value={endTime}
							minutesStep={5}
							onChange={handleUpdateEndTime}
							KeyboardButtonProps={{
								'aria-label': 'end time',
							}}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth>
							<InputLabel htmlFor='select-timezone' id='timezone'>
								Time Zone
							</InputLabel>
							<Select
								defaultValue=''
								labelId='timezone'
								id='select-timezone'
								value={timezone}
								onChange={handleUpdateTimeZone}
							>
								{filteredTimezone.map((z, index) => (
									<MenuItem
										value={z.name}
										key={index}
										offset={moment.tz(z.name).format('Z').split(':')[0]}
									>{`${moment.tz(z.name).format('z')} | ${z.name}`}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth>
							<InputLabel htmlFor='select-repeat' id='repeat'>
								Recurrence
							</InputLabel>
							<Select
								defaultValue=''
								labelId='repeat'
								id='select-repeat'
								value={repeat}
								onChange={handleUpdateRepeat}
							>
								<MenuItem value=''>Does not repeat</MenuItem>
								<MenuItem value='daily'>Daily</MenuItem>
								<MenuItem value='weekly'>Weekly</MenuItem>
								<MenuItem value='custom'>Custom...</MenuItem>
							</Select>
						</FormControl>
						<Dialog open={open} onClose={handleClose} aria-labelledby='Custom recurrence'>
							<DialogTitle id='form-dialog-title'>Set Repeat Schedule</DialogTitle>
							<DialogContent>
								<Grid container spacing={1}>
									<Grid item xs={12} md={5}>
										<TextField
											fullWidth
											label='Repeat Every'
											id='frequency-time'
											type='number'
											InputProps={{
												inputProps: {
													max: 7,
													min: 0,
												},
											}}
											value={frequencyTime}
											onChange={handleUpdateFrequencyTime}
										/>
									</Grid>
									<Grid item xs={12} md={7}>
										<FormControl fullWidth>
											<InputLabel gutterBottom htmlFor='select-frequency-type' id='frequency-type'>
												Recurrence
											</InputLabel>
											<Select
												defaultValue=''
												labelId='frequency-type'
												id='select-frequency-type'
												value={frequencyType}
												onChange={handleUpdateFrequencyType}
											>
												<MenuItem value='day'>Day(s)</MenuItem>
												<MenuItem value='week'>Week(s)</MenuItem>
												<MenuItem value='month'>Month(s)</MenuItem>
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12}>
										<FormControl component='fieldset'>
											<FormLabel component='legend'> Repeat On</FormLabel>
											<ToggleButtonGroup
												className={classes.custom}
												orientation='horizontal'
												aria-label='Day Recurrence'
												value={dayRecurrence}
												onChange={handleDayRecurrence}
											>
												<ToggleButton
													value={0}
													aria-label='sunday'
													className={classes.dayRecurrenceButton}
												>
													Sun
												</ToggleButton>
												<ToggleButton
													value={1}
													aria-label='monday'
													className={classes.dayRecurrenceButton}
												>
													Mon
												</ToggleButton>
												<ToggleButton
													value={2}
													aria-label='tuesday'
													className={classes.dayRecurrenceButton}
												>
													Tue
												</ToggleButton>
												<ToggleButton
													value={3}
													aria-label='wednesday'
													className={classes.dayRecurrenceButton}
												>
													Wed
												</ToggleButton>
												<ToggleButton
													value={4}
													aria-label='thursday'
													className={classes.dayRecurrenceButton}
												>
													Thu
												</ToggleButton>
												<ToggleButton
													value={5}
													aria-label='friday'
													className={classes.dayRecurrenceButton}
												>
													Fri
												</ToggleButton>
												<ToggleButton
													value={6}
													aria-label='saturday'
													className={classes.dayRecurrenceButton}
												>
													Sat
												</ToggleButton>
											</ToggleButtonGroup>
										</FormControl>
										<FormControl component='fieldset'>
											<FormLabel component='legend' className={classes.custom}>
												Ends
											</FormLabel>
											<RadioGroup defaultValue='never' aria-label='gender' name='customized-radios'>
												<Grid container spacing={1}>
													<Grid item xs={4}>
														<FormControlLabel
															value='on'
															control={<Radio color='primary' />}
															label='Ends On'
															className={classes.custom}
														/>
													</Grid>
													<Grid item xs={8}>
														<KeyboardDatePicker
															disableToolbar
															variant='inline'
															format='MM/dd/yyyy'
															margin='normal'
															id='recurrence-ends-on-date'
															label='Ends on date'
															value={day}
															onChange={handleUpdateDay}
															KeyboardButtonProps={{
																'aria-label': 'Ends on date',
															}}
														/>
													</Grid>
													<Grid item xs={4}>
														<FormControlLabel
															value='after'
															control={<Radio color='primary' />}
															label='Ends After'
															className={classes.custom}
														/>
													</Grid>
													<Grid item xs={8}>
														<TextField
															label='Ends after'
															id='recurrence-ends-after'
															type='number'
															InputProps={{
																endAdornment: (
																	<InputAdornment position='end'>occurrences</InputAdornment>
																),
																inputProps: {
																	max: 20,
																	min: 0,
																},
															}}
															value={frequencyTime}
															onChange={handleUpdateFrequencyTime}
														/>
													</Grid>
												</Grid>
											</RadioGroup>
										</FormControl>
									</Grid>
								</Grid>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose} color='primary'>
									Cancel
								</Button>
								<Button onClick={handleClose} color='primary' variant='contained'>
									Set Recurrence
								</Button>
							</DialogActions>
						</Dialog>
					</Grid>
				</Grid>
			</Container>
		</MuiPickersUtilsProvider>
	);
};

export default AddReadingSchedule;
