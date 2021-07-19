import React, { Fragment } from 'react';
import { TextField, FormControl, FormHelperText } from '@material-ui/core';

const InviteTeacher = ({ value, updateValue }) => {
	return (
		<Fragment>
			<FormControl fullWidth>
				<TextField
					fullWidth
					variant='outlined'
					type='email'
					aria-label='Enter an email address to invite a guest teacher to class'
					placeholder='Enter an email address to invite a guest teacher to class'
					value={value}
					onChange={updateValue}
				/>
				<FormHelperText>
					Invite a guest teacher to host this class with you. The more the merrier.
				</FormHelperText>
			</FormControl>
		</Fragment>
	);
};

export default InviteTeacher;
