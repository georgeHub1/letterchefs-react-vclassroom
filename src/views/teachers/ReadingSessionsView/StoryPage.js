import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
	Container,
	Grid,
	Paper,
	Typography,
	CircularProgress,
	Icon,
	IconButton,
	makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { red /* , grey, pink, blue */ } from '@material-ui/core/colors';
import Color from '../../../mixins/palette';
import * as moment from 'moment-timezone';

import Page from '../../../components/Page';
import LinkButton from '../../../components/LinkButton';

import languageNames from '../../../localstore/languages.json';
import { Http, tryAgainMsg } from '../../../helpers';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		width: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
	sessionsWrapper: {
		maxWidth: 1200,
		width: '100%',
		display: 'flex',
		flexWrap: 'wrap',
		marginTop: theme.spacing(5),
	},
	sessionsContainer: {
		display: 'flex',
		width: '100%',
	},
	bigHeight: {
		height: 2000,
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
		width: 100,
		justifyContent: 'center',
		textAlign: 'center',
		marginRight: theme.spacing(2),
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
		'&:hover': {
			textDecoration: 'none',
		},
	},
	textarea: {
		width: '100%',
		padding: theme.spacing(1),
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
	},
}));

const canUseNativeShare = window && 'share' in window.navigator;

const StoryPage = () => {
	const classes = useStyles();
	const { story_id } = useParams();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [bought, setBought] = useState(false);

	const [story, setStory] = useState({ created_by: {} });

	useEffect(() => {
		setIsLoading(true);

		const req = Http().secureRequest({
			url: `/reading-schedules/stories/${story_id}`,
			successCallback: ({ status, data, error }) => {
				if (!status) {
					setError(error || 'Error getting reading tickets');
					return;
				}

				setStory(data);
				if (data.pay_status === 'succeeded') setBought(true);
			},
			errorCallback: () => setError('Unable to get reading tickets. ' + tryAgainMsg()),
		});

		req.finally(() => setIsLoading(false));
	}, [story_id]);

	const startDate = (story.start_date || '').split('T')[0];
	const startDateTime = startDate + 'T' + story.start_time;
	const endDateTime = startDate + 'T' + story.end_time;
	const duration = new Date(endDateTime) * 1 - new Date(startDateTime) * 1;
	const durationText = duration / (60 * 1000) + 'min';

	const host = `${story.created_by.title} ${story.created_by.given_name} ${story.created_by.family_name}`;

	const languages = (languageNames.find((x) => (story.languages || '').includes(x.value)) || {})
		.title;

	// const isSeries = !!story.repeat

	const handleShare = () => {
		if (!canUseNativeShare) return;
		window.navigator.share({
			title: story.title,
			url: window.location.origin + window.location.pathname + '/' + story.id,
			text:
				story.description ||
				`Participate in a reading event (${story.title}) for ${story.grade_level} by ${host}`,
		});
	};

	return (
		<Page className={classes.root} title={story.title + ' | Stories | LetterChefs'}>
			<Container maxWidth={false}>
				<Grid container>
					<Grid item xs={12}>
						{error && <Alert severity='error'>{error}</Alert>}
						{bought && <Alert severity='success'>Ticket bought</Alert>}
						{isLoading && (
							<Typography align='center'>
								<CircularProgress />
							</Typography>
						)}

						<div className={classes.sessionsContainer}>
							<Paper className={classes.paper}>
								<div className={classes.dateContainer}>
									<Typography variant='h4' className={classes.month}>
										{moment(startDateTime).format('MMM')}
									</Typography>

									<Typography variant='h4' className={classes.day}>
										{parseInt(moment(startDateTime).format('D'))}
									</Typography>

									<div className={classes.dayOfWeek}>
										<Typography variant='body1'>{moment(startDateTime).format('dddd')}</Typography>
									</div>
								</div>
								<div className={classes.detailsContainer}>
									<Typography variant='h5' className={classes.link}>
										<LinkButton
											variant='text'
											href={`/online-storytime/${story.id}`}
											className={classes.linkContainer}
										>
											{story.title}
										</LinkButton>
									</Typography>
									{!story.is_public && <Typography align='right'>Private Event</Typography>}
									{story.description && (
										<Typography className={classes.link}>{story.description}</Typography>
									)}
									<Typography variant='h6' className={classes.link}>
										{moment.tz(startDateTime, story.timezone || 'America/Los_Angeles').format('ha')}{' '}
										{` (`}
										{moment.tz(startDateTime, story.timezone || 'America/Los_Angeles').zoneAbbr()})
									</Typography>
									<Typography variant='body2' className={classes.gradeLevel}>
										Grade Level: {story.grade_level}
									</Typography>
									<Typography variant='body2'>Hosted By: {host}</Typography>
									<Typography variant='body2'>Duration: {durationText}</Typography>
									<Typography variant='body2'>Languages: {languages}</Typography>
									{canUseNativeShare && (
										<IconButton
											variant='contained'
											onClick={handleShare}
											className={classes.actionButtons}
										>
											<Icon>share</Icon>
										</IconButton>
									)}
								</div>
								<div className={classes.immediateActionContainer}></div>
							</Paper>
						</div>
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default StoryPage;
