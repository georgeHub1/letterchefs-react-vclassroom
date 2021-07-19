import { useState } from 'react';

import { Http, debounce, userDetails } from '../../../helpers';
import useInputChange from '../../../hooks/input-change';

const useAddClass = () => {
	const [fullName, updateFullName] = useInputChange(
		(userDetails.given_name + ' ' + userDetails.family_name).trim()
	);
	const [gradeLevel, updateGradeLevel] = useInputChange(userDetails.grade_level);
	const [org, updateOrg] = useInputChange(userDetails.grade_level);
	const [title, updateTitle, setTitle] = useInputChange(userDetails.title);

	const [classroomUrl, updateClassroomUrl] = useState('');
	const [classroomLongName, updateClassroomLongName] = useState('');

	const [classroomName, setClassroomName] = useState('');
	console.log('class room name', classroomName);
	const getClassroomName = (e) => {
		const enteredClass = e.target.value;
		setClassroomName(enteredClass);
		debounce(() => {
			Http().secureRequest({
				url: `/classes/${enteredClass}`,
				successCallback: ({ status }) => {
					if (status) {
						console.error(`Class ${enteredClass} already exists.`);
					}
				},
				noContent: () => console.log('All fine! Class does not exist'),
				errorCallback: () => console.error('Unable to connect'),
			});
		}, 2500)();
	};

	return {
		classroomLongName,
		classroomUrl,
		fullName,
		gradeLevel,
		title,
		org,
		updateFullName,
		updateGradeLevel,
		updateOrg,
		getClassroomName,
		updateTitle,
		updateClassroomUrl,
		updateClassroomLongName,
		setTitle,
	};
};

export default useAddClass;
