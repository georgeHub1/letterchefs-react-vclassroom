import { useState, useEffect } from 'react';

const useCopyText = () => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (copied === false) return;
		const timer = setTimeout(() => setCopied(false), 2500);

		// clean up
		return () => {
			clearTimeout(timer);
		};
	}, [copied]);

	return [copied, setCopied];
};

export default useCopyText;
