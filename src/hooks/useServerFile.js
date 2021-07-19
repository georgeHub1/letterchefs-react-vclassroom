import { useState, useEffect } from 'react';
import { Http, tryAgainMsg } from '../helpers';

const useServerFile = ({ path: filePath, secured }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [content, setContent] = useState('');

	useEffect(() => {
		setLoading(true);
		const req = Http()[secured ? 'secureRequest' : 'makeReq']({
			url: `/public${secured ? '-protected' : ''}/${filePath}`,
			responseType: 'text',
			successCallback: (content, status) => {
				if (status === 200 || status === 304) setContent(content);
				else setError(content);
			},
			errorCallback: () => setError('Could not get file. ' + tryAgainMsg()),
		});

		req.finally(() => setLoading(false));
	}, [filePath, secured]);

	return { loading, error, content };
};

export default useServerFile;
