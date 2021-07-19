import { useState, useCallback } from 'react';

const useTicketingDetails = () => {
	const [priceType, setPriceType] = useState('free');
	const [price, setPrice] = useState('0.00');
	const handleChangePrice = useCallback((e) => setPrice(e.target.value), []);

	const currency = 'USD';

	return { currency, priceType, setPriceType, price, handleChangePrice };
};

export default useTicketingDetails;
