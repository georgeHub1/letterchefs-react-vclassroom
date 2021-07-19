export default (fn, time = 1500) => {
	let timeout;

	return function () {
		const functionCall = () => fn.apply(this, arguments);

		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	};
};
