import { useGetRequest } from '../../../hooks/request';

const useGetClassDetails = (class_id) => {
	const { isLoading, error, data } = useGetRequest({
		url: `/classes/${class_id}`,
		falseStatusError: 'Error reading class info',
		dataEmptyError: 'This class could not be found!',
		fetchError: 'Unable to read class info',
	});

	return { isLoading, error, classInfo: data };
};

export default useGetClassDetails;
