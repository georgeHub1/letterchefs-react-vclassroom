import React, { useState, useEffect } from 'react';
// import { Typography } from '@material-ui/core';

import Page from '../../components/Page';
import ListClasses from './ListClasses';
// import AddClass from '../teachers/OnboardingView/AddClass';
// import useAddClass from '../teachers/OnboardingView/useAddClass';

import { Http, tryAgainMsg /*userDetails*/ } from '../../helpers';

// const { user_type } = userDetails;
// const isTeacher = user_type === 'teacher';
// const isStudent = user_type === 'student';

const Class = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrorMessage] = useState('');

	const [classes, setClasses] = useState([]);

	useEffect(() => {
		setIsLoading(true);

		const { secureRequest, abort } = Http();
		const rq = secureRequest({
			url: '/classes',
			successCallback: ({ status, data, error }) => {
				if (status !== true) return setErrorMessage(error || 'Error while getting class');
				setClasses(data);
			},
			noContent: () => setErrorMessage('No classes'),
			errorCallback: () => setErrorMessage('Unable to reach the server. ' + tryAgainMsg()),
		});

		rq.finally(() => setIsLoading(false));

		// clean up
		return () => {
			abort();
		};
	}, []);

	// const addClassProps = useAddClass();

	return (
		<Page title='Classes | LetterChefs'>
			<ListClasses {...{ isLoading, errMsg, classes }} />
			{/*isTeacher && (
				<React.Fragment>
					<Typography vriant='h4' gutterBottom>
						Add a New Class
					</Typography>
					<AddClass {...addClassProps} />
				</React.Fragment>
			)*/}
			{/*isStudent && (
				<React.Fragment>
					<Typography vriant='h4' gutterBottom>
						Join a Class
					</Typography>
				</React.Fragment>
			)*/}
		</Page>
	);
};

export default Class;
