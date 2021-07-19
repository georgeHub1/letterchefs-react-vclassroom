import React, { Fragment } from 'react';
import Container from '@material-ui/core/Container';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FormControl from '@material-ui/core/FormControl';

const InviteTeachers = ({ value, updateValue }) => {
	return (
		<Fragment>
			<Container>
				<FormControl fullWidth>
					<TextareaAutosize
						rowsMin={10}
						rowsMax={15}
						maxLength='4000'
						aria-label='Enter email address to invite teachers, separated by commas'
						placeholder='Enter email address to invite teachers, separated by commas'
						value={value}
						onChange={updateValue}
					/>
				</FormControl>
			</Container>
		</Fragment>
	);
};

export default InviteTeachers;
