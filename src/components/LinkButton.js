import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';

const LinkButton = ({ onClick, href, external, inNewTab, color, size, variant, ...props }) => {
	const navigate = useNavigate();
	const buttonVariant = variant ? variant : 'contained';
	const buttonSize = size ? size : 'large';
	const buttonColor = color ? color : 'primary';

	const internalVisit = () => {
		onClick();
		if (external) {
			if (inNewTab) {
				window.open(href);
			} else {
				window.location.href = href;
			}
		} else if (href) {
			if (href.indexOf('mailto') === -1) {
				navigate(href);
			} else {
				window.location.href = href;
			}
		}
	};
	return (
		<Button
			{...props}
			color={buttonColor}
			variant={buttonVariant}
			size={buttonSize}
			onClick={internalVisit}
		/>
	);
};

LinkButton.defaultProps = { onClick: () => {} };

LinkButton.propTypes = {
	onClick: PropTypes.func,
	href: PropTypes.string,
	external: PropTypes.bool,
	inNewTab: PropTypes.bool,
};

export default LinkButton;
