import React from 'react';
import {
	Box,
	Container,
	FormControl,
	FormHelperText,
	Grid,
	InputAdornment,
	InputLabel,
	// makeStyles,
	MenuItem,
	Select,
	TextField,
} from '@material-ui/core';

import Page from '../../../components/Page';
import { /*userID,*/ userDetails } from '../../../helpers';

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		width: '100%',
// 	},
// 	container: {
// 		display: 'block',
// 	},
// 	selectWrapper: {
// 		width: '100%',
// 	},
// 	letterchefsBody: {
// 		width: '50%',
// 	},
// 	letterchefsTextfield: {
// 		width: 'calc(50% - 20px)',
// 	},
// 	urlWrapper: {
// 		display: 'flex',
// 		alignItems: 'center',
// 		justifyContent: 'flex-end',
// 	},
// 	textFieldUrl: {
// 		paddingLeft: '50%',
// 	},
// 	url: {
// 		marginRight: -theme.spacing(3),
// 	},
// }));

const AddClass = (props) => {
	const {
		isOnboarding,
		fullName,
		gradeLevel,
		org,
		title,
		classroomUrl,
		classroomLongName,
		updateFullName,
		updateGradeLevel,
		updateOrg,
		updateTitle,
		updateClassroomUrl,
		updateClassroomLongName,
		handleAddClassData,
	} = props;

	const { family_name } = userDetails;
	const formData = { title, fullName, gradeLevel, org, classroomLongName, classroomUrl };

	// const cssClasses = useStyles();

	const handleTitleChange = (e) => {
		let titleString = e.target.value;
		formData.title = titleString;
		updateTitle(titleString);

		titleString = titleString.length ? `${capitalizeFirstLetter(titleString)}. ` : '';

		const longname = `${titleString}${capitalizeFirstLetter(family_name)}${
			gradeLevel ? ' ' + gradeLevel : ''
		}`;
		updateClassroomLongName(longname);
		const url = encodeURIComponent(longname.toLowerCase().split(' ').join('-').split('.').join(''));
		updateClassroomUrl(url);

		formData.classroomLongName = longname;
		formData.classroomUrl = url;
		handleAddClassData(formData);
	};

	const handleFullNameChange = (e) => {
		updateFullName(e.target.value);
		formData.fullName = e.target.value;
		handleAddClassData(formData);
	};

	const handleClassroomUrlChange = (e) => {
		let url = e.target.value.toLowerCase().split('/').join('');
		url = url.length ? `${url}` : '';

		formData.classroomUrl = url;
		handleAddClassData(formData);
		return updateClassroomUrl(url);
	};

	const handleBackspace = (e, fieldType) => {
		if (e.keyCode === 8) {
			console.log('backspace', e.target.value, fieldType);

			if (fieldType === 'classroomUrl') {
				const newUrl = e.target.value.toLowerCase();
				formData.classroomUrl = newUrl;
				handleAddClassData(formData);
				return updateClassroomUrl(newUrl);
			} else if (fieldType === 'fullName') {
				formData.fullName = e.target.value;
				handleAddClassData(formData);
				return updateFullName(fullName);
			} else if (fieldType === 'org') {
				formData.org = e.target.value;
				handleAddClassData(formData);
			}
		}
	};

	const handleClassroomLongNameChange = (e) => {
		const longName = e.target.value;
		console.log(longName);
		const newClassroomUrl = longName.length ? `${longName.toLowerCase().split(' ').join('-')}` : '';

		if (longName.toLowerCase().split(' ').join('-').length) {
			formData.classroomUrl = newClassroomUrl;
			updateClassroomUrl(newClassroomUrl);
		}

		formData.classroomLongName = longName;
		handleAddClassData(formData);
		updateClassroomLongName(longName);
	};

	const handleGradeChange = (e) => {
		const gradeLevel = e.target.value;
		const titleString = title.length ? `${title}. ` : '';

		updateGradeLevel(gradeLevel);

		const classroomLongName = `${capitalizeFirstLetter(titleString)}${capitalizeFirstLetter(
			family_name
		)} ${gradeLevel}`;
		updateClassroomLongName(classroomLongName);
		const classroomUrl = `${title.toLowerCase()}-${family_name.toLowerCase()}-${gradeLevel.toLowerCase()}`;
		updateClassroomUrl(classroomUrl);

		formData.gradeLevel = gradeLevel;
		formData.classroomLongName = classroomLongName;
		formData.classroomUrl = classroomUrl;
		handleAddClassData(formData);
	};

	const handleOrgChange = (e) => {
		const org = e.target.value;
		console.log(org);
		updateOrg(org);
		formData.org = org;
		handleAddClassData(formData);
	};

	const capitalizeFirstLetter = (str) => {
		return str ? str[0].toUpperCase() + str.substring(1).toLowerCase() : '';
	};

	return (
		<Page title='LetterChefs | Live Reading Classes'>
			<Container maxWidth={false}>
				<Grid container direction='row' spacing={3}>
					{isOnboarding && (
						<React.Fragment>
							<Grid item xs={6} sm={2}>
								<FormControl fullWidth>
									<InputLabel id='title'>Title</InputLabel>
									<Select
										defaultValue=''
										label='Title'
										labelId='title'
										id='title'
										value={title}
										onChange={handleTitleChange}
									>
										<MenuItem value=''>
											<em>None</em>
										</MenuItem>
										<MenuItem value='Mr'>Mr.</MenuItem>
										<MenuItem value='Mrs'>Mrs.</MenuItem>
										<MenuItem value='Ms'>Ms.</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6} sm={4}>
								<TextField
									fullWidth
									label='Full Name'
									value={fullName}
									onChange={handleFullNameChange}
									onKeyDown={(e) => handleBackspace(e, 'fullName')}
									required
									inputProps={{ maxLength: '300' }}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel required id='grade'>
										Grade Level
									</InputLabel>
									<Select
										defaultValue='none'
										label='Grade Level'
										labelId='grade'
										value={gradeLevel}
										onChange={handleGradeChange}
										required
									>
										<MenuItem value='none'>
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
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Org'
									value={org ? `${capitalizeFirstLetter(org)}` : ''}
									onChange={handleOrgChange}
									onKeyDown={(e) => handleBackspace(e, 'org')}
									required
									inputProps={{ maxLength: '300' }}
								/>
							</Grid>
						</React.Fragment>
					)}
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<TextField
								fullWidth
								label='Classroom Name'
								value={classroomLongName}
								onChange={handleClassroomLongNameChange}
								onKeyDown={handleClassroomLongNameChange}
								required
								inputProps={{ maxLength: '100' }}
							/>
						</FormControl>
					</Grid>
					<Grid container>
						<Grid item xs={12}>
							<Box ml={1.5} mr={1.5}>
								<FormControl fullWidth>
									<TextField
										label='Classroom URL'
										value={classroomUrl}
										onChange={handleClassroomUrlChange}
										onKeyDown={(e) => handleBackspace(e, 'classroomUrl')}
										required
										inputProps={{ maxLength: '100' }}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													{`https://www.letterchefs.com/`}
												</InputAdornment>
											),
											endAdornment: <InputAdornment>/in</InputAdornment>,
										}}
									/>
									<FormHelperText>
										This is the URL you can share with others, such as other teachers or parents of
										students.
									</FormHelperText>
								</FormControl>
							</Box>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default AddClass;
