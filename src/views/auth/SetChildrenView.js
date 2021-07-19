import React, { Fragment, useState /*useCallback, useEffect*/ } from 'react';
import {
	Fab,
	FormControl,
	FormHelperText,
	Grid,
	Icon,
	IconButton,
	Input,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Tooltip,
	Typography,
	makeStyles,
} from '@material-ui/core';
import TextMaskCustom from '../../components/ux/TextMaskCustom';
import Color from '../../mixins/palette';
import { getUserDetails } from '../../helpers';

const useStyles = makeStyles((theme) => ({
	parentProfileWrapper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(5),
	},
	childProfileWrapper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(5),
	},
	childPhoto: {
		fontSize: 128,
		color: Color.hex.grape,
	},
	childPhotoContainer: {
		position: 'relative',
	},
	childPhotoUpload: {
		position: 'absolute',
		top: 0,
		right: 0,
	},
	childProfileInfo: {
		alignSelf: 'center',
	},
	sectionInfo: {
		textAlign: 'right',
		color: Color.hex.grey,
	},
}));

const SetChildrenView = () => {
	const classes = useStyles();

	const currentUserDetails = getUserDetails() || {};
	// const [userDetails, setUserDetails] = useState(currentUserDetails);
	const userDetails = { ...currentUserDetails };
	// console.log(userDetails);
	let { given_name: first_name, family_name: last_name, name, email } = userDetails;

	if (!first_name) {
		var fullName = name.split(' ');
		var [first, ...last] = fullName;
		first_name = first;
		last_name = last.join(' ');
	}

	// const [childInfo, setChildInfo] = useState({});
	const childInfo = {};
	const oneChildInfo = {
		child_first_name: undefined,
		child_last_name: undefined,
		child_grade_level: undefined,
		child_age: undefined,
	};
	const childrenList = [oneChildInfo];
	const [children, setChildren] = useState(childrenList);
	const handleGradeChange = (e /* index */) => {
		const gradeLevel = e.target.value;
		console.log(gradeLevel);
	};

	// useEffect(() => {
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [children]);

	const handleAddChild = (e, index) => {
		e.preventDefault();
		e.stopPropagation();

		console.log(index);
		childrenList.push(oneChildInfo);
		console.log(childrenList);
		setChildren(childrenList);
	};

	const [phone, setPhone] = useState({
		textmask: '(   )    -    ',
		numberformat: '1320',
	});

	const handlePhoneInput = (event) => {
		setPhone({
			...phone,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<Fragment>
			{/*		<Page title={`Add Child's name | LetterChefs | Bilingual Live Reading Classes`}>
			<Grid container className={classes.root} justify='center'>
				<Grid item className={classes.container} xs={8}>
					<Paper variant='outlined'>
	<Box p={4}>*/}

			<div className={classes.parentProfileWrapper}>
				<form noValidate>
					<Grid container spacing={3} alignItems='center'>
						<Grid item xs={6}>
							<Typography gutterBottom variant='h3'>
								Verify Your Info
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography gutterBottom variant='body1' className={classes.sectionInfo}>
								{email}
							</Typography>
						</Grid>
						<Grid item xs={1}>
							<Icon>person</Icon>
						</Grid>
						<Grid item xs={3}>
							<FormControl fullWidth>
								<TextField required id='first_name' label='First Name' defaultValue={first_name} />
								<FormHelperText id='phone-helper-text'>What your friends call you</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={3}>
							<FormControl fullWidth>
								<TextField required id='last_name' label='Last Name' defaultValue={last_name} />
								<FormHelperText id='phone-helper-text'>What your famiily gave you</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={1} className={classes.childProfileInfo}>
							<Icon>phone</Icon>
						</Grid>
						<Grid item xs={4}>
							<FormControl fullWidth>
								<InputLabel htmlFor='formatted-phone-input'>Phone</InputLabel>
								<Input
									value={phone.textmask}
									id='formatted-phone-input'
									label='Phone'
									name='textmask'
									defaultValue={phone}
									inputComponent={TextMaskCustom}
									onChange={handlePhoneInput}
								/>
								<FormHelperText id='phone-helper-text'>
									We text you to remind you of class - in case you forget
								</FormHelperText>
							</FormControl>
						</Grid>
						{/*<Grid item xs={1} className={classes.childProfileInfo}>
											<Icon>email</Icon>
										</Grid>
										<Grid item xs={5}>
											<FormControl fullWidth>
												<TextField
													required
													disabled
													id='email'
													label='Email'
													defaultValue={email}
												/>
												<FormHelperText id='phone-helper-text'>
													We will send you email reminders about your event.
												</FormHelperText>
											</FormControl>
	</Grid>*/}
					</Grid>
				</form>
			</div>

			<div className={classes.childProfileWrapper}>
				<form noValidate>
					<Grid container spacing={3} alignItems='center'>
						<Grid item xs={7}>
							<Typography gutterBottom variant='h3'>
								Add Your Child
							</Typography>
						</Grid>
						<Grid item xs={5}>
							<Typography gutterBottom variant='body1' className={classes.sectionInfo}>
								Help our teachers better engage with your child/children in class.
							</Typography>
						</Grid>
						{children.map((child, index) => {
							return (
								<Fragment key={index}>
									<Grid
										item
										xs={3}
										alignItems='center'
										align='center'
										className={classes.childPhotoContainer}
									>
										<Icon className={classes.childPhoto}>face</Icon>
										<IconButton className={classes.childPhotoUpload}>
											<Icon>add_a_photo</Icon>
										</IconButton>
									</Grid>
									<Grid item xs={4} className={classes.childProfileInfo}>
										<FormControl fullWidth>
											<TextField
												required
												id='child_first_name'
												label='Child First Name'
												defaultValue={childInfo.first_name}
											/>
											<TextField
												required
												id='child_age'
												label='Child Age'
												number
												min={2}
												max={18}
												defaultValue={childInfo.age}
											/>
										</FormControl>
									</Grid>
									<Grid item xs={4} className={classes.childProfileInfo}>
										<FormControl fullWidth>
											<TextField
												required
												id='child_last_name'
												label='Child Last Name'
												defaultValue={childInfo.last_name}
											/>
										</FormControl>
										<FormControl fullWidth>
											<InputLabel required id='grade'>
												Grade Level
											</InputLabel>
											<Select
												defaultValue=''
												label='Grade Level'
												labelId='grade'
												value={childInfo.gradeLevel}
												onChange={handleGradeChange}
												required
											>
												<MenuItem value=''>
													<em>None</em>
												</MenuItem>
												<MenuItem value='Pre-School'>Pre-School</MenuItem>
												<MenuItem value='Pre-Kindergarten'>Pre-Kindergarten</MenuItem>
												<MenuItem value='Kindergarten'>Kindergarten</MenuItem>
												<MenuItem value='Grade1'>Grade 1</MenuItem>
												<MenuItem value='Grade2'>Grade 2</MenuItem>
												<MenuItem value='Grade3'>Grade 3</MenuItem>
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={1} className={classes.childProfileInfo}>
										<FormControl fullWidth>
											<Tooltip title='Add Child' aria-label='add'>
												<Fab color='primary' onClick={(e) => handleAddChild(e, index)}>
													<Icon>add</Icon>
												</Fab>
											</Tooltip>
										</FormControl>
									</Grid>
									<Grid item xs={3} className={classes.childProfileInfo}></Grid>
									<Grid item xs={4} className={classes.childProfileInfo}>
										<FormControl fullWidth></FormControl>
									</Grid>
									<Grid item xs={4} className={classes.childProfileInfo}>
										<FormControl fullWidth></FormControl>
									</Grid>
								</Fragment>
							);
						})}
					</Grid>
				</form>
			</div>
			{/*						</Box>
					</Paper>
				</Grid>
			</Grid>
</Page>*/}
		</Fragment>
	);
};

export default SetChildrenView;
