import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	CircularProgress,
	Container,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemSecondaryAction,
} from '@material-ui/core';
import { Visibility } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

import LinkButton from '../../components/LinkButton';

const ListClasses = ({ isLoading, errMsg, classes }) => {
	const hasClasses = classes && classes.length > 0;
	return (
		<Container maxWidth={false}>
			{hasClasses && errMsg && <Alert severity='error'>{errMsg}</Alert>}
			<List dense>
				{hasClasses &&
					classes.map(({ class_id, name, students }, ind) => (
						<ListItem key={ind} button divider title={`View ${name}`}>
							<ListItemIcon>
								<Visibility />
							</ListItemIcon>
							<ListItemText primary={name} secondary={(students || '').length + ' students'} />
							<ListItemSecondaryAction>
								<LinkButton href={`/class/${class_id}`}>View Class</LinkButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
			</List>
			{isLoading && <CircularProgress />}
			{!isLoading && !hasClasses && (
				<Grid container>
					<Grid item xs={12} md={9}>
						<Alert severity='error'>No classes yet</Alert>
					</Grid>
					<Grid item xs={12} md={3}>
						<Button color='primary' variant='contained' size='large'>
							Create New Class
						</Button>
					</Grid>
				</Grid>
			)}
		</Container>
	);
};

ListClasses.propTypes = {
	isLoading: PropTypes.bool,
	errMsg: PropTypes.any,
	classes: PropTypes.array.isRequired,
};

export default ListClasses;
