import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, CircularProgress } from '@material-ui/core';

import Page from '../../components/Page';
import { signOut } from '../../helpers';

const LogoutView = () => {
	const navigate = useNavigate();

	useEffect(() => {
		signOut(false);
		const timer = setTimeout(() => navigate('/login'), 1500);

		// clean up
		return () => {
			clearTimeout(timer);
		};
	});

	return (
		<Page title='Logging out...'>
			<Container>
				<CircularProgress />
			</Container>
		</Page>
	);
};

export default LogoutView;
