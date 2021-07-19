import { useState, useCallback } from 'react';

const useInputChange = (defaultValue) => {
	const [hasErr, setHasErr] = useState(false);
	const [input, setInput] = useState(() => defaultValue || '');
	const handleInputChange = useCallback((e) => {
		setHasErr(false);
		if (typeof e === 'string') setInput(e);
		else if (typeof e === 'object' && 'target' in e) {
			const value = e.target.value;
			setInput(value);
			if (typeof e.target.getAttribute !== 'function') return;
			const pattern = e.target.getAttribute('pattern');
			if (pattern && !new RegExp(pattern).test(value)) setHasErr(true);
		} else console.error('Unsupported type was passed to use input change updater value');
	}, []);

	return [input, handleInputChange, hasErr, setHasErr];
};

export default useInputChange;
