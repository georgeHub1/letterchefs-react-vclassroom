import React, { useEffect, Fragment /* , useState */ } from 'react';
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
	// TextareaAutosize,
	TextField,
} from '@material-ui/core';

import Page from '../../../components/Page';
import { getUserDetails } from '../../../helpers';
// import StudentClassView from '../../class/ClassView/Student';

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
	let {
		isOnboarding,
		fullName,
		family_name,
		given_name,
		gradeLevel,
		// org,
		title,
		classroomUrl,
		classroomLongName,
		classroomDescription,
		updateFullName,
		updateGradeLevel,
		// updateOrg,
		updateTitle,
		updateClassroomUrl,
		updateClassroomLongName,
		updateClassroomDescription,
		isSuggestingClassIDs,
		suggestedClassIDs,
		// handleAddClassData,
		// hasOrgErr,
		hasFullNameErr,
		hasClassUrlErr,
	} = props;
	// const formData = { title, fullName, gradeLevel, org, classroomLongName, classroomUrl };

	// const cssClasses = useStyles();

	console.log(props);

	if (!family_name) {
		const names = fullName.trim().split(/\s+/);
		family_name = names[names.length - 1];
		given_name = names[0];
	}

	useEffect(() => {
		const userDetails = getUserDetails();

		var { name } = userDetails;
		console.log(name);
		updateFullName(name);
		updateClassroomUrl(name.split(' ')[1].toLowerCase());
		updateClassroomLongName(name[0].toUpperCase() + name.substring(1));
	}, [fullName, updateClassroomLongName, updateClassroomUrl, updateFullName]);

	const handleTitleChange = (e) => {
		let titleString = e.target.value;
		// formData.title = titleString;
		updateTitle(titleString);

		titleString = titleString.length ? `${capitalizeFirstLetter(titleString)}. ` : '';

		const longname = `${titleString}${capitalizeFirstLetter(family_name)}${
			gradeLevel ? ' ' + gradeLevel : ''
		}`;
		updateClassroomLongName(longname);
		const url = encodeURIComponent(longname.toLowerCase().split(' ').join('-').split('.').join(''));
		updateClassroomUrl(url);

		// formData.classroomLongName = longname;
		// formData.classroomUrl = url;
		// handleAddClassData(formData);
	};

	const handleFullNameChange = (e) => {
		updateFullName(e.target.value);
		// formData.fullName = e.target.value;
		// handleAddClassData(formData);
	};

	const handleClassroomUrlChange = (e) => {
		let url = e.target.value.toLowerCase().split('/').join('');
		url = url.length ? `${url}` : '';

		return updateClassroomUrl(url);
	};

	const handleBackspace = (e, fieldType) => {
		if (e.keyCode === 8) {
			console.log('backspace', e.target.value, fieldType);

			if (fieldType === 'classroomUrl') {
				const newUrl = e.target.value.toLowerCase();
				// formData.classroomUrl = newUrl;
				// handleAddClassData(formData);
				return updateClassroomUrl(newUrl);
			} else if (fieldType === 'fullName') {
				// formData.fullName = e.target.value;
				// handleAddClassData(formData);
				return updateFullName(fullName);
			} else if (fieldType === 'org') {
				// formData.org = e.target.value;
				// handleAddClassData(formData);
			}
		}
	};

	const handleClassroomLongNameChange = (e) => {
		const longName = e.target.value;
		console.log(longName);
		const newClassroomUrl = longName.length ? `${longName.toLowerCase().split(' ').join('-')}` : '';

		if (longName.toLowerCase().split(' ').join('-').length) {
			// formData.classroomUrl = newClassroomUrl;
			updateClassroomUrl(newClassroomUrl);
		}

		// formData.classroomLongName = longName;
		// handleAddClassData(formData);
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

		// formData.gradeLevel = gradeLevel;
		// formData.classroomLongName = classroomLongName;
		// formData.classroomUrl = classroomUrl;
		// handleAddClassData(formData);
	};

	const capitalizeFirstLetter = (str) => {
		return str ? str[0].toUpperCase() + str.substring(1).toLowerCase() : '';
	};

	return (
		<Page title='LetterChefs | Live Reading Classes'>
			<form autoComplete='on' noValidate>
				<Container maxWidth={false}>
					<Grid container direction='row' spacing={3}>
						{isOnboarding && (
							<Fragment>
								<Grid item xs={5} md={3}>
									<FormControl fullWidth variant='outlined'>
										<InputLabel id='title' required>
											Title
										</InputLabel>
										<Select
											label='Title'
											labelId='title'
											id='select-title'
											value={title}
											onChange={handleTitleChange}
											required
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
								<Grid item xs={7} md={9}>
									<TextField
										fullWidth
										variant='outlined'
										label='Full Name'
										value={fullName || `${given_name} ${family_name}`}
										onChange={handleFullNameChange}
										onKeyDown={(e) => handleBackspace(e, 'fullName')}
										required
										inputProps={{
											maxLength: '300',
											pattern:
												"^[a-zA-Z][a-zA-Z0-9-']+\\s+[a-zA-Z][a-zA-Z0-9-']+(\\s+[a-zA-Z][a-zA-Z0-9-']+)?$",
										}}
										autoComplete='name'
										error={hasFullNameErr}
										helperText='Your first and last name'
									/>
								</Grid>

								<Grid item xs={5} md={6}>
									<FormControl fullWidth variant='outlined'>
										<InputLabel label='Grade' required id='grade'>
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
											<MenuItem value='Pre-School'>Pre-School (3+)</MenuItem>
											<MenuItem value='Pre-Kindergarten'>Pre-Kindergarten (4+)</MenuItem>
											<MenuItem value='Kindergarten'>Kindergarten (5+)</MenuItem>
											<MenuItem value='Grade 1'>Grade 1 (6+)</MenuItem>
											<MenuItem value='Grade 2'>Grade 2 (7+)</MenuItem>
											<MenuItem value='Grade 3'>Grade 3 (8+)</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								{/*<Grid item xs={7} md={6}>
									<TextField
										fullWidth
										label='Org'
										value={org ? `${capitalizeFirstLetter(org)}` : ''}
										onChange={updateOrg}
										onKeyDown={(e) => handleBackspace(e, 'org')}
										required
										inputProps={{
											maxLength: '300',
											pattern: "^[a-zA-Z][\\w-'\\s]+$",
										}}
										error={hasOrgErr}
										helperText='Are you part of an organization?'
										variant='outlined'
									/>
									</Grid>*/}
							</Fragment>
						)}
						<Grid item xs={12} md={6}>
							<FormControl fullWidth>
								<TextField
									fullWidth
									required
									label='Classroom Name'
									value={classroomLongName}
									onChange={handleClassroomLongNameChange}
									inputProps={{ maxLength: '100' }}
									variant='outlined'
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth>
								<TextField
									multiline
									fullWidth
									spellCheck
									required
									variant='outlined'
									label='Classroom Description'
									aria-label='Describe this classroom'
									helperText={`This is not a boring classrom, so let's tell the world about it.`}
									value={classroomDescription}
									onChange={updateClassroomDescription}
								/>
							</FormControl>
						</Grid>
						<Grid container>
							<Grid item xs={12}>
								<Box ml={1.5} mr={1.5}>
									<FormControl fullWidth>
										<TextField
											variant='outlined'
											label={`Classroom URL handle`}
											value={classroomUrl}
											onChange={handleClassroomUrlChange}
											onKeyDown={(e) => handleBackspace(e, 'classroomUrl')}
											required
											inputProps={{
												maxLength: '100',
												pattern: '^[a-zA-Z][\\w-]$',
												list: 'suggested-class-ids',
											}}
											InputProps={{
												startAdornment: (
													<InputAdornment position='start'>
														{window.location.origin}/class/
													</InputAdornment>
												),
												endAdornment: <InputAdornment>/in</InputAdornment>,
											}}
											error={hasClassUrlErr}
											helperText='Class urls must start with an letter, followed by alphanumeric characters, or hyphens (-)'
										/>
										<datalist id='suggested-class-ids'>
											{isSuggestingClassIDs &&
												suggestedClassIDs.map((id, ind) => (
													<option key={ind} value={id}>
														{id}
													</option>
												))}
										</datalist>
										<FormHelperText>
											This is the URL you can share with others, such as other teachers or parents
											of students.
										</FormHelperText>
									</FormControl>
								</Box>
							</Grid>
						</Grid>
					</Grid>
				</Container>
			</form>
		</Page>
	);
};

export default AddClass;
