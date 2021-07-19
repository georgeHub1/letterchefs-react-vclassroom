import React, { useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import '../../../assets/css/book.css';
import useStyles from '../useStyles';

const TheLegendOfTheWhiteDaisyVietnamese = () => {
	const classes = useStyles();
	let currentLanguage = window.location.pathname.split('/')[2];
	if (currentLanguage.length > 2) {
		//title of book should be > 2 characters
		currentLanguage = 'vn';
	}
	console.log('language', currentLanguage);

	const bookData = {
		title: 'The Legend of The White Daisy',
		numPages: 11,
		media: [
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
			{
				//array position corresponds to page number
				type: 'video',
				url: [
					{
						mp4:
							'https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4',
						webm:
							'https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm',
					},
				],
			},
		],
		pageContent: {
			//array position corresponds to page number
			en: [
				`The little girl happily brought back flowers. Just meeting the old man, she received the good news: \n
				"Your mother is cured! This is all because of your love for your mother!" Since then, 
				people have named the flower she brought back as "white chrysanthemum", 
				considering this flower a symbol of children's love for their parents.`,

				`After a moment of agonizing thoughts, the little girl suddenly sat beside the flower, 
				gently tearing each petal into small strands. Each of those tiny petals becomes a long, soft petal. 
				From a flower with twenty petals, now becomes a flower with countless petals.`,

				`The little girl quickly counted each petal carefully: "One, two, three ..., 
				twenty petals! Oh no! Does my mother have only twenty days left to live?"`,

				`Finally, she found the only white flower on the top of the mountain. 
				She cherished the flower like a treasure. Suddenly, she was hearing a voice:\n 
				"The number of petals in this flower will decide the number of days your mother will live."`,

				`It was very cold outside, the wind whistled in each wind. 
				She only has a thin shirt that covered her body, 
				but because she kept thinking about her mother, 
				she kept walking and walking
				...No matter how hard her journey was, 
				she kept going and never turned back.`,

				`The girl was extremely happy and led the old man home. After seeing the girl's mother, the old man said: 
				"Your mother's state of illness is quite grave. I need to go up the mountain, 
				find a single white flower, I will help!"`,

				`As she was on her way, walking to find the doctor, 
				she met an old man with gray hair and beard, and politely greeted him. 
				The old man immediately asked: \n 
				"Where are you going in such a hurry?"\n 
				The girl replied:\n 
				"Sir, I am looking for a good doctor who can help cure my mother!"\n 
				The old man smiled and said:\n 
				"I am the doctor! I will go with you to check on your mother!"`,

				`One day, the mother became seriously ill, and she immediately told her daughter:\n 
				"I don't feel well, please go out and help find me a doctor.`,

				`Without her father by their side, life became increasingly difficult as her mother has to work as a single mother to 
				in order to create a comfortable life the family. Her mother works hard as a single mother to raise her daughter, 
				so that her daughter can grow up to be a good person.`,

				`Once upon a time, in a faraway village, there were a mother and a daughter living with each other, 
				lovingly taking care of each other. The young girl does chores around the house to help her mother, 
				Her father had passed away when she was a young child, and as she grew up, her mother became her world.`,
			],
			vn: [
				`Cô bé sung sướng mang hoa trở về. Vừa gặp cụ già, cô nhận được tin vui:\n 
				"Mẹ cháu khỏi bệnh rồi! Đây chính là phần thưởng cho lòng hiếu thảo của cháu!" 
				Kể từ đó, mọi người đặt tên cho loài hoa cô bé đem về là "hoa cúc trắng", 
				coi loài hoa này là biểu tượng cho tấm lòng hiếu thảo của con cái dành cho cha mẹ.`,

				`Sau một hồi đau khổ suy nghĩ, cô bé chợt ngồi sụp xuống bên bông hoa, 
				nhẹ nhàng xé từng cánh hoa thành nhiêu sợi nhỏ. Mỗi sợi nhỏ ấy lại trở thành một cánh hoa dài mướt, mềm mại. 
				Từ một bông hoa có hai mưới cánh, giờ đã trở thành bông hoa có vô vàn cánh.`,

				`Cô bé vội cẩn thận đếm từng cánh hoa:\n"Một, hai, ba..., hai mươi cánh! 
				Trời ơi! Chẳng lẽ mẹ mình chỉ còn sống được hai mươi ngày nữa thôi sao?"`,

				`Cuối cùng, cô bé cũng tìm được bông hoa trắng duy nhất trên đỉnh núi. 
				Cô nâng niu bông hoa như một vật báu. Bỗng bên tai cô văn vảng tiếng cụ già:\n
				"Bôn hoa có bao nhiều cành thì mẹ cháu sẽ sống thêm được bấy nhiêu ngày."`,

				`Ngoài trời đang rất lạnh, gió rít từng con. Cô bé chỉ có mộ manh áo mỏng trên người nhưng vì thương mẹ, 
				cô cứ đi mãi, di mãi...Dù khó khăn thế nào, cô bé cũng không chịu lùi bước.`,

				`Cô bé vô cùng mừng rỡ, vộ dẫn ông cụ về nhà. Sau khi xem bệnh, ông cụ bảo:\n
				"Bệnh của mẹ cháu nằng lắm rồi. Cháu cần lên núi, tìm một cây hoa có duy nhất một bông hoa mầu trắng về đây, ta sẽ giúp!"`,

				`Trên đường, cô gặp một cụ già râu tóc bạc phơ, bèn lễ phép chào cụ. Cụ già liền hỏi: \n 
				"Cháu định đi đâu mà vội vàng như vậy?"\n 
				Cô bé đáp:\n
				"Thưa cụ, cháu đang đi tìm thầy thuốc giỏi để chữa bệnh cho mẹ ạ!"\n 
				Cụ già tươi cười nói:\n
				"Ta chính là thầy thuốc! Ta sẽ khám bệnh giúp mẹ cháu!"`,

				`Một ngày kia, người mẹ bị ốm nặng, liền gọi con gái lại và bảo:\n 
				"Mẹ thấy trong người không được khoẻ, con hãy đi mời thầy thuốc cho mẹ.`,

				`Cuộc sống ngày càng khó khăn, khi thiếu vắng bàn tay của cha, 
				khiến mẹ cô bé phải làm biết bao nhiêu việc lớn nhỏ để nuôi con khôn lớn.`,

				`Ngày xửa ngày xưa,ở một ngôi làng xa xôi, có một người mẹ và một cô con gái sống với nhau, 
				yêu thương chăm sóc lẫn nhau. Cô gái trẻ rất chăm chỉ, và luôn ở bên mẹ. 
				Cha cô ấy đã mất khi cô ấy còn rất nhỏ, và khi lớn lên, cô ấy trở nên rất thân thiết với mẹ mình.`,
			],
			cn: [
				`從前，在一個遙遠的村莊里，有一個母親和一個女兒彼此同住，彼此相愛。這位年輕的女士非常勤奮，一直為母親服務。
				她的父親在她很小的時候就去世了，她從小到大跟母親非常親近。`,
			],
		},
	};

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
				}, 350);
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
		}, 300);
	};

	useEffect(() => {
		turnRight();
	});

	return (
		<div className='book-section'>
			<div className='container'>
				{bookData.pageContent.en.map((pageText, index, bookContent) => {
					return (
						<Fragment key={index}>
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
												autoPlay
												id={`page1-webm`}
												src={`https://res.cloudinary.com/lienista/video/upload/v1603312847/the-legend-of-the-white-daisy-page-1-webm.webm`}
												type='video/webm'
											/>
											<source
												autoPlay
												id={`page1-mp4`}
												src={`https://res.cloudinary.com/lienista/video/upload/v1603312844/the-legend-of-the-white-daisy-page-1-mp4.mp4`}
												type='video/mp4'
											/>
											Your browser does not support the video tag. I suggest you upgrade your
											browser.
										</video>
									</div>
									<div className={classes.textContainer}>
										Ngày xửa ngày xưa, ở một ngôi làng xa xôi, có một người mẹ và một cô con gái
										sống với nhau, yêu thương chăm sóc lẫn nhau. Cô gái trẻ rất chăm chỉ, và luôn ở
										bên mẹ. Cha cô ấy đã mất khi cô ấy còn rất nhỏ, và khi lớn lên, cô ấy trở nên
										rất thân thiết với mẹ mình.
									</div>
								</figure>
							</div>
							<div className='right'>
								<figure className='back'></figure>
								<figure className='front'>
									{bookData.media[index].type === 'video' && (
										<div id={`video-container-${index}`} className={classes.videoContainer}>
											<video controls muted='muted'>
												<track default kind='captions' srcLang='en' src='' />
												<source
													autoPlay={index === bookContent.length - 1}
													id={`page${index}-webm`}
													src={bookData.media[index].url[0].webm}
													type={`${bookData.media[index].type}/webm`}
												/>
												<source
													autoPlay={index === bookContent.length - 1}
													id={`page${index}-mp4`}
													src={bookData.media[index].url[0].mp4}
													type={`${bookData.media[index].type}/mp4`}
												/>
												Your browser does not support the video tag. I suggest you upgrade your
												browser.
											</video>
										</div>
									)}

									<div className={classes.textContainer}>
										{pageText.split('\n').map((elem, i) => (
											<p key={i}>{elem}</p>
										))}
									</div>
								</figure>
							</div>
						</Fragment>
					);
				})}

				<div className='right'>
					<figure className='back'></figure>
					<figure className='front' id='cover'>
						<Typography variant='h1'>The Legend of the White Daisy</Typography>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, modi.</p>
					</figure>
				</div>
				<div className={classes.theEnd}>The End</div>
			</div>

			<Button
				color='primary'
				variant='contained'
				size='large'
				className={classes.prevButton}
				onClick={turnLeft}
			>
				Prev
			</Button>
			<Button
				color='primary'
				variant='contained'
				size='large'
				className={classes.nextButton}
				onClick={turnRight}
			>
				Next
			</Button>
		</div>
	);
};

export default TheLegendOfTheWhiteDaisyVietnamese;
