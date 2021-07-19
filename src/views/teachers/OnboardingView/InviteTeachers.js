import React, { Fragment } from 'react';
import Container from '@material-ui/core/Container';
import { FormControl, TextField } from '@material-ui/core';

const InviteParents = ({ value, updateValue }) => {
	return (
		<Fragment>
			<Container>
				<FormControl fullWidth>
					<TextField
						variant='outlined'
						multiline
						rows={1}
						rowsMax={10}
						maxLength='4000'
						aria-label='Enter an email address to invite a guest teacher'
						placeholder='Enter an email address to invite a guest teacher'
						value={value}
						onChange={updateValue}
					/>
				</FormControl>
			</Container>
		</Fragment>
	);
};

export default InviteParents;
