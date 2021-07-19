import { useGetRequest } from '../../../hooks/request';

const useGetEventInfo = (eventId) => {
	const { isLoading, error, data } = useGetRequest({
		url: `/reading-schedules/${eventId}`,
		falseStatusError: 'Error getting reading event',
		dataEmptyError: 'This reading event could not be found!',
		fetchError: 'Unable to get reading event',
	});

	return { isLoading, error, eventInfo: data };
};

export default useGetEventInfo;
