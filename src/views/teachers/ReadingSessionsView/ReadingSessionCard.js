import React, { Fragment, useState, useEffect, useCallback } from 'react';
import {
	Box,
	Button,
	Chip,
	Divider,
	Grid,
	Icon,
	IconButton,
	Link,
	makeStyles,
	// Modal,
	Paper,
	Popover,
	Typography,
	// FormControl,
	CircularProgress,
	FormControl,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { red } from '@material-ui/core/colors';
import Color from '../../../mixins/palette';
import LinkButton from '../../../components/LinkButton';
import Ribbon from '../../../components/ux/Ribbon';
import clsx from 'clsx';
import * as moment from 'moment-timezone';

import { Http, tryAgainMsg } from '../../../helpers';
import { readingEventStoreName, hasLocalStorage } from '../../../config';
// import MountainScene from '../../../assets/svg/mountain-scenery-background.svg';
// import ThreeTags from '../../../assets/svg/three-tags.svg';
// import ScenicBackground from '../../../assets/svg/scenic-background.svg';
import languageLookUp from '../../../localstore/languages.json';

const useStyles = makeStyles((theme) => ({
	sessionsContainer: {
		display: 'flex',
		width: '100%',
	},
	cancelEvent: {
		color: red[500],
	},
	day: {
		marginTop: theme.spacing(1),
		color: Color.hex.liberty,
		fontWeight: theme.typography.fontWeightBold,
	},
	dayOfWeek: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	dateContainer: {
		justifyContent: 'center',
		textAlign: 'center',
	},
	detailsContainer: {
		position: 'relative',
		flexGrow: 1,
	},
	month: {
		textTransform: 'uppercase',
	},
	paper: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
		position: 'relative',
	},
	gradeLevel: {
		display: 'flex',
		paddingTop: theme.spacing(3),
	},
	immediateActionContainer: {
		display: 'flex',
		alignItems: 'center',
	},
	link: {
		fontWeight: theme.typography.fontWeightRegular,
	},
	linkContainer: {
		color: Color.hex.blue,
		textDecoration: 'none',
		marginTop: theme.spacing(2),
		'&:hover': {
			textDecoration: 'none',
		},
	},
	marginTop: {
		marginTop: theme.spacing(2),
	},
	span: {
		display: 'inline-block',
		marginRight: theme.spacing(1),
	},
	textarea: {
		width: '100%',
		padding: theme.spacing(1),
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
	},
}));

const ReadingSessionCard = ({
	isDraft,
	isStory,
	onDelete,
	setIsLoading,
	setError,
	setSuccess,
	setReadingSessions,
	setReadingSessionDraft,
	handleEditEventCallback,
	setActiveReadingEventProps,
	showingViewStudentsDialog,
	showingEditEventDialog,
	showingInviteGuestTeacherDialog,
	showingCancelEventDialog,
	...props
}) => {
	const classes = useStyles();
	console.log('props', props);

	const languageMap = {};
	languageLookUp.forEach((lang) => {
		languageMap[`${lang.value}`] = lang.title;
	});

	console.log('langMap', languageMap);

	const [anchorEl, setAnchorEl] = useState(null);
	const handleClickPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = useCallback(() => setAnchorEl(null), []);
	const isOpened = !!anchorEl;

	useEffect(() => {
		if (
			showingCancelEventDialog ||
			showingEditEventDialog ||
			showingInviteGuestTeacherDialog ||
			showingViewStudentsDialog
		)
			handleClosePopover();
		else setActiveReadingEventProps({});
	}, [
		showingCancelEventDialog,
		showingEditEventDialog,
		showingInviteGuestTeacherDialog,
		showingViewStudentsDialog,
		handleClosePopover,
		setActiveReadingEventProps,
	]);

	const handleDeleteDraft = () => {
		if (hasLocalStorage) {
			window.localStorage.removeItem(readingEventStoreName);
			setReadingSessionDraft(null);
			if (typeof onDelete === 'function') onDelete();
		}
	};

	const handlePublishEvent = () => {
		const evtID = props.id;
		const isPub = !props.is_published * 1;

		if (!props.is_published && !props.price)
			setActiveReadingEventProps({ ...props, __action: 'publish' });

		handleEditEventCallback({ id: evtID, isPublishing: true });

		const rq = Http().secureRequest({
			url: `/reading-schedules/${evtID}`,
			method: 'PATCH',
			body: { is_published: isPub },
			successCallback: ({ status }) => {
				if (!status) {
					handleEditEventCallback({ id: evtID, isPublishing: false });
					return;
				}

				handleEditEventCallback({ id: evtID, isPublishing: false, is_published: isPub });
				handleClosePopover();
			},
			errorCallback: () => handleEditEventCallback({ id: evtID, isPublishing: false }),
		});
		rq.finally(() => setIsLoading(false));
	};

	const handleDuplicateEvent = () => {
		handleClosePopover();

		let startDateStr = props.start_date;
		const startDate = new Date(startDateStr);
		const startDateNum = startDate.getDate();

		const startWeekDay = startDate.getDay();
		const todaysWeekDay = new Date().getDay();
		const dayRec = (props.day_recurrence || '').split(',').filter((x) => x > startWeekDay);

		let dayDiff;

		switch (props.repeat) {
			case 'custom':
				if (dayRec.length > 1) dayDiff = dayRec[0] - todaysWeekDay;
				else dayDiff = 0;
				break;
			case 'weekly':
				dayDiff = 7;
				break;
			case 'daily':
				dayDiff = 2;
				break;
		}

		if (dayDiff > 0) startDate.setDate(startDateNum + dayDiff);
		else if (dayDiff < 0) startDate.setDate(startDateNum + 7 + dayDiff);
		else if (dayDiff === 0) startDate.setDate(startDateNum + 7);

		const pZero = (x) => (x < 10 ? '0' + x : x);

		let body = {
			class_grade_level: props.grade_level,
			title: props.title,
			start_date:
				startDate.getFullYear() +
				'-' +
				pZero(startDate.getMonth() + 1) +
				'-' +
				pZero(startDate.getDate()),
			start_time: props.start_time,
			end_time: props.end_time,
			timezone: props.timezone,
			is_published: 0,
		};

		const compl = [
			'description',
			'repeat',
			'frequency_time',
			'frequency_type',
			'day_recurrence',
			'languages',
		];

		for (const c of compl) {
			if (props[c]) {
				body[c] = props[c];
			}
		}

		setIsLoading(true);
		handleEditEventCallback({ id: props.id, isDuplicating: true });
		setError('');
		setSuccess('');
		const rq = Http().secureRequest({
			url: '/reading-schedules',
			method: 'POST',
			body,
			successCallback: ({ status, data, error }) => {
				if (!status) {
					return setError(`Unable to duplicate event (${props.title}). ${error}`);
				}

				setReadingSessions((x) => [{ ...body, ...data }, ...x]);
				setSuccess(`Reading session (${props.title}) duplicated`);
			},
			errorCallback: () =>
				setError(
					`Unable to reach the server while attempting to duplicate event (${
					props.title
					}). ${tryAgainMsg()}`
				),
		});
		rq.finally(() => {
			setIsLoading(false);
			handleEditEventCallback({ id: props.id, isDuplicating: false });
		});
	};

	let eventUrl;
	if (isDraft) eventUrl = '/create-reading-session';
	else if (isStory) eventUrl = `/online-storytime/${props.id}`;
	else eventUrl = `/class/${props.class_id}/event/${props.id}/in`;

	const head = (props.start_date || '').split('T')[0] + 'T';
	const tail = '.000Z';
	const combinedStartDate = head + props.start_time + tail;
	const combinedEndDate = props.end_time ? head + props.end_time + tail : head + '00:00:00' + tail;

	const isValidDates =
		!isNaN(new Date(combinedStartDate) * 1) && !isNaN(new Date(combinedEndDate) * 1);

	const startDateM = moment(combinedStartDate);
	console.log(startDateM, props.timezone);
	const startDateMTZ = moment.tz(combinedStartDate, props.timezone + '' || 'America/Los_Angeles');
	const endDateMTZ = moment.tz(combinedEndDate, props.timezone + '' || 'America/Los_Angeles');

	const {
		class_id,
		description,
		grade_level,
		id,
		is_public,
		is_published,
		isPublishing,
		// title,
		// url,
		languages,
	} = props;

	let langs;
	if (!languages)
		langs = (
			<Alert severity='warning' className={classes.marginTop}>
				Missing languages
			</Alert>
		);
	else
		langs = (typeof languages === 'string' ? languages.split(/\s*,+\s*/) : languages).map(
			(language) => (
				<div className={clsx({ [classes.marginTop]: true, [classes.span]: true })} key={language}>
					<Chip color='primary' size='medium' label={languageMap[language]} />
				</div>
			)
		);

	// const cardHeroArray = [MountainScene, ThreeTags, ScenicBackground];
	// console.log(MountainScene);

	return (
		<div className={classes.sessionsContainer}>
			<Paper className={classes.paper}>
				<Grid container spacing={2}>
					<Ribbon position='left' ribbonText='Draft Mode' />
					<Grid item xs={11} md={2}>
						<div className={classes.dateContainer}>
							{isValidDates && (
								<Fragment>
									<Typography variant='h4' className={classes.month}>
										{startDateM.format('MMM')}
									</Typography>
									<Typography variant='h4' className={classes.day}>
										{parseInt(startDateM.format('D'))}
									</Typography>
									<Typography variant='body1' className={classes.dayOfWeek}>
										{startDateM.format('dddd')}
									</Typography>
									{isDraft && (
										<Fragment>
											<Alert severity='warning' align='left'>
												Unpublished
											</Alert>
											<FormControl fullWidth>
												<LinkButton
													variant='outlined'
													size='small'
													href={eventUrl}
													className={classes.linkContainer}
												>
													Edit
												</LinkButton>
												<Button
													size='small'
													onClick={handleDeleteDraft}
													className={classes.marginTop}
												>
													Delete Draft
												</Button>
											</FormControl>
										</Fragment>
									)}
								</Fragment>
							)}
						</div>
					</Grid>

					<Grid item xs={11} md={9}>
						<div className={classes.detailsContainer}>
							{!isDraft && (
								<Fragment>
									<Typography variant='h4' className={classes.link}>
										{props.title}
									</Typography>
								</Fragment>
							)}
							{!props.title && (
								<Alert severity='warning' className={classes.marginTop}>
									Title missing
								</Alert>
							)}
							{isDraft && (
								<Fragment>
									<Typography variant='h4' className={classes.link}>
										{props.title}
									</Typography>
									<Link href={eventUrl}>Edit</Link>
								</Fragment>
							)}
							<Box>
								<div className={clsx(classes.marginTop, classes.span)}>
									<Chip
										variant={is_public ? 'default' : 'outlined'}
										color={is_public ? 'secondary' : 'primary'}
										size='medium'
										label={is_public ? 'Public Event' : 'Private Event'}
										icon={<Icon size='small'>{is_public ? 'supervisor_account' : 'lock'}</Icon>}
									/>
								</div>
								{isValidDates && startDateMTZ && (
									<Typography variant='body1' className={clsx(classes.marginTop, classes.span)}>
										{startDateMTZ.format('dddd MMM DD, YYYY @h:m')}-{endDateMTZ.format('h:00 a')}
										{` (`}
										{startDateMTZ.format('z')})
									</Typography>
								)}
								{!isValidDates && (
									<Alert severity='warning' className={classes.marginTop}>
										Dates missing
									</Alert>
								)}
							</Box>
							{props.price && (
								<Typography align='right' className={clsx(classes.marginTop, classes.span)}>
									{props.currency} {props.price}
								</Typography>
							)}
							{!props.price && (
								<Alert severity='warning' className={classes.marginTop}>
									Price missing
								</Alert>
							)}
							{props.description && (
								<Typography variant='body2' className={classes.marginTop} gutterBottom>
									{description}
								</Typography>
							)}
							{!props.description && (
								<Alert severity='warning' className={classes.marginTop}>
									Description missing
								</Alert>
							)}
							{grade_level && (
								<div className={clsx(classes.marginTop, classes.span)}>
									<Chip
										variant='outlined'
										color='primary'
										size='medium'
										label={`${grade_level[0].toUpperCase()}${grade_level.slice(1)}`}
									/>
								</div>
							)}
							{langs}
						</div>
					</Grid>
					<Grid item xs={1} align='right'>
						<div className={classes.immediateActionContainer}>
							{is_published === 1 && (
								<LinkButton
									color='primary'
									size='small'
									href={`/class/${class_id}/event/${props.id}/in`}
								>
									Go To Class
								</LinkButton>
							)}
						</div>
						<div className={classes.actionContainer}>
							<IconButton
								aria-describedby={'popover_event_' + id}
								variant='contained'
								onClick={handleClickPopover}
								className={classes.actionButtons}
							>
								<Icon>more_vert</Icon>
							</IconButton>

							<Popover
								id={'popover_event_' + id}
								open={isOpened}
								anchorEl={anchorEl}
								onClose={handleClosePopover}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'center',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'center',
								}}
							>
								{isDraft && (
									<Box m={1}>
										<LinkButton
											href='/create-reading-session'
											fullWidth
											color='primary'
											variant='outlined'
										>
											Edit Event
										</LinkButton>
									</Box>
								)}
								{!isDraft && (
									<Fragment>
										<Box m={1}>
											<Button disabled={isPublishing} onClick={handlePublishEvent} fullWidth>
												{props.isPublishing ? (
													<CircularProgress />
												) : is_published ? (
													'Unpublish Event'
												) : (
															'Publish Event'
														)}
											</Button>
										</Box>
										<Divider />
										<Box m={1}>
											<Button
												disabled={props.isDuplicating}
												onClick={handleDuplicateEvent}
												fullWidth
											>
												Duplicate Event
											</Button>
										</Box>

										<Divider />
										<Box m={1}>
											<Button
												onClick={() =>
													setActiveReadingEventProps({ ...props, __action: 'view-students' })
												}
												fullWidth
											>
												View Students
											</Button>
										</Box>

										<Divider />
										<Box m={1}>
											<Button
												onClick={() => setActiveReadingEventProps({ ...props, __action: 'edit' })}
												fullWidth
											>
												Edit Event
											</Button>
										</Box>

										<Divider />
										<Box m={1}>
											<Button
												onClick={() =>
													setActiveReadingEventProps({ ...props, __action: 'invite-guest-teacher' })
												}
												fullWidth
											>
												Invite Guest Teacher
											</Button>
										</Box>
										<Divider />
										<Box m={1}>
											<Button
												fullWidth
												className={classes.cancelEvent}
												onClick={() =>
													setActiveReadingEventProps({ ...props, __action: 'cancel-event' })
												}
											>
												Cancel Event
											</Button>
										</Box>
									</Fragment>
								)}
							</Popover>
						</div>
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
};

ReadingSessionCard.defaultProps = { setActiveReadingEventProps: () => { } };

export default ReadingSessionCard;
