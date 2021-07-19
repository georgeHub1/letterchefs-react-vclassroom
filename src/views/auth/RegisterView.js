import React, { Fragment } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
	Box,
	Button,
	Checkbox,
	Container,
	FormHelperText,
	Link,
	TextField,
	Typography,
	makeStyles,
} from '@material-ui/core';

import LoginView from './LoginView';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		height: '100vh',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const RegisterView = () => {
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<Fragment>
			<LoginView subtitle='Make History in Literacy.' />
		</Fragment>
	);
};

export default RegisterView;
