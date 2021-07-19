import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, IconButton, Icon, makeStyles, TextField, Typography, } from '@material-ui/core';
import { green, red, common, grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	copyContainer: {
		position: 'relative',
		display: 'flex',
	},
	notchedOutline: {
		borderColor: grey[300],
	},
	placement: {
		position: 'absolute',
		top: 8,
		right: 65,
		padding: theme.spacing(1),
		zIndex: 1000,
	},
	green: {
		backgroundColor: green[500],
		color: common.white,
	},
	red: {
		backgroundColor: red[500]
	}
}));

const CopyText = ({ value, copiedClassName, copied, setCopied, ...props }) => {
	const classes = useStyles();
	const handleCopy = () => {
		const fallbackCopy = (text) => {
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.top = '0';
			textArea.style.left = '0';
			textArea.style.position = 'fixed';
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				const copied = document.execCommand('copy');
				setCopied(copied ? true : 0);
			} catch (err) {
				setCopied(0);
			}

			document.body.removeChild(textArea);
		};

		if (!navigator.clipboard) return fallbackCopy(value);

		navigator.clipboard.writeText(value).then(
			() => setCopied(true),
			() => fallbackCopy(value)
		);
	};

	return (
		<FormControl fullWidth className={classes.copyContainer}>
			{copied !== false && (
				<Typography
					{...(copiedClassName ? { className: copiedClassName } : {})}
					className={`${classes.placement} ${copied ? classes.green : classes.red}`}
				>
					{!copied && 'Could not copy'}
					{copied && 'Copied!'}
				</Typography>
			)}
			<TextField
				{...props}
				className={copiedClassName}
				value={value}
				InputProps={{
					//className: classes.copy,
					className: copiedClassName,
					endAdornment: (
						<IconButton onClick={handleCopy}>
							<Icon>file_copy</Icon>
						</IconButton>
					),
				}}
			/>
		</FormControl>
	);
};

CopyText.propTypes = {
	value: PropTypes.string.isRequired,
	copiedClassName: PropTypes.string,
	copied: PropTypes.bool.isRequired,
	setCopied: PropTypes.func.isRequired,
};

export default CopyText;
