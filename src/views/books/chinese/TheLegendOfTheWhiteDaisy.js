import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { teal, common } from '@material-ui/core/colors';
import '../../../assets/css/book.css';
import useStyles from '../useStyles';

const TheLegendOfTheWhiteDaisyChinese = () => {
	const classes = useStyles();

	var right = document.getElementsByClassName('right');

	var si = right.length;
	var z = 1;

	const turnRight = () => {
		if (si >= 1) {
			si--;
		} else {
			si = right.length - 1;
			const sttmot = (i) => {
				setTimeout(function () {
					right[i].style.zIndex = 'auto';
				}, 300);
			};
			for (var i = 0; i < right.length; i++) {
				right[i].className = 'right';
				sttmot(i);
				z = 1;
			}
		}
		right[si].classList.add('flip');
		z++;
		right[si].style.zIndex = z;
	};

	const turnLeft = () => {
		if (si < right.length) {
			si++;
		} else {
			si = 1;
			for (var i = right.length - 1; i > 0; i--) {
				right[i].classList.add('flip');
				right[i].style.zIndex = right.length + 1 - i;
			}
		}
		right[si - 1].className = 'right';
		setTimeout(function () {
			right[si - 1].style.zIndex = 'auto';
		}, 350);
	};

	useEffect(() => {
		turnRight();
	});

	return (
		<div className='book-section'>
			<div className='container'>
				<div className='right'>
					<figure className='back' id='back-cover'></figure>
					<figure className='front'></figure>
				</div>
				<div className='right'>
					<figure className='back'></figure>
					{/*<div
						className='front'
						style={{
							backgroundImage: `url(https://tympanus.net/Development/BookBlock/images/demo1/2.jpg)`,
						}}
					>*/}
					<div className='front'>hello</div>
					{/* </div> */}
				</div>
				<div className='right'>
					<figure
						className='back'
						style={{
							backgroundImage: `url(https://tympanus.net/Development/BookBlock/images/demo1/1.jpg))`,
						}}
					></figure>
					<figure
						className='front'
						style={{
							backgroundImage: `url(https://tympanus.net/Development/BookBlock/images/demo1/2.jpg)`,
						}}
					></figure>
				</div>
				<div className='right'>
					<figure
						className='back'
						style={{
							backgroundImage: `url(https://tympanus.net/Development/BookBlock/images/demo1/1.jpg)`,
						}}
					></figure>
					<figure className='front'>
						<div id='video-container-1-vietnamese' className={classes.videoContainer}>
							<video controls muted='muted'>
								<track default kind='captions' srcLang='en' src='' />
								<source
									id='page1-webm'
									src='https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm'
									type='video/webm'
								/>
								<source
									id='page1-mp4'
									src='https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4'
									type='video/mp4'
								/>
								Your browser does not support the video tag. I suggest you upgrade your browser.
							</video>
						</div>
						<div className={classes.textContainer}>
							從前，在一個遙遠的村莊里，有一個母親和一個女兒彼此同住，彼此相愛。
							這位年輕的女士非常勤奮，一直為母親服務。
							她的父親在她很小的時候就去世了，她從小到大跟母親非常親近。
						</div>
					</figure>
				</div>
				<div className='right'>
					<figure
						className='back'
						style={{
							backgroundImage: `url(https://tympanus.net/Development/BookBlock/images/demo1/1.jpg)`,
						}}
					></figure>
					<figure className='front'>
						<div id='video-container-1' className={classes.videoContainer}>
							<video controls muted='muted'>
								<track default kind='captions' srcLang='en' src='' />
								<source
									id='page1-webm'
									src='https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm'
									type='video/webm'
								/>
								<source
									id='page1-mp4'
									src='https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4'
									type='video/mp4'
								/>
								Your browser does not support the video tag. I suggest you upgrade your browser.
							</video>
						</div>
						<div className={classes.textContainer}>
							Once upon a time, in a faraway village, there were a mother and a daughter living with
							each other, lovingly taking care of each other. The young lady is very hard-working,
							and is always there for her mother. Her father had died when she was very young, and
							as she grew up, she became very close to her mother.
						</div>
					</figure>
				</div>
				<div className='right'>
					<figure className='back'></figure>
					<figure className='front' id='cover'>
						<h1>Book Title</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, modi.</p>
					</figure>
				</div>
				<div className={classes.theEnd}>The End</div>
			</div>

			<Button className={classes.prevButton} onClick={turnLeft}>
				Prev
			</Button>
			<Button className={classes.nextButton} onClick={turnRight}>
				Next
			</Button>
		</div>
	);
};

export default TheLegendOfTheWhiteDaisyChinese;
