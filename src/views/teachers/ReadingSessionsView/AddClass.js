import React from 'react';
import PropTypes from 'prop-types';
import {
	Container,
	FormControl,
	Grid,
	InputLabel,
	// makeStyles,
	MenuItem,
	Select,
	TextField,
	Typography,
	Button,
	CircularProgress,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import Page from '../../../components/Page';

const AddClass = (props) => {
	const {
		error,
		isOnboarding,
		isLoading,
		isSelectingExisting,
		toggleIsSelectingExisting,
		existingClasses,
		classroomLongName,
		classroomDescription,
		gradeLevel,
		classID,
		updateClassroomLongName,
		updateClassroomDescription,
		updateGradeLevel,
		updateClassID,
	} = props;

	return (
		<Page title='LetterChefs | Live Reading Classes'>
			<form autoComplete='on' noValidate>
				<Typography align='right' gutterBottom>
					<Button
						disabled={!isSelectingExisting && existingClasses.length < 1}
						color='secondary'
						variant='contained'
						onClick={toggleIsSelectingExisting}
					>
						{isSelectingExisting ? 'Create New Class' : 'Choose Exisiting Class'}
					</Button>
				</Typography>
				{isLoading && (
					<Typography component='div' align='center' gutterBottom>
						<CircularProgress />
					</Typography>
				)}
				{error && <Alert severity='error'>{error}</Alert>}
				<Container maxWidth={false}>
					{isSelectingExisting && (
						<Grid container direction='row' spacing={3}>
							<Grid item xs={4}>
								<InputLabel required id='existing-class-id'>
									Select a Class
								</InputLabel>
							</Grid>
							<Grid item xs={4}>
								<Select
									labelId='existing-class-id'
									value={classID}
									onChange={updateClassID}
									required
								>
									<MenuItem value=''>
										<em>None</em>
									</MenuItem>
									{existingClasses.map((c) => (
										<MenuItem key={c.class_id} value={c.class_id}>
											{c.name + ' (' + c.grade_level + ')'}
										</MenuItem>
									))}
								</Select>
							</Grid>
						</Grid>
					)}
					{!isSelectingExisting && (
						<Grid container direction='row' spacing={3}>
							{isOnboarding && (
								<React.Fragment>
									<Grid item xs={5} md={6}>
										<FormControl fullWidth>
											<TextField
												fullWidth
												label='Classroom Name'
												value={classroomLongName}
												onChange={updateClassroomLongName}
												required
												inputProps={{ maxLength: '100' }}
											/>
										</FormControl>
									</Grid>
									<Grid item xs={7} md={6}>
										<FormControl fullWidth>
											<InputLabel required id='class-grade-level'>
												Grade Level
											</InputLabel>
											<Select
												labelId='class-grade-level'
												value={gradeLevel}
												onChange={updateGradeLevel}
												required
											>
												<MenuItem value=''>
													<em>None</em>
												</MenuItem>
												<MenuItem value='Pre-School'>Pre-School (4+)</MenuItem>
												<MenuItem value='Pre-Kindergarten'>Pre-Kindergarten (5+)</MenuItem>
												<MenuItem value='Kindergarten'>Kindergarten (6+)</MenuItem>
												<MenuItem value='Grade1'>Grade 1 (7+)</MenuItem>
												<MenuItem value='Grade2'>Grade 2 (8+)</MenuItem>
												<MenuItem value='Grade3'>Grade 3 (9+)</MenuItem>
											</Select>
										</FormControl>
									</Grid>
								</React.Fragment>
							)}
							<Grid item xs={12}>
								<FormControl fullWidth>
									<TextField
										fullWidth
										multiline
										rows={5}
										rowsMax={10}
										label='Classroom Description'
										value={classroomDescription}
										onChange={updateClassroomDescription}
									/>
								</FormControl>
							</Grid>
						</Grid>
					)}
				</Container>
			</form>
		</Page>
	);
};

AddClass.defaultProps = {
	existingClasses: PropTypes.array.isRequired,
	isLoading: PropTypes.bool,
};

export default AddClass;
