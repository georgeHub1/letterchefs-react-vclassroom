import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Color from '../../mixins/palette';

const useStyles = makeStyles((theme) => ({
	allowPermissions: {
		background: Color.ombre.tangerine,
		padding: theme.spacing(3),
		border: `3px solid ${Color.hex.grape}`,
	},
}));

const AllowPermissions = () => {
	const classes = useStyles();
	return (
		<Fragment>
			<div className={classes.allowPermissions}>
				<Typography variant='h6'>Click Allow</Typography>
				<Typography variant='body1'>to grant browser access to camera and microphone.</Typography>
			</div>
		</Fragment>
	);
};

export default AllowPermissions;
