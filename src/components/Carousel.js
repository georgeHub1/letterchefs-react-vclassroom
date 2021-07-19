import React from 'react';
import { makeStyles } from '@material-ui/core';
import { common, grey } from '@material-ui/core/colors';

export default function Carousel({ media, children }) {
	const useStyles = makeStyles(() => ({
		card: {
			borderRadius: 5,
			boxShadow: `10px 10px 10px ${grey[500]}`,
			display: 'block',
			margin: 'auto',
			maxWidth: 1280,
			maxHeight: 720,
			position: 'relative',
			flexFlow: 'row wrap',
		},
		textContainer: {
			animation: '$textAppear 0s 4s forwards',
			background: 'rgba(0,0,0,0.4)',
			color: common.white,
			fontSize: '2.5em',
			maxHeight: '90%',
			opacity: 0,
			overflowY: 'scroll',
			padding: 30,
			position: 'absolute',
			right: 0,
			textAlign: 'left',
			textShadow: `-2px -2px 0 #000,  2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`,
			top: 0,
			width: 520,
			zIndex: 100,
		},
		'@keyframes textAppear': {
			to: { opacity: 1 },
		},
		mediaContainer: {
			maxHeight: 720,
			maxWidth: 1280,
			background: common.black,
			zIndex: media.pageIndex,
		},
	}));

	const classes = useStyles();
	const { id, pageIndex, srcImg, srcWebm, srcMp4 } = media;

	return (
		<div className={classes.card}>
			<div id={id} className={classes.mediaContainer}>
				{srcWebm && (
					<video controls muted='muted' autoPlay>
						<track default kind='captions' srcLang='en' src='' />
						<source id={`page${pageIndex}-webm`} src={srcWebm} type='video/webm' />
						<source id={`page${pageIndex}-mp4`} src={srcMp4} type='video/mp4' />
						Your browser does not support the video tag. I suggest you upgrade your browser.
					</video>
				)}
				{srcImg && (
					<img src={srcImg} className={classes.mediaContainer} alt={`page ${pageIndex}`} />
				)}
			</div>
			<div className={classes.textContainer}>{children}</div>
		</div>
	);
}
