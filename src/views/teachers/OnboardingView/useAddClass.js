import { useState } from 'react';

import { Http, debounce, userDetails } from '../../../helpers';
import useInputChange from '../../../hooks/input-change';

const useAddClass = () => {
	const [fullName, updateFullName, hasFullNameErr, setHasFullNameErr] = useInputChange(
		((userDetails.given_name || '') + ' ' + (userDetails.family_name || '')).trim() ||
			userDetails.name ||
			''
	);
	const [gradeLevel, updateGradeLevel] = useInputChange(userDetails.grade_level || '');
	const [org, updateOrg, hasOrgErr, setHasOrgErr] = useInputChange(
		userDetails.organization_name || ''
	);
	const [title, updateTitle] = useInputChange(userDetails.title || '');

	const [classroomUrl, updateClassroomUrl, hasClassUrlErr, setHasClassUrlErr] = useInputChange('');
	const [classroomLongName, updateClassroomLongName] = useState('');
	const [classroomDescription, updateClassroomDescription] = useInputChange('');

	const [classroomName, setClassroomName] = useState('');
	console.log('classroom name', classroomName);
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
		classroomDescription,
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
		updateClassroomDescription,
		hasOrgErr,
		setHasOrgErr,
		hasFullNameErr,
		setHasFullNameErr,
		hasClassUrlErr,
		setHasClassUrlErr,
	};
};

export default useAddClass;
