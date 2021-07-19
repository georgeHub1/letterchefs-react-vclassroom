import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { Http, tryAgainMsg } from '../helpers';

export const useGetRequest = ({ url, falseStatusError, dataEmptyError, fetchError, ...props }) => {
	const latestProps = useRef({});

	useEffect(() => {
		latestProps.current = props;
	});

	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [data, setData] = useState({});

	const [falseStatusErr, setFalseStatusErr] = useState('');
	const [dataEmptyErr, setDataEmptyErr] = useState('');
	const [fetchErr, setFetchErr] = useState('');

	const [completed, setCompleted] = useState(false);
	const [succeeded, setSucceeded] = useState(false);

	useEffect(() => {
		const { onFalseStatus = () => {} } = latestProps.current;
		if (falseStatusErr) onFalseStatus(falseStatusErr);
	}, [falseStatusErr]);

	useEffect(() => {
		const { onDataEmpty = () => {} } = latestProps.current;
		if (dataEmptyErr) onDataEmpty(dataEmptyErr);
	}, [dataEmptyErr]);

	useEffect(() => {
		const { onFetchError = () => {} } = latestProps.current;
		if (fetchErr) onFetchError(fetchErr);
	}, [fetchErr]);

	useEffect(() => {
		const { onComplete = () => {} } = latestProps.current;
		if (completed) {
			onComplete();
		}
	}, [completed]);

	useEffect(() => {
		const { onSuccess = () => {} } = latestProps.current;
		if (succeeded) onSuccess(succeeded);
	}, [succeeded]);

	useEffect(() => {
		if (!url) return;
		setIsLoading(true);
		const rq = Http().secureRequest({
			url,
			successCallback: ({ status, data, error }) => {
				if (!status || !data) {
					const err = falseStatusError || error || 'False status was returned';
					setError(err);
					setFalseStatusErr(err);
					return;
				}
				if (data.length === 0) {
					const err = dataEmptyError || 'Data is empty';
					setError(err);
					setDataEmptyErr(err);
					return;
				}
				setData(data);
				setSucceeded(true);
			},
			noContent: () => {
				const err = dataEmptyError || 'Data is empty';
				setError(err);
				setDataEmptyErr(err);
			},
			errorCallback: () => {
				const err = (fetchError || 'Fetch error') + '. ' + tryAgainMsg();
				setError(err);
				setFetchErr(err);
			},
		});

		rq.finally(() => {
			setIsLoading(false);
			setCompleted(true);
		});
	}, [url, falseStatusError, dataEmptyError, fetchError]);

	return { isLoading, error, data };
};

useGetRequest.propTypes = {
	url: PropTypes.string,
	falseStatusError: PropTypes.string,
	dataEmptyError: PropTypes.string,
	fetchError: PropTypes.string,
	onFalseStatus: PropTypes.func,
	onDataEmpty: PropTypes.func,
	onFetchError: PropTypes.func,
	onComplete: PropTypes.func,
	onSuccess: PropTypes.func,
};
