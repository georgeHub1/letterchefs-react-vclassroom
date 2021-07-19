import { useState, useEffect, useCallback } from 'react';

const useAddReadingSchedule = (props = {}) => {
	const getTimes = useCallback(() => {
		let today = props.start_date ? new Date(props.start_date) : new Date();
		let todayPlus3h = props.start_date ? new Date(props.start_date) : new Date();
		today.setDate(today.getDate() + 2);
		today.setHours(today.getHours());
		todayPlus3h.setHours(todayPlus3h.getHours() + 2);
		return [today, todayPlus3h];
	}, [props.start_date]);

	const [today, todayPlus3h] = getTimes();

	const [readingScheduleTitle, setReadingScheduleTitle] = useState('');
	const [day, setDay] = useState(today.toDateString());
	const [startTime, setStartTime] = useState(today);
	const [endTime, setEndTime] = useState(todayPlus3h);
	const [timezone, setTimeZone] = useState('');
	const [repeat, setRepeat] = useState('');
	const [frequencyTime, setFrequencyTime] = useState(1);
	const [frequencyType, setFrequencyType] = useState('');
	const [dayRecurrence, setDayRecurrence] = useState('');

	useEffect(() => setReadingScheduleTitle(props.title), [props.title]);
	useEffect(() => {
		const [today, todayPlus3h] = getTimes();
		setDay(today.toDateString());
		setStartTime(today);
		setEndTime(todayPlus3h);
	}, [getTimes]);
	useEffect(() => setTimeZone(props.timezone), [props.timezone]);
	useEffect(() => setRepeat(props.repeat), [props.repeat]);
	useEffect(() => setFrequencyTime(props.frequency_time), [props.frequency_time]);
	useEffect(() => setFrequencyType(props.frequency_type), [props.frequency_type]);
	useEffect(() => setDayRecurrence(props.day_recurrence), [props.day_recurrence]);

	const padZero = (dt) => {
		dt *= 1;
		if (dt < 10) return '0' + dt;
		return dt;
	};

	const sDay = new Date(day);
	const getTime = (dt) =>
		padZero(dt.getHours()) + ':' + padZero(dt.getMinutes()) + ':' + padZero(dt.getSeconds());

	return {
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
		_startDate:
			sDay.getFullYear() + '-' + padZero(sDay.getMonth() + 1) + '-' + padZero(sDay.getDate()),
		_startTime: getTime(new Date(startTime)),
		_endTime: getTime(new Date(endTime)),
	};
};

export default useAddReadingSchedule;
