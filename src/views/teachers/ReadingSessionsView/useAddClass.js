import { useState, useCallback, useEffect } from 'react';

import useInputChange from '../../../hooks/input-change';

const useAddClass = (props = {}) => {
	const [classroomLongName, updateClassroomLongName] = useInputChange(props.name || '');
	const [classroomDescription, updateClassroomDescription] = useInputChange(
		props.description || ''
	);
	const [gradeLevel, updateGradeLevel] = useInputChange(props.grade_level || '');

	const [classID, updateClassID] = useInputChange(props.class_id || '');

	useEffect(() => updateClassroomLongName(props.name), [props.name, updateClassroomLongName]);
	useEffect(() => updateClassroomDescription(props.description), [
		props.description,
		updateClassroomDescription,
	]);
	useEffect(() => updateGradeLevel(props.grade_level), [props.grade_level, updateGradeLevel]);
	useEffect(() => updateClassID(props.class_id), [props.class_id, updateClassID]);

	const [isSelectingExisting, setIsSelectingExisting] = useState(false);
	const toggleIsSelectingExisting = useCallback(() => setIsSelectingExisting((x) => !x), []);

	return {
		isSelectingExisting,
		toggleIsSelectingExisting,
		classroomLongName,
		classroomDescription,
		gradeLevel,
		classID,
		updateClassroomLongName,
		updateClassroomDescription,
		updateGradeLevel,
		updateClassID,
	};
};

export default useAddClass;
