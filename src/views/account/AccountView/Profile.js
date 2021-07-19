import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Divider,
	Typography,
	makeStyles,
} from '@material-ui/core';

import { openUploadWidget } from '../../../components/CloudinaryService';
import { userDetails, Http, tryAgainMsg } from '../../../helpers';

const user = { timezone: 'PDT' };

const useStyles = makeStyles(() => ({
	root: {
		width: '100%',
	},
	avatar: {
		height: 100,
		width: 100,
	},
}));

const Profile = ({ className, ...rest }) => {
	const classes = useStyles();
	console.log(userDetails);
	const { picture, family_name, given_name = '', country, city } = userDetails;

	const handleUploadStart = () => {
		let nameTag = '';
		if (given_name) nameTag += given_name.toLowerCase();
		if (family_name)
			nameTag += family_name.charAt(0).toUpperCase() + family_name.substring(1).toLowerCase();

		const uploadOptions = {
			cloudName: 'lienista',
			uploadPreset: 'rj9uevya',
			tags: ['userUploads', 'profilePhoto', nameTag],
			publicId: `profile_photo_${userDetails.id}`,
			resourceType: 'image',
			cropping: true,
			googleDriveClientId:
				'538547163986-6omb58e5v15lf7gdc60m3nls88f8nfjh.apps.googleusercontent.com',
			source: ['camera', 'local', 'google_drive'],
			defaultSource: 'camera',
			multiple: false,
			clientAllowedFormats: ['jpeg', 'png', 'gif'],
			maxFileSize: 5 * 1024 * 1024,
			context: {
				alt: `${given_name} ${family_name} profile photo`,
				caption: `Photo of ${given_name} ${family_name}`,
			},
			uploadSignature: (callback, param) => {
				Http().secureRequest({
					url: '/generate-cloudinary-signature',
					method: 'POST',
					body: param,
					successCallback: ({ status, data, error }) => {
						if (!status) {
							return console.error(error || 'Could not generate signature');
						}
						callback(data);
					},
					errorCallback: () => console.error('Unable to reach the server. ' + tryAgainMsg()),
				});
			},
		};

		openUploadWidget(uploadOptions, (error, photos) => {
			if (!error) {
				console.log('photo uploaded', photos);
				// if (photos.event === 'success') {
				// }
			} else {
				console.error('photo upload error', error);
			}
		});
	};

	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<CardContent>
				<Box alignItems='center' display='flex' flexDirection='column'>
					<Avatar className={classes.avatar} src={picture} />
					<Typography color='textPrimary' gutterBottom variant='h3'>
						{given_name} {family_name}
					</Typography>
					<Typography color='textSecondary' variant='body1'>
						{city || ''} {country || ''}
					</Typography>
					<Typography className={classes.dateText} color='textSecondary' variant='body1'>
						{`${moment().format('hh:mm A')} ${user.timezone}`}
					</Typography>
				</Box>
			</CardContent>
			<Divider />
			<CardActions>
				<Button color='primary' fullWidth variant='text' onClick={handleUploadStart}>
					Upload picture
				</Button>
				<Button color='primary' fullWidth variant='contained'>
					Your public profile
				</Button>
			</CardActions>
		</Card>
	);
};

Profile.propTypes = {
	className: PropTypes.string,
};

export default Profile;
