import { useState, useEffect, useCallback } from 'react';
import useInputChange from '../../../hooks/input-change';
import moment from 'moment-timezone';

import { userDetails } from '../../../helpers';
import timezonesTable from '../../../localstore/timezones-non-repeating-offset.json'; //lookup time zone names from offset

const padZero = (dt) => {
	dt *= 1;
	if (dt < 10) return '0' + dt;
	return dt;
};

// const getTime = (dt) =>
// 	padZero(dt.getHours()) + ':' + padZero(dt.getMinutes()) + ':' + padZero(dt.getSeconds());

const getDurTime = (dt) => {
	const minOver30 = dt.getMinutes() > 30;
	const result =
		padZero(dt.getHours() + (minOver30 ? 1 : 0)) + ':' + (minOver30 ? '00' : '30') + ':' + '00';
	console.log('result', result, dt.getHours());
	return result;
};

const getMin30Or0 = (tm) => {
	if (!tm.length) return;
	let [hr, min] = tm.split(':') || [];
	if (min >= 30) min = '30';
	else if (min >= 0) min = '00';

	return hr + ':' + min + ':00';
};

const isDate = (dateObj) => {
	return dateObj && !isNaN(dateObj) && Object.prototype.toString.call(dateObj) !== '[object Date]';
};

const formatTime = (dateObj, timezone) => {
	// This function formats date object in standard ISO and unix times.
	// date: date object
	// timezone: a string ('America/LosAngeles')
	// call usage: formatTime(new Date(2020, 11, 29, 15, 30, 0, 0), moment.tz.guess()));
	// note: this way takes care of daylight savings time so it ensures bugs
	console.log('formatTime timezone', timezone);
	if (typeof timezone !== 'string') return;
	if (isDate(dateObj)) return;

	const day = dateObj.getDate();
	const month = dateObj.getMonth();
	const year = dateObj.getFullYear();
	const hours = dateObj.getHours();
	const minutes = dateObj.getMinutes();

	let newDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
	let utcDate = new Date(newDate.toLocaleString('en-US', { timeZone: 'UTC' }));
	let tzDate = new Date(newDate.toLocaleString('en-US', { timeZone: timezone }));
	let offset = utcDate.getTime() - tzDate.getTime();

	newDate.setTime(newDate.getTime() + offset);

	return {
		dateUnixMs: moment(newDate).valueOf(), //in ms
		dateISO: newDate.toISOString(), //as a string
		dateLocalTimezone: moment(newDate.toISOString()).local().format('dddd, MMM DD YYYY, hh:mm A'),
		timezone: timezone,
	};
};

const useAddReadingSchedule = (props = {}) => {
	const [error, setError] = useState('');

	const getTimes = useCallback(() => {
		let now = props.start_date ? new Date(props.start_date) : new Date();
		let nowPlus1h = props.start_date ? new Date(props.start_date) : new Date();
		let nowPlus3h = props.start_date ? new Date(props.start_date) : new Date();
		if (!props.start_date) {
			now.setDate(now.getDate());
			nowPlus1h.setHours(nowPlus1h.getHours() + 1);
			nowPlus3h.setHours(nowPlus3h.getHours() + 3);
		}

		return [nowPlus1h, nowPlus3h];
	}, [props.start_date]);
	const handleUpdateStartTime = useCallback((e, val) => {
		if (val) {
			setStartTime(val.value);
		}
	}, []);

	const [nowPlus1h, nowPlus3h] = getTimes();
	const [duration, setDuration] = useState(0);
	const [arrayOfStorytimes, setArrayOfStorytimes] = useState([{ start: 0, end: 0 }]);
	const [readingScheduleTitle, setReadingScheduleTitle] = useInputChange('');
	const [description, setDescription] = useInputChange('');
	const [day, setDay] = useState(nowPlus1h);
	const [repeatCount, setRepeatCount] = useState(0);
	const handleRepeatCount = useCallback((e) => {
		if (e.target.value <= 10 && e.target.value >= 0) {
			setRepeatCount(parseInt(e.target.value));
		} else {
			setError('Can only schedule up to 10 weeks.');
		}
		return;
	}, []);

	const [endTime, setEndTime] = useState(() => {
		return getDurTime(nowPlus3h);
	});
	const [startTime, setStartTime] = useState(() => {
		return getDurTime(nowPlus1h);
	});

	const handleUpdateEndTime = useCallback((e, val) => {
		if (val) {
			setEndTime(val.value);
		}
	}, []);

	const [timezoneOffset, setTimeZoneOffset] = useState(
		() => nowPlus1h.getTimezoneOffset() / 60 + ''
	);
	const [timezoneFancy, setTimezoneFancy] = useState('');
	const [timezonePrettyName, setTimezonePrettyName] = useState(moment.tz.guess());

	const [languages, setLanguages] = useState(() => (userDetails.languages || 'en').split(','));
	const handleLanguageChange = useCallback((e, vals) => setLanguages(vals.map((v) => v.value)), []);

	const [repeat, setRepeat] = useState('');
	const [frequencyTime, setFrequencyTime] = useState(1);
	const [frequencyType, setFrequencyType] = useState('');

	const [dayRecurrence, setDayRecurrence] = useState([]);
	const handleUpdateDayRecurrence = useCallback(
		(e, newDayRecurrence) => setDayRecurrence(newDayRecurrence),
		[]
	);

	const [isPublic, setIsPublic] = useState(true);
	const toggleIsPublic = useCallback((e) => setIsPublic(e.target.checked), []);

	const generateArrayOfStorytimes = useCallback(
		(eventDate) => {
			const year = eventDate.getFullYear();
			const month = eventDate.getMonth();
			const day = eventDate.getDate();
			const dayOfTheWeek = eventDate.getDay();
			const start = startTime.split(':');
			const end = endTime.split(':');
			let dateCurrentWeek = new Date(year, month + 1, day, ...start);
			let endDateCurrentWeek = new Date(year, month + 1, day, ...end);
			const timezoneOfEvent = timezonesTable[timezoneOffset * 60 + ''].name;
			const formattedStoryTime0 = formatTime(dateCurrentWeek, timezoneOfEvent).dateISO;
			const endFormattedStoryTime0 = formatTime(endDateCurrentWeek, timezoneOfEvent).dateISO;

			let nextDate = new Date(dateCurrentWeek);
			let endNextDate = new Date(endDateCurrentWeek);
			//if the day is the same, skip push
			const arrayOfDates =
				nextDate.getDay() === new Date(formattedStoryTime0).getDay()
					? []
					: [{ start: formattedStoryTime0, end: endFormattedStoryTime0 }];

			for (let i = 0; i < repeatCount; i++) {
				if (dayRecurrence.length) {
					dayRecurrence.map((selectedDay) => {
						nextDate = new Date(dateCurrentWeek);
						endNextDate = new Date(endDateCurrentWeek);
						//determine how many days to add:
						//if selectedDay < eventDate dayOfTheWeek
						let numDaysToAdd;
						if (selectedDay < dayOfTheWeek) {
							numDaysToAdd = selectedDay - dayOfTheWeek + 7;
							nextDate.setDate(nextDate.getDate() + numDaysToAdd + i * 7);
							endNextDate.setDate(endNextDate.getDate() + numDaysToAdd + i * 7);
							arrayOfDates.push({
								start: formatTime(new Date(nextDate), timezoneOfEvent).dateISO,
								end: formatTime(new Date(endNextDate), timezoneOfEvent).dateISO,
							});
						} else if (selectedDay > dayOfTheWeek) {
							numDaysToAdd = selectedDay - dayOfTheWeek;
							nextDate.setDate(nextDate.getDate() + numDaysToAdd + i * 7);
							endNextDate.setDate(endNextDate.getDate() + numDaysToAdd + i * 7);
							arrayOfDates.push({
								start: formatTime(new Date(nextDate), timezoneOfEvent).dateISO,
								end: formatTime(new Date(endNextDate), timezoneOfEvent).dateISO,
							});
						} else if (selectedDay === dayOfTheWeek && i !== 0) {
							//Do nothing if they're the same day, do not add to array for the first week,
							numDaysToAdd = 0;
							nextDate.setDate(nextDate.getDate() + numDaysToAdd + i * 7);
							endNextDate.setDate(endNextDate.getDate() + numDaysToAdd + i * 7);
							arrayOfDates.push({
								start: formatTime(new Date(nextDate), timezoneOfEvent).dateISO,
								end: formatTime(new Date(endNextDate), timezoneOfEvent).dateISO,
							});
						}
					});
				}
			}

			if (!arrayOfDates.length) {
				//if array is empty (during removing dates), put back the start date.
				arrayOfDates.push({ start: formattedStoryTime0, end: endFormattedStoryTime0 });
				setRepeatCount(0);
			}
			setArrayOfStorytimes(arrayOfDates.sort((a, b) => a.start - b.start));
			return;
		},
		[startTime, repeatCount, timezoneOffset, dayRecurrence, endTime]
	);

	const handleUpdateTimeZone = useCallback((e, val) => {
		if (val) {
			setTimeZoneOffset(val.offset / 60);
			setTimezoneFancy(val.name);
		}
		return;
	}, []);

	useEffect(() => {
		if (props.title) {
			setReadingScheduleTitle(props.title);
		}
	}, [props.title, setReadingScheduleTitle]);
	useEffect(() => {
		if (props.description) {
			setDescription(props.description);
		}
	}, [props.description, setDescription]);
	useEffect(() => {
		let lang = props.languages || '';
		if (typeof lang === 'string') {
			lang = lang.split(',');
		}
		if (Array.isArray(lang)) {
			lang = lang.filter((l) => !!l);
		}
		setLanguages(lang);
	}, [props.languages]);
	useEffect(() => {
		const [nowPlus1h /*, todayPlus3h */] = getTimes();
		setDay(nowPlus1h);
		// setStartTime(today);
		// setEndTime(todayPlus3h);
	}, [getTimes, props.start_date]);
	useEffect(() => {
		if (!props.start_time) return;
		const tm = getMin30Or0(props.start_time);
		setStartTime(tm);
	}, [props.start_time]);
	useEffect(() => {
		if (!props.end_time) return;
		const tm = getMin30Or0(props.end_time);
		setEndTime(tm);
	}, [props.end_time]);
	useEffect(() => {
		if (props.timezoneOffset) {
			setTimeZoneOffset(props.timezoneOffset);
			handleUpdateTimeZone();
		}
	}, [props.timezoneOffset, handleUpdateTimeZone]);
	useEffect(() => {
		if (props.arrayOfStorytimes) {
			setArrayOfStorytimes(props.arrayOfStorytimes);
		}
	}, [props.arrayOfStorytimes]);
	useEffect(() => {
		if (props.repeat) setRepeat(props.repeat);
	}, [props.repeat]);
	useEffect(() => {
		if (props.frequency_time) {
			setFrequencyTime(props.frequency_time);
		}
	}, [props.frequency_time]);
	useEffect(() => {
		if (props.frequency_type) {
			setFrequencyType(props.frequency_type);
		}
	}, [props.frequency_type]);
	useEffect(() => {
		let dayRec = props.day_recurrence || '';
		if (typeof dayRec === 'string') dayRec = dayRec.split(',');
		if (Array.isArray(dayRec)) dayRec = dayRec.filter((d) => d === 0 || !!d);
		setDayRecurrence(dayRec);
	}, [props.day_recurrence]);
	useEffect(() => {
		if (props.repeat_count) {
			setRepeatCount(props.repeat_count * 1);
		}
	}, [props.repeat_count]);

	useEffect(() => {
		const daysLen = dayRecurrence.length;
		if (daysLen === 0) setRepeat('');
		else if (daysLen === 7) setRepeat('daily');
		else if (daysLen === 1) {
			if (dayRecurrence[0] === day.getDay()) {
				setRepeat('weekly');
			} else {
				setRepeat('custom');
			}
		} else if (daysLen > 1) {
			setRepeat('custom');
		}
	}, [dayRecurrence, day]);

	// useEffect(() => setDayRecurrence([day.getDay()]), [day]);
	// useEffect(() => {
	// 	const weekDay = day.getDay();
	// 	if (!dayRecurrence.includes(weekDay)) setDayRecurrence((x) => [...x, weekDay]);
	// }, [day, dayRecurrence]);

	useEffect(() => {
		if (typeof props.is_public !== 'undefined') {
			setIsPublic(!!props.is_public);
		}
	}, [props.is_public]);

	const sDay = new Date(day);
	const startDateFormatted =
		sDay.getFullYear() + '-' + padZero(sDay.getMonth() + 1) + '-' + padZero(sDay.getDate());
	// const _startTime = getTime(new Date(startTime));
	// const _endTime = getTime(new Date(endTime));

	useEffect(() => {
		if (!startTime || !endTime) {
			setDuration(0);
			return;
		}

		const dateStr =
			nowPlus1h.getFullYear() +
			'-' +
			padZero(nowPlus1h.getMonth() + 1) +
			'-' +
			padZero(nowPlus1h.getDate());
		const startDateTime = new Date(dateStr + 'T' + startTime) * 1;
		const endDateTime = new Date(dateStr + 'T' + endTime) * 1;

		setDuration(endDateTime - startDateTime);
	}, [nowPlus1h, startTime, endTime]);

	useEffect(() => {
		generateArrayOfStorytimes(
			day,
			startTime,
			endTime,
			timezoneOffset,
			timezonePrettyName,
			repeatCount
		);
	}, [
		generateArrayOfStorytimes,
		day,
		startTime,
		endTime,
		timezoneOffset,
		timezonePrettyName,
		repeatCount,
	]);

	return {
		arrayOfStorytimes,
		setArrayOfStorytimes,
		generateArrayOfStorytimes,
		error,
		setError,
		formatTime,
		isDate,
		readingScheduleTitle,
		setReadingScheduleTitle,
		description,
		setDescription,
		day,
		setDay,
		startTime,
		setStartTime,
		handleUpdateStartTime,
		endTime,
		setEndTime,
		handleUpdateEndTime,
		duration,
		timezoneOffset,
		timezoneFancy,
		setTimeZoneOffset,
		timezonePrettyName,
		setTimezonePrettyName,
		handleUpdateTimeZone,
		repeat,
		setRepeat,
		repeatCount,
		setRepeatCount,
		handleRepeatCount,
		frequencyTime,
		setFrequencyTime,
		frequencyType,
		setFrequencyType,
		languages,
		handleLanguageChange,
		dayRecurrence,
		setDayRecurrence,
		handleUpdateDayRecurrence,
		isPublic,
		toggleIsPublic,
		_startDate: startDateFormatted,
	};
};

export default useAddReadingSchedule;
