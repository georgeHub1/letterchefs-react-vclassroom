import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';

// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		'& > *': {
// 			margin: theme.spacing(1),
// 		},
// 	},
// }));

function TextMaskCustom({ inputRef, ...other }) {
	// const classes = useStyles();

	return (
		<MaskedInput
			{...other}
			ref={(ref) => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={['(', /\d/, /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
			placeholderChar={'\u2000'}
			showMask
		/>
	);
}

TextMaskCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
};

export default TextMaskCustom;
