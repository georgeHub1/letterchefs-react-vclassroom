import React, { useState, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import '../../assets/css/book.css';
import useStyles from './useStyles';
import bookData from './data/the-legend-of-the-white-chrysanthemum.json';
import Carousel from '../../components/Carousel';

const Books = () => {
	const classes = useStyles();
	// const { media, pageContent } = bookData;
	// console.log(bookData);
	// console.log(media);

	let currentLanguage = window.location.pathname.split('/')[2];
	if (currentLanguage.length > 2) {
		//title of book should be > 2 characters
		currentLanguage = 'vn';
	}
	//console.log('language', currentLanguage);
	const english = bookData.pageContent.en;
	const foreignLanguage = bookData.pageContent[currentLanguage];
	const combinedText = [];
	const combinedMediaUrl = [];

	english.forEach((pageText, index) => {
		combinedText.push(pageText);
		combinedText.push(foreignLanguage[index]);
		combinedMediaUrl.push(bookData.media[index]);
		combinedMediaUrl.push(bookData.media[index]);
	});

	//console.log(combinedText);
	console.log(combinedMediaUrl);

	const [index, setIndex] = useState(0);
	let isVideo = combinedMediaUrl[index].type === 'video';
	const carouselProps = {
		isAutoplay: index === 0,
		id: `video-container-${index}`,
		pageIndex: index,
		srcImg: isVideo ? undefined : combinedMediaUrl[index].url[0].img,
		srcMp4: isVideo ? combinedMediaUrl[index].url[0].mp4 : undefined,
		srcWebm: isVideo ? combinedMediaUrl[index].url[0].webm : undefined,
	};

	const [slideIn, setSlideIn] = useState(true);
	const [slideDirection, setSlideDirection] = useState('down');
	const [slideProps, setSlideProps] = useState(carouselProps);

	const numSlides = bookData.numPages * 2; //double the book into 2 languages
	const handleArrowClick = (direction) => {
		const increment = direction === 'left' ? -1 : 1;

		const newIndex = (index + increment + numSlides) % numSlides;

		const oppDirection = direction === 'left' ? 'right' : 'left';
		setSlideDirection(direction);
		setSlideIn(false);

		setTimeout(() => {
			setIndex(newIndex);
			isVideo = combinedMediaUrl[newIndex].type === 'video';
			const newSlideProps = {
				isAutoplay: newIndex === 0,
				id: `video-container-${newIndex}`,
				pageIndex: newIndex,
				srcImg: isVideo ? undefined : combinedMediaUrl[newIndex].url[0].img,
				srcMp4: isVideo ? combinedMediaUrl[newIndex].url[0].mp4 : undefined,
				srcWebm: isVideo ? combinedMediaUrl[newIndex].url[0].webm : undefined,
			};
			console.log('newslideprops========', newSlideProps);
			setSlideProps(newSlideProps);
			setSlideDirection(oppDirection);
			setSlideIn(true);
		}, 500);
	};

	const goToPage = (ind) => {
		const isIncreased = ind > index;
		const newIndex = (ind + numSlides) % numSlides;

		const direction = isIncreased ? 'right' : 'left';
		const oppDirection = !isIncreased ? 'right' : 'left';
		setSlideDirection(direction);
		setSlideIn(false);

		setTimeout(() => {
			setIndex(newIndex);
			isVideo = combinedMediaUrl[newIndex].type === 'video';
			const newSlideProps = {
				isAutoplay: newIndex === 0,
				id: `video-container-${newIndex}`,
				pageIndex: newIndex,
				srcImg: isVideo ? undefined : combinedMediaUrl[newIndex].url[0].img,
				srcMp4: isVideo ? combinedMediaUrl[newIndex].url[0].mp4 : undefined,
				srcWebm: isVideo ? combinedMediaUrl[newIndex].url[0].webm : undefined,
			};
			setSlideProps(newSlideProps);
			setSlideDirection(oppDirection);

			setSlideIn(true);
		});
	};

	return (
		<Fragment>
			<Grid container justify='center' alignItems='center'>
				<Grid item xs={1} align='right'>
					<Button
						direction='left'
						onClick={() => handleArrowClick('left')}
						className={classes.buttonContainer}
					>
						<Icon className={classes.arrowBack}>arrow_forward_ios</Icon>
					</Button>
				</Grid>
				<Grid item xs={10}>
					<div className={classes.pageIndexContainer}>
						{combinedMediaUrl.map((elem, ind) => {
							return (
								<IconButton className={classes.pageIndex} key={ind} onClick={() => goToPage(ind)}>
									{ind}
								</IconButton>
							);
						})}
					</div>
					<Slide in={slideIn} direction={slideDirection}>
						<div>
							<Carousel media={slideProps} key={index}>
								{combinedText[index].split('\n')
									? combinedText[index].split('\n').map((elem, i) => {
											return <p key={i}>{elem}</p>;
									  })
									: combinedText[index]}
							</Carousel>
						</div>
					</Slide>
				</Grid>
				<Grid item xs={1} align='left'>
					<Button
						direction='right'
						onClick={() => handleArrowClick('right')}
						className={classes.buttonContainer}
					>
						<Icon className={classes.arrow}>arrow_forward_ios</Icon>
					</Button>
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default Books;
